/**
 * Background service worker (Manifest V3 compatible).
 * Handles context menus, API requests, and offline queuing.
 */

const API_ENDPOINT = 'https://f1rr36mb-3000.inc1.devtunnels.ms/api/items';

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "save-to-knowledge",
        title: "Save to Knowledge",
        contexts: ["selection"]
    });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "save-to-knowledge" && info.selectionText) {
        saveItem({
            url: tab.url,
            title: tab.title,
            selectedText: info.selectionText,
            note: "Saved via context menu",
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * Handle data saving with retry/offline support.
 */
async function saveItem(data) {
    try {
        // Get userId from storage
        const { userId } = await chrome.storage.local.get(['userId']);

        if (!userId) {
            console.warn('No User ID configured in extension settings.');
            notifyUser('Setup Needed', 'Please set your User ID in the extension settings ⚙️');
            return;
        }

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': userId
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('Successfully saved to server');
            notifyUser('Success', 'Content saved to knowledge base!');
        } else {
            throw new Error('Server returned error');
        }
    } catch (error) {
        console.error('Failed to save to server, queuing locally:', error);
        queueLocally(data);
        notifyUser('Queued', 'Backend unreachable. Saved locally for sync.');
    }
}

/**
 * Store items in local storage if saving fails.
 */
function queueLocally(data) {
    chrome.storage.local.get({ offlineQueue: [] }, (result) => {
        const queue = result.offlineQueue;
        queue.push(data);
        chrome.storage.local.set({ offlineQueue: queue });
    });
}

/**
 * Simple notification helper.
 */
function notifyUser(title, message) {
    // In MV3, we can't easily use chrome.notifications without permission, 
    // so we'll just log and maybe update storage for popup to show.
    console.log(`[Notification] ${title}: ${message}`);
}
