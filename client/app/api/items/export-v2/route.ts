import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import { getAuthUserId, unauthorizedResponse } from '@/lib/auth';
import { getAllItems } from '@/services/server/ItemService';
import { 
  processAllItems, 
  calculateMetadata, 
  generateNarrativeWithAI, 
  logDataFormats,
  PDFExportData 
} from '@/services/pdf/pdfDataProcessor';
import { generateQuickPDF, generateDebugReport } from '@/services/pdf/pdfGenerator';

const CHROME_PATH = process.env.CHROME_PATH || '/usr/bin/google-chrome';

export interface ExportOptions {
  useAI?: boolean;
  includeTOC?: boolean;
  includeNarrative?: boolean;
  layoutFlow?: 'chronological' | 'thematic' | 'importance' | 'mixed';
  featuredCount?: number;
  debugMode?: boolean;
}

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return unauthorizedResponse();

  const searchParams = req.nextUrl.searchParams;
  const useAI = searchParams.get('ai') !== 'false';
  const _includeTOC = searchParams.get('toc') !== 'false';
  const _includeNarrative = searchParams.get('narrative') !== 'false';
  const layoutFlow = (searchParams.get('flow') as ExportOptions['layoutFlow']) || 'mixed';
  const _featuredCount = parseInt(searchParams.get('featured') || '3', 10);
  const debugMode = searchParams.get('debug') === 'true';

  try {
    const items = await getAllItems(userId);
    
    if (items.length === 0) {
      return NextResponse.json({ error: 'No items to export' }, { status: 400 });
    }

    logDataFormats(items);

    const processedItems = processAllItems(items);
    const metadata = calculateMetadata(processedItems);
    
    console.log('\n📊 Processing completed:');
    console.log(`  - Total items: ${processedItems.length}`);
    console.log(`  - Total words: ${metadata.totalWords}`);
    console.log(`  - Categories: ${metadata.categories.length}`);
    console.log(`  - Use AI: ${useAI}`);
    
    let narrative;
    if (useAI) {
      console.log('\n🤖 Generating AI narrative...');
      narrative = await generateNarrativeWithAI(processedItems, metadata);
      console.log('  - Narrative generated successfully');
    } else {
      narrative = {
        introduction: `Welcome to your curated knowledge collection. This digest brings together ${metadata.totalItems} saved items from your personal library, spanning ${metadata.categories.slice(0, 3).map(c => c.name).join(', ')} and covering approximately ${metadata.totalReadingTime} minutes of reading material.`,
        themes: metadata.categories.slice(0, 3).map(c => c.name),
        connections: [],
        insights: [
          `Your collection contains ${metadata.totalItems} items across ${metadata.categories.length} different categories.`,
          metadata.hasVideos ? 'You have saved video content alongside articles, showing a diverse approach to learning.' : 'Your collection focuses primarily on written content.',
          metadata.totalReadingTime > 30 
            ? `With approximately ${metadata.totalReadingTime} minutes of content, this represents a substantial body of knowledge.` 
            : `A focused collection perfect for quick reference and review.`,
        ],
        conclusion: `This collection represents your ongoing journey of learning and discovery. Continue building your knowledge library to uncover more connections and insights.`,
      };
    }

    const exportData: PDFExportData = {
      items: processedItems,
      metadata,
      narrative,
      layout: {
        sections: [],
        flow: layoutFlow,
      },
    };

    if (debugMode) {
      const report = generateDebugReport(exportData);
      console.log(report);
      return NextResponse.json({ 
        message: 'Debug report generated',
        data: {
          items: processedItems.length,
          metadata,
          narrative,
        },
        report,
      });
    }

    console.log('\n📄 Generating PDF HTML...');
    const html = generateQuickPDF(exportData);
    console.log('  - HTML generated, length:', html.length, 'bytes');

    console.log('\n🔧 Launching browser...');
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--allow-running-insecure-content',
      ],
    });

    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });

    console.log('  - Page content set, generating PDF...');

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });

    await browser.close();
    console.log('\n✅ PDF generated successfully!');
    console.log(`   Size: ${(pdf.length / 1024).toFixed(1)} KB`);

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="mnemoai-knowledge-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('\n❌ PDF export error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
