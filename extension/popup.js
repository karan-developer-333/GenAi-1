/**
 * Knowledge OS - Popup Logic
 * Modernized for Sandra AI Theme
 */

const API_ENDPOINT = 'https://gen-ai-1-testing1234.vercel.app/api/items/';

// Source type metadata mapping
const SOURCE_TYPES = {
    article: { label: 'Article', icon: '📰', showText: true },
    tweet: { label: 'Tweet', showText: true },
    image: { label: 'Image', showText: true },
    youtube: { label: 'YouTube', showText: false },
    pdf: { label: 'PDF', showText: false },
};

document.addEventListener('DOMContentLoaded', async () => {
    // --- Selectors ---
    const elements = {
        selectionText: document.getElementById('selection-text'),
        selectionField: document.getElementById('selection-field'),
        noteInput: document.getElementById('note-input'),
        saveBtn: document.getElementById('save-btn'),
        message: document.getElementById('message'),
        statusIndicator: document.getElementById('status-indicator'),

        // Settings
        settingsToggle: document.getElementById('settings-toggle'),
        settingsPanel: document.getElementById('settings-panel'),
        userIdInput: document.getElementById('user-id-input'),
        saveSettingsBtn: document.getElementById('save-settings-btn'),

        // Source Chips
        chips: document.querySelectorAll('.chip'),

        // Image Section
        imageSection: document.getElementById('image-section'),
        selectImageBtn: document.getElementById('select-image-btn'),
        imageInfoCard: document.getElementById('image-info-card'),
        imagePreview: document.getElementById('image-preview'),
        clearImageBtn: document.getElementById('clear-image-btn'),

        // PDF Section
        pdfSection: document.getElementById('pdf-section'),
        pdfUrlPreview: document.getElementById('pdf-url-preview'),
        pdfName: document.getElementById('pdf-name')
    };

    let currentTabData = null;
    let selectedImageUrl = null;
    let pickerActive = false;
    let selectedType = 'article';
    let savedUserId = '';

    // --- 1. Initialize Settings & Status ---
    chrome.storage.local.get(['userId', 'pendingImage'], (result) => {
        if (result.userId) {
            savedUserId = result.userId;
            elements.userIdInput.value = savedUserId;
        }
        if (result.pendingImage?.imageUrl) {
            applyImageData(result.pendingImage.imageUrl);
        }
    });

    const checkServerStatus = async () => {
        try {
            const res = await fetch('https://gen-ai-1-testing1234.vercel.app/api/items', {
                method: 'GET',
                headers: { 'x-user-id': savedUserId || 'anon' }
            });
            elements.statusIndicator.style.background = res.ok ? '#4ade80' : '#f87171';
            elements.statusIndicator.style.boxShadow = res.ok ? '0 0 10px #4ade80' : '0 0 10px #f87171';
        } catch {
            elements.statusIndicator.style.background = '#f87171';
        }
    };
    checkServerStatus();

    // --- 2. Tab Info & Auto-detection ---
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
        currentTabData = { url: tab.url, title: tab.title };
        autoDetectType(tab.url);

        // Get highlighted text automatically
        try {
            const res = await chrome.tabs.sendMessage(tab.id, { action: 'GET_SELECTION' });
            if (res?.selectedText) elements.selectionText.value = res.selectedText;
        } catch (e) { console.log("Content script not ready"); }
    }

    // --- 3. UI Event Listeners ---

    // Toggle Settings
    elements.settingsToggle.addEventListener('click', () => {
        elements.settingsPanel.classList.toggle('hidden');
    });

    // Save Settings
    elements.saveSettingsBtn.addEventListener('click', () => {
        const val = elements.userIdInput.value.trim();
        if (!val) return showMessage('Enter a valid ID', 'error');

        chrome.storage.local.set({ userId: val }, () => {
            savedUserId = val;
            showMessage('Identity Verified ✓', 'success');
            setTimeout(() => elements.settingsPanel.classList.add('hidden'), 1000);
            checkServerStatus();
        });
    });

    // Handle Source Chip Clicks
    elements.chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const type = chip.getAttribute('data-type');
            updateTypeUI(type);
        });
    });

    // Image Picker Logic
    elements.selectImageBtn.addEventListener('click', async () => {
        if (pickerActive) return disablePicker();

        pickerActive = true;
        elements.selectImageBtn.textContent = 'Selecting... (Click an image)';
        elements.selectImageBtn.style.borderColor = '#3b82f6';

        try {
            await chrome.tabs.sendMessage(tab.id, { action: 'ENABLE_IMAGE_PICKER' });
        } catch (err) {
            showMessage('Reload page to use picker', 'error');
            disablePicker();
        }
    });

    elements.clearImageBtn.addEventListener('click', clearImage);

    // Receive Message from Content Script (Image selection)
    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.action === 'IMAGE_SELECTED') {
            applyImageData(msg.imageUrl);
            pickerActive = false;
        }
        if (msg.action === 'IMAGE_PICKER_CANCELLED') disablePicker();
    });

    // --- 4. Final Save Action ---
    elements.saveBtn.addEventListener('click', async () => {
        if (!savedUserId) {
            showMessage('Please set User ID in settings', 'error');
            elements.settingsPanel.classList.remove('hidden');
            return;
        }

        const text = elements.selectionText.value.trim();
        const note = elements.noteInput.value.trim();

        // Validation for Article/Tweet/Image
        if (selectedType !== 'pdf' && SOURCE_TYPES[selectedType].showText && !text && !selectedImageUrl) {
            return showMessage('Please capture some content', 'error');
        }

        const payload = {
            ...currentTabData,
            sourceType: selectedType,
            selectedText: text || null,
            note: note || null,
            imageUrl: selectedImageUrl || null,
            timestamp: new Date().toISOString()
        };

        // UI State: Saving
        elements.saveBtn.disabled = true;
        elements.saveBtn.innerHTML = '<span>Processing...</span><div class="btn-glow"></div>';

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': savedUserId
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showMessage('Stored in Knowledge OS ✓', 'success');
                chrome.storage.local.remove('pendingImage');
                setTimeout(() => window.close(), 1500);
            } else {
                throw new Error();
            }
        } catch (error) {
            showMessage('Connection lost. Try again.', 'error');
            elements.saveBtn.disabled = false;
            elements.saveBtn.innerHTML = '<span>Save to Knowledge</span><div class="btn-glow"></div>';
        }
    });

    // --- Helper Functions ---

    function updateTypeUI(type, isAutoDetected = false) {
        selectedType = type;
        // Update Chips UI
        elements.chips.forEach(c => {
            c.classList.toggle('active', c.getAttribute('data-type') === type);
        });

        // Show/Hide Fields
        const meta = SOURCE_TYPES[type];
        elements.selectionField.classList.toggle('hidden', !meta.showText);
        elements.imageSection.classList.toggle('hidden', type !== 'image');
        elements.pdfSection.classList.toggle('hidden', type !== 'pdf');

        if (type === 'youtube') {
            elements.selectionText.placeholder = "YouTube URL will be captured automatically";
        } else {
            elements.selectionText.placeholder = "Capture content from page...";
        }

        // Auto-detected message for PDF
        if (type === 'pdf' && isAutoDetected) {
            const fileName = currentTabData.url.split('/').pop() || 'PDF Document';
            elements.pdfName.textContent = fileName;
        }
    }

    function autoDetectType(url) {
        const lowUrl = url.toLowerCase();
        if (lowUrl.includes('youtube.com') || lowUrl.includes('youtu.be')) updateTypeUI('youtube');
        else if (lowUrl.includes('twitter.com') || lowUrl.includes('x.com')) updateTypeUI('tweet');
        else if (lowUrl.endsWith('.pdf') || /\.pdf(?:\?|$)/i.test(url)) updateTypeUI('pdf', true);
        else updateTypeUI('article');
    }

    function applyImageData(url) {
        selectedImageUrl = url;
        elements.imagePreview.src = url;
        elements.imageInfoCard.classList.remove('hidden');
        elements.selectImageBtn.textContent = 'Image Captured ✓';
        elements.selectImageBtn.style.color = '#4ade80';
        elements.selectImageBtn.style.borderStyle = 'solid';
    }

    function disablePicker() {
        pickerActive = false;
        elements.selectImageBtn.textContent = 'Select Image from Page';
        elements.selectImageBtn.style.color = '';
        elements.selectImageBtn.style.borderStyle = 'dashed';
    }

    function clearImage() {
        selectedImageUrl = null;
        elements.imageInfoCard.classList.add('hidden');
        disablePicker();
        chrome.storage.local.remove('pendingImage');
    }

    function showMessage(msg, type) {
        elements.message.textContent = msg;
        elements.message.className = `status-msg ${type}`;
        setTimeout(() => { elements.message.textContent = ''; }, 3000);
    }
});