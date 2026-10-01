# Academic Advancement Center Heatmap

Offline attendance heatmap with AAC branding, CSV import, 3D rotation, five color palettes and custom colors, vector SVG export, and 2400/4800/7200-pixel PNG export.

## Download the desktop app

Get the ready-to-open app from [GitHub Releases](https://github.com/dc73/3D_Heatmap_Generator/releases/latest). No development tools are required.

- [Mac — Apple Silicon](https://github.com/dc73/3D_Heatmap_Generator/releases/download/v1.0.0/AAC-Heatmap-1.0.0-mac-arm64.zip)
- [Mac — Intel](https://github.com/dc73/3D_Heatmap_Generator/releases/download/v1.0.0/AAC-Heatmap-1.0.0-mac-x64.zip)
- [Windows — portable EXE](https://github.com/dc73/3D_Heatmap_Generator/releases/download/v1.0.0/AAC-Heatmap-1.0.0-win-x64.exe)

Unzip the Mac download and open **AAC Heatmap.app**. On Windows, double-click the downloaded EXE.

## Open the app locally

- Mac: unzip the matching archive in `desktop-release/` and open AAC Heatmap.app. `arm64` is for Apple Silicon, `x64` for Intel.
- Windows: double-click the portable `.exe` in `desktop-release/`.
- Browser alternative: double-click `release/Heatmap Studio.html` on either platform.

Desktop packages are unsigned. macOS and Windows may show a security prompt because the apps do not have developer signing certificates.

Import a CSV with `Time,Sun,Mon,Tue,Wed,Thu,Fri,Sat,Total` columns. The importer keeps 9 AM through 9 PM inclusive and Monday through Friday, then Sunday. Saturday and Total are excluded; source files are unchanged. Header case is ignored. Reports must contain all 13 hourly rows. You can also type or paste month and weekday values.

Drag the 3D chart or use the rotation slider. Select a palette or pick a custom color. Exports include the logo, title, filtered totals, and hour/day labels. SVG uses vector polygons, rectangles and text; only the supplied logo is a raster image.

## Develop and package

```
npm install
npm run dev
npm test
npm run build
npm run package
npm run dist:mac
npm run dist:win
```

`npm run package` regenerates the offline HTML. Desktop packaging uses Electron and electron-builder. Cross-platform Windows packaging may need Wine depending on the host and target.

## Third-party notices

The initial isometric layout was inspired by Jason Long’s MIT-licensed Isometric Contributions (https://github.com/jasonlong/isometric-contributions). The app now draws its charts with its own SVG renderer. The original Obelisk.js library and license notices remain in `public/vendor/` for attribution.
