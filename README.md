<div align="center">

<img src="public/aac_logo.png" alt="Academic Advancement Center" width="170">

# AAC Attendance Heatmap

### Turn attendance reports into a picture you can explore.

[![Download](https://img.shields.io/badge/Download-Mac%20%26%20Windows-cb3947?style=for-the-badge)](https://github.com/dc73/3D_Heatmap_Generator/releases/latest)
[![CSV import](https://img.shields.io/badge/Import-CSV-34495e?style=for-the-badge)](#import-an-attendance-report)
[![Export](https://img.shields.io/badge/Export-PNG%20%26%20SVG-34495e?style=for-the-badge)](#export-your-heatmap)

**A small, offline desktop app for exploring AAC attendance by day and hour.**

[Download the app](#download) · [Import a report](#import-an-attendance-report) · [Run from source](#run-from-source)

</div>

---

Choose an attendance CSV and the heatmap builds itself. Rotate the 3D chart to see the pattern from another angle, switch to a flat view, and use AAC colors or choose your own. Your report stays on your device.

<div align="center">

[![AAC attendance heatmap sample](release/AAC%20Attendance%20Heatmap.png)](release/AAC%20Attendance%20Heatmap.svg)

*Sample AAC attendance heatmap · [Open the vector SVG](release/AAC%20Attendance%20Heatmap.svg)*

</div>

## Download

Get the app from [GitHub Releases](https://github.com/dc73/3D_Heatmap_Generator/releases/latest). Choose the file for your computer:

| Computer | Download | Open it |
|---|---|---|
| Mac with Apple Silicon | [AAC Heatmap for Apple Silicon](https://github.com/dc73/3D_Heatmap_Generator/releases/latest/download/AAC-Heatmap-1.0.0-mac-arm64.zip) | Unzip, then open **AAC Heatmap.app** |
| Mac with Intel | [AAC Heatmap for Intel Mac](https://github.com/dc73/3D_Heatmap_Generator/releases/latest/download/AAC-Heatmap-1.0.0-mac-x64.zip) | Unzip, then open **AAC Heatmap.app** |
| Windows 64-bit | [AAC Heatmap for Windows](https://github.com/dc73/3D_Heatmap_Generator/releases/latest/download/AAC-Heatmap-1.0.0-win-x64.exe) | Double-click the EXE; no installation is needed |

macOS and Windows may show a security warning because the apps are unsigned. The Mac and Windows apps are built for their respective platforms; the Windows build has not been runtime-tested on Windows.

Prefer not to install an app? [Download the standalone HTML version](https://github.com/dc73/3D_Heatmap_Generator/releases/latest/download/Heatmap.Studio.html) and double-click it. It works offline in a modern browser on Mac or Windows.

## Import an attendance report

Select **Import CSV** and open the report. The app reads the `Time`, `Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, and `Total` columns, including capitalization differences.

It keeps the 13 hourly rows from **9:00 AM through 9:00 PM**, inclusive. The chart order is **Monday, Tuesday, Wednesday, Thursday, Friday, Sunday**. Saturday and Total are excluded from the chart and its totals. The original CSV is left untouched.

The report needs one row for each hour in the selected range. A missing or invalid value is reported so it can be corrected before generating the chart.

## Explore the chart

- Drag the 3D chart or move the rotation slider.
- Switch between isometric 3D columns and a flat heatmap.
- Choose AAC red, blue, green, purple, amber, or a custom color.
- Adjust column height and update the chart title.
- Review the filtered total, highest value, and average.

## Export your heatmap

- **PNG:** choose 2400, 4800, or 7200 pixels wide.
- **SVG:** export a vector chart that stays sharp when resized.

Both formats include the AAC logo, title, day and hour labels, and summary figures.

## Windows publisher signing

The Windows download is not currently signed. To publish a version that identifies its publisher in Windows, use a **Microsoft Artifact Signing Public Trust** certificate. It keeps its private key in Microsoft’s managed signing service, and the release workflow authenticates with GitHub Actions OIDC; no certificate file or signing password is stored in this repository.

Artifact Signing requires a paid Azure subscription, identity validation, and an Azure signing account and certificate profile. Its Basic plan starts at **$9.99 USD per month**. Public Trust identifies the validated legal organization or individual in the Windows publisher prompt. The AAC name alone can’t be used as a legal certificate identity unless it passes Microsoft's validation. Microsoft currently supports US organizations and US or Canadian individual developers. [Check eligibility and set up Artifact Signing](https://learn.microsoft.com/en-us/azure/artifact-signing/quickstart).

After setting up the Public Trust profile, configure GitHub repository secrets `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`, plus repository variables `ARTIFACT_SIGNING_ENDPOINT`, `ARTIFACT_SIGNING_ACCOUNT`, and `ARTIFACT_SIGNING_PROFILE`. Give the federated GitHub identity only the Artifact Signing **Certificate Profile Signer** role. Then run **Actions → Sign Windows release** for the existing release tag. The workflow builds the app, signs both Windows executable files, verifies the signatures, and replaces the Windows download on that release.

Signing identifies the publisher and detects changes to the signed files. It does **not** guarantee SmartScreen will immediately stop showing an unrecognized-app warning; Windows builds reputation as downloads accumulate. [Microsoft’s SmartScreen guidance](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation).

## Run from source

The desktop release above is ready to open. To run or modify the project from source, install [Node.js](https://nodejs.org/) and run:

```bash
npm install
npm run dev
```

To regenerate the standalone offline HTML file:

```bash
npm run package
```

To package desktop builds on a Mac:

```bash
npm run dist:mac
npm run dist:win
```

Desktop packages are written to `desktop-release/`. Build requirements for Windows installers may vary by host.

## Project files

```text
index.html                 App interface
app.js                     CSV import, controls, and exports
chart.js                   Rotatable SVG heatmap renderer
data.js                    CSV parsing and attendance filtering
public/aac_logo.png        AAC branding
release/                   Offline app and sample PNG/SVG
scripts/package.mjs        Standalone HTML builder
desktop/main.cjs            Desktop app launcher
```

## Third-party notices

The chart uses an original SVG renderer. The original Obelisk.js library and its MIT license notice are retained in `public/vendor/` for attribution.
