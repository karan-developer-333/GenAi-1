/**
 * Content script to handle DOM interaction, selection capture, and image picking.
 */

let imagePickerActive = false;
let hoveredImageEl = null;

// Highlight style for image picker mode
const HIGHLIGHT_STYLE = '3px solid #6366f1';
const CURSOR_STYLE = 'crosshair';

function onImageClick(e) {
    const target = e.target;

    // Always prevent default and stop propagation while picker is active
    // This prevents the popup from losing focus / closing on non-image clicks
    e.preventDefault();
    e.stopPropagation();

    if (target.tagName === 'IMG') {
        const imgUrl = target.src || '';
        const altText = target.alt || '';

        // 1. Persist to storage — popup reads this when it (re)opens
        chrome.storage.local.set({
            pendingImage: {
                imageUrl: imgUrl,
                altText: altText,
                capturedAt: Date.now()
            }
        });

        // 2. Also try runtime message in case popup is still open
        try {
            chrome.runtime.sendMessage({
                action: 'IMAGE_SELECTED',
                imageUrl: imgUrl,
                altText: altText
            });
        } catch (_) {}

        // Deactivate picker after selection
        deactivateImagePicker();
    }
    // If non-image click — do nothing extra, picker stays active
    // (user can click Escape or Cancel button to deactivate)
}

function onImageHover(e) {
    const target = e.target;
    if (target.tagName === 'IMG') {
        if (hoveredImageEl && hoveredImageEl !== target) {
            hoveredImageEl.style.outline = '';
        }
        target.style.outline = HIGHLIGHT_STYLE;
        target.style.cursor = CURSOR_STYLE;
        hoveredImageEl = target;
    }
}

function onImageHoverOut(e) {
    const target = e.target;
    if (target.tagName === 'IMG') {
        target.style.outline = '';
        target.style.cursor = '';
    }
}

function activateImagePicker() {
    imagePickerActive = true;
    document.body.style.cursor = CURSOR_STYLE;
    document.addEventListener('click', onImageClick, true);
    document.addEventListener('mouseover', onImageHover, true);
    document.addEventListener('mouseout', onImageHoverOut, true);
    showPickerBanner();
}

function deactivateImagePicker() {
    imagePickerActive = false;
    document.body.style.cursor = '';
    document.removeEventListener('click', onImageClick, true);
    document.removeEventListener('mouseover', onImageHover, true);
    document.removeEventListener('mouseout', onImageHoverOut, true);
    if (hoveredImageEl) {
        hoveredImageEl.style.outline = '';
        hoveredImageEl = null;
    }
    removePickerBanner();
}

// ---- Banner UI ----
let bannerEl = null;

function showPickerBanner() {
    if (bannerEl) return;
    bannerEl = document.createElement('div');
    bannerEl.id = '__img_picker_banner__';
    bannerEl.innerText = '🖼️ Click on an image to select it — Press Esc to cancel';
    Object.assign(bannerEl.style, {
        position: 'fixed',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#6366f1',
        color: '#fff',
        padding: '8px 20px',
        borderRadius: '0 0 10px 10px',
        fontSize: '13px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: '600',
        zIndex: '2147483647',
        boxShadow: '0 4px 15px rgba(99,102,241,0.5)',
        pointerEvents: 'none',
        letterSpacing: '0.02em'
    });
    document.body.appendChild(bannerEl);
}

function removePickerBanner() {
    if (bannerEl) {
        bannerEl.remove();
        bannerEl = null;
    }
}

// Cancel on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imagePickerActive) {
        deactivateImagePicker();
        chrome.runtime.sendMessage({ action: 'IMAGE_PICKER_CANCELLED' });
    }
});

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'GET_SELECTION') {
        const selection = window.getSelection().toString().trim();
        const title = document.title;
        const url = window.location.href;
        sendResponse({ selectedText: selection, title: title, url: url });
    }

    if (request.action === 'ENABLE_IMAGE_PICKER') {
        activateImagePicker();
        sendResponse({ status: 'activated' });
    }

    if (request.action === 'DISABLE_IMAGE_PICKER') {
        deactivateImagePicker();
        sendResponse({ status: 'deactivated' });
    }

    return true; // Keep message channel open
});
