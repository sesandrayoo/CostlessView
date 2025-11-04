# CostlessView

A Chrome extension that automatically masks prices, allowing stakeholders to focus on structure and content without being distracted by outdated or inconsistent pricing data.

CostlessView detects and masks pricing information, replacing prices with `$**.**` placeholders.

## 🚀 Installation

### Load Unpacked Extension (Development)

1. Clone or download this repo to your local machine

2. Open Chrome Extensions page:
   - Navigate to `chrome://extensions/`
   - Or click the menu (⋮) → More Tools → Extensions

3. Enable Developer Mode:
   - Toggle the "Developer mode" switch in the top right corner

4. Load the extension:
   - Click "Load unpacked"
   - Select the `CostlessView` folder
   - The extension should now appear in your extensions list

5. Pin the extension (optional):
   - Click the puzzle piece icon in the Chrome toolbar
   - Find "CostlessView" and click the pin icon

### Enabling/Disabling

1. **Click the CostlessView icon** in your Chrome toolbar
2. **Toggle the switch** to enable or disable price masking
3. **Click "Reload Page"** if anything looks off

### What Gets Masked

The extension automatically detects and masks:
- ✅ Dollar amounts: `$1,234.56` → `$**.**`
- ✅ Euro amounts: `€1,234.56` → `€**.**`
- ✅ British Pounds: `£1,234.56` → `£**.**`
- ✅ Discount Totals, Tax Totals
- Note that discount and tax percentages are still shown


### Project Structure

```
CostlessView/
├── manifest.json          # Extension configuration
├── content.js            # Main content script (price detection & masking)
├── popup.html            # Extension popup UI
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── icons/                # Extension icon
│   └── no-money.png
└── README.md
```



## 🤝 Contributing

Contributions are welcome!


## 💡 Future Enhancements
- [ ]  More specific masking patterns (e.g., different characters or formats)
- [ ] Options page for advanced configuration


## 🙏 Acknowledgments

- Icon: [No money icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/no-money)

---

**Version**: 1.0.0
**Last Updated**: November 2025
**Compatibility**: Chrome

