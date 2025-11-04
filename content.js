(function() {
  'use strict';

  let isEnabled = false;
  let originalValues = new Map();

  const pricePattern = /([\$€£])\s*[\d,]+\.?\d*/g;

  function maskPrice(match, currency) {
    const hasDecimal = match.includes('.');
    return hasDecimal ? currency + '**.**' : currency + '**';
  }

  function processTextNode(textNode) {
    if (!textNode.nodeValue || textNode.nodeValue.trim() === '') {
      return;
    }

    const parent = textNode.parentElement;
    if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
      return;
    }

    let text = textNode.nodeValue;

    if (!pricePattern.test(text)) {
      return;
    }

    pricePattern.lastIndex = 0;
    const newText = text.replace(pricePattern, maskPrice);

    if (newText !== text) {
      // create a random ID to track which text nodes have been changed
      // so that we can restore the original prices when toggling the extension off
      const nodeId = Math.random().toString(36).slice(2, 11);
      textNode.__costlessViewId = nodeId;
      originalValues.set(nodeId, text);
      textNode.nodeValue = newText;
    }
  }

  // Walk through DOM and process all text nodes
  function processDOM(root = document.body) {
    if (!root) return;

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      processTextNode(node);
    }
  }

  function restoreOriginalValues() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      if (node.__costlessViewId && originalValues.has(node.__costlessViewId)) {
        const originalValue = originalValues.get(node.__costlessViewId);
        node.nodeValue = originalValue;
        delete node.__costlessViewId;
      }
    }

    originalValues.clear();
  }

  function init() {
    // check if extension is enabled
    chrome.storage.sync.get(['enabled'], function(result) {
      isEnabled = result.enabled === true; // default to false (disabled)

      if (isEnabled) {
        processDOM();

        const observer = new MutationObserver((mutations) => {
          if (!isEnabled) return;

          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                processDOM(node);
              } else if (node.nodeType === Node.TEXT_NODE) {
                processTextNode(node);
              }
            });
          });
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        });

        window.__costlessViewObserver = observer;
      }
    });
  }

  // Listen for toggle messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle') {
      isEnabled = request.enabled;

      if (isEnabled) {
        // re-process the page
        processDOM();
        sendResponse({ success: true, status: 'enabled' });
      } else {
        restoreOriginalValues();
        sendResponse({ success: true, status: 'disabled' });
      }
    } else if (request.action === 'getStatus') {
      sendResponse({ enabled: isEnabled });
    }

    return true;
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

