/**
 * Popup logic for "Save to Knowledge"
 * Source type selector: article, tweet, image, youtube, video, pdf
 * Image data persisted via chrome.storage.local
 */

const API_ENDPOINT = 'https://genai-1-ilh4.onrender.com/api/items/save';

// Source type metadata
const SOURCE_TYPES = {
    article: { label: 'Article', icon: '📰', hint: 'Select text from the article to capture.', showText: true },
    tweet: { label: 'Tweet', icon: '🐦', hint: 'Select the tweet text to capture.', showText: true },
    image: { label: 'Image', icon: '🖼️', hint: 'Use the image picker to select an image.', showText: true },
    youtube: { label: 'YouTube', icon: '📺', hint: 'YouTube video URL will be saved.', showText: false },
    video: { label: 'Video', icon: '🎬', hint: 'Select text or save the video page URL.', showText: true },
    pdf: { label: 'PDF', icon: '📄', hint: 'PDF URL will be saved.', showText: false },
};

document.addEventListener('DOMContentLoaded', async () => {
    const pageTitleEl = document.getElementById('page-title');
    const pageUrlEl = document.getElementById('page-url');
    const selectionTextEl = document.getElementById('selection-text');
    const selectionField = document.getElementById('selection-field');
    const noteInputEl = document.getElementById('note-input');
    const saveBtn = document.getElementById('save-btn');
    const messageEl = document.getElementById('message');
    const statusIndicator = document.getElementById('status-indicator');

    // Settings elements
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const userIdInput = document.getElementById('user-id-input');
    const saveSettingsBtn = document.getElementById('save-settings-btn');

    // Source chips
    const chips = document.querySelectorAll('.source-chip');

    // Image section elements
    const imageSection = document.getElementById('image-section');
    const selectImageBtn = document.getElementById('select-image-btn');
    const imageInfoCard = document.getElementById('image-info-card');
    const imagePreview = document.getElementById('image-preview');
    const imageAltDisplay = document.getElementById('image-alt-display');
    const imageUrlDisplay = document.getElementById('image-url-display');
    const clearImageBtn = document.getElementById('clear-image-btn');
    const pickerBadge = document.getElementById('picker-active-badge');

    let currentTabData = null;
    let selectedImageUrl = null;
    let pickerActive = false;
    let selectedType = null;   // currently selected source type
    let savedUserId = '';

    // ─── Settings Logic ──────────────────────────────────────────────────────
    chrome.storage.local.get(['userId'], (result) => {
        if (result.userId) {
            savedUserId = result.userId;
            userIdInput.value = savedUserId;
        }
    });

    settingsToggle.addEventListener('click', () => {
        settingsPanel.classList.toggle('hidden');
    });

    saveSettingsBtn.addEventListener('click', () => {
        const val = userIdInput.value.trim();
        chrome.storage.local.set({ userId: val }, () => {
            savedUserId = val;
            showMessage('Settings saved!', 'success');
            setTimeout(() => settingsPanel.classList.add('hidden'), 1000);
        });
    });

    // ─── Server Status ───────────────────────────────────────────────────────
    async function checkStatus() {
        try {
            const { userId } = await chrome.storage.local.get(['userId']);
            const res = await fetch('https://genai-1-ilh4.onrender.com/api/items', {
                method: 'GET',
                headers: { 'x-user-id': userId || 'anon' }
            });
            if (res.ok) {
                statusIndicator.classList.add('online');
                statusIndicator.classList.remove('offline');
            } else {
                statusIndicator.classList.add('offline');
                statusIndicator.classList.remove('online');
            }
        } catch {
            statusIndicator.classList.add('offline');
            statusIndicator.classList.remove('online');
        }
    }

    checkStatus();

    // ─── Tab Info + Text Selection ───────────────────────────────────────────
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab) {
        pageTitleEl.textContent = tab.title || 'Untitled Page';
        pageUrlEl.textContent = tab.url || 'No URL';
        currentTabData = { url: tab.url, title: tab.title };

        // Auto-detect type from URL
        autoDetectType(tab.url);

        try {
            const res = await chrome.tabs.sendMessage(tab.id, { action: 'GET_SELECTION' });
            if (res && res.selectedText) selectionTextEl.value = res.selectedText;
        } catch {
            selectionTextEl.placeholder = 'Select text on the page first (or reload the page)';
        }
    }

    // ─── Restore Pending Image from Storage ──────────────────────────────────
    chrome.storage.local.get(['pendingImage'], (result) => {
        if (result.pendingImage && result.pendingImage.imageUrl) {
            applyImageData(result.pendingImage.imageUrl, result.pendingImage.altText || '');
        }
    });

    // ─── Source Type Chip Selection ───────────────────────────────────────────
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            selectType(chip.dataset.type);
        });
    });

    function selectType(type) {
        selectedType = type;
        const meta = SOURCE_TYPES[type];

        // Update chip UI
        chips.forEach(c => {
            c.classList.toggle('active', c.dataset.type === type);
        });

        // Toggle Field Visibility
        if (meta && meta.showText) {
            selectionField.classList.remove('hidden');
        } else {
            selectionField.classList.add('hidden');
        }

        // Show/hide image picker section
        if (type === 'image') {
            imageSection.classList.remove('hidden');
        } else {
            imageSection.classList.add('hidden');
            // Cancel picker if active
            if (pickerActive) disablePicker();
        }

        // Update textarea placeholder based on type
        selectionTextEl.placeholder = meta ? meta.hint : 'Select content...';
    }

    function autoDetectType(url) {
        if (!url) return;
        const lowUrl = url.toLowerCase();

        if (lowUrl.includes('youtube.com/watch') || lowUrl.includes('youtu.be/')) {
            selectType('youtube');
        } else if (lowUrl.includes('twitter.com') || lowUrl.includes('x.com')) {
            selectType('tweet');
        } else if (lowUrl.endsWith('.pdf') || lowUrl.includes('/pdf/') || lowUrl.includes('blob:')) {
            selectType('pdf');
        } else {
            selectType('article');
        }
    }

    // ─── Image Picker Button ─────────────────────────────────────────────────
    selectImageBtn.addEventListener('click', async () => {
        if (pickerActive) {
            await disablePicker();
            return;
        }

        if (selectedImageUrl) clearImage();

        pickerActive = true;
        selectImageBtn.innerHTML = '❌ Cancel Selection';
        selectImageBtn.classList.add('active');
        pickerBadge.classList.remove('hidden');

        try {
            await chrome.tabs.sendMessage(tab.id, { action: 'ENABLE_IMAGE_PICKER' });
        } catch {
            showMessage('Could not activate picker. Reload the page.', 'error');
            await disablePicker();
        }
    });

    // ─── Clear Image ──────────────────────────────────────────────────────────
    clearImageBtn.addEventListener('click', clearImage);

    // ─── Receive Image from Content Script ────────────────────────────────────
    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.action === 'IMAGE_SELECTED') {
            applyImageData(msg.imageUrl, msg.altText || '');
            pickerBadge.classList.add('hidden');
            pickerActive = false;
        }
        if (msg.action === 'IMAGE_PICKER_CANCELLED') {
            disablePicker();
        }
    });

    // ─── Save Button ──────────────────────────────────────────────────────────
    saveBtn.addEventListener('click', async () => {
        const text = selectionTextEl.value.trim();
        const note = noteInputEl.value.trim();
        const meta = SOURCE_TYPES[selectedType];

        if (!savedUserId) {
            showMessage('Please enter your User ID in Settings ⚙️ first!', 'error');
            settingsPanel.classList.remove('hidden');
            return;
        }

        if (!selectedType) {
            showMessage('Please select a content type first.', 'error');
            return;
        }

        const needsText = meta && meta.showText;

        if (needsText && !text && !selectedImageUrl) {
            showMessage('Please capture some content or select an image.', 'error');
            return;
        }

        const dataToSave = {
            ...currentTabData,
            sourceType: selectedType,
            selectedText: text || null,
            note: note || null,
            timestamp: new Date().toISOString(),
            imageUrl: selectedImageUrl || null,
            imageAlt: (imageAltDisplay.textContent !== '—') ? imageAltDisplay.textContent : null
        };

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': savedUserId
                },
                body: JSON.stringify(dataToSave)
            });

            if (response.ok) {
                chrome.storage.local.remove('pendingImage');
                showMessage('Saved successfully! ✓', 'success');
                saveBtn.textContent = 'Saved!';
                setTimeout(() => window.close(), 1400);
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            console.error('Save error:', error);
            showMessage('Backend unreachable. Queuing locally...', 'error');
            chrome.storage.local.get({ offlineQueue: [] }, (result) => {
                const queue = result.offlineQueue;
                queue.push(dataToSave);
                chrome.storage.local.set({ offlineQueue: queue });
            });
            saveBtn.disabled = false;
            saveBtn.textContent = 'Queued Locally';
        }
    });

    // ─── Helpers ──────────────────────────────────────────────────────────────
    function applyImageData(imageUrl, altText) {
        selectedImageUrl = imageUrl;
        imagePreview.src = imageUrl;
        imagePreview.alt = altText;
        imageAltDisplay.textContent = altText || '(no alt text)';
        imageAltDisplay.title = altText || '';
        imageUrlDisplay.textContent = imageUrl;
        imageUrlDisplay.title = imageUrl;
        imageInfoCard.classList.remove('hidden');
        selectImageBtn.innerHTML = '<span class="btn-icon">✅</span> Image Selected';
        selectImageBtn.classList.remove('active');
        selectImageBtn.classList.add('selected');
    }

    async function disablePicker() {
        pickerActive = false;
        selectImageBtn.innerHTML = '<span class="btn-icon">🖼️</span> Select Image';
        selectImageBtn.classList.remove('active');
        pickerBadge.classList.add('hidden');
        try { await chrome.tabs.sendMessage(tab.id, { action: 'DISABLE_IMAGE_PICKER' }); } catch { }
    }

    function clearImage() {
        selectedImageUrl = null;
        imagePreview.src = '';
        imageAltDisplay.textContent = '—';
        imageUrlDisplay.textContent = '—';
        imageInfoCard.classList.add('hidden');
        selectImageBtn.innerHTML = '<span class="btn-icon">🖼️</span> Select Image';
        selectImageBtn.classList.remove('selected', 'active');
        chrome.storage.local.remove('pendingImage');
    }

    function showMessage(msg, type) {
        messageEl.textContent = msg;
        messageEl.className = `message ${type}`;
    }
});
