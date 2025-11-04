// CostlessView - Popup Script
// Handles the extension popup UI and toggle functionality

document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('toggleExtension');
  const statusLabel = document.getElementById('statusLabel');

  chrome.storage.sync.get(['enabled'], function(result) {
    const enabled = result.enabled !== false; // default to true
    toggle.checked = enabled;
    updateStatusLabel(enabled);
  });

  toggle.addEventListener('change', function() {
    const enabled = toggle.checked;

    chrome.storage.sync.set({ enabled: enabled }, function() {
      updateStatusLabel(enabled);

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggle',
            enabled: enabled
          }, function(response) {
            if (chrome.runtime.lastError) {
              // tab might not have content script yet, reload will fix it
              console.log('Content script not ready:', chrome.runtime.lastError.message);
            }
          });
        }
      });
    });
  });


  function updateStatusLabel(enabled) {
    statusLabel.textContent = enabled ? 'Enabled' : 'Disabled';
    statusLabel.style.color = enabled ? '#28a745' : '#dc3545';
  }
});

