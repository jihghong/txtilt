# TxTILT Diff Opener

This VS Code extension opens a diff for `.tx~` files against their matching `.txt` file when you pin the tab (double-click).

## Installation

Recommended (from VSIX)
1) Download the latest `txtilt-*.vsix` from the GitHub Releases page:
   `https://github.com/jihghong/txtilt/releases`
2) Open VS Code.
3) Open Command Palette (`Ctrl+Shift+P`).
4) Run **Extensions: Install from VSIX...**
5) Select the downloaded `.vsix` file, then reload when prompted.

From source (if you want to build/test yourself)
1) Clone the repo:
   `git clone https://github.com/jihghong/txtilt`
2) Open the cloned folder in VS Code.
3) Open Command Palette (`Ctrl+Shift+P`).
4) Run **Developer: Install Extension from Location...**
5) Select the cloned folder to install.

After installation, double‑click any `*.tx~` file and the diff should open.

## Packaging (VSIX)

This repo includes a PowerShell script that packages using `@vscode/vsce`.

1) Install Node.js 20+:
   - `winget install OpenJS.NodeJS.LTS`
   - or download from `https://nodejs.org/`
2) From repo root:
```
powershell -File .\scripts\package-vsix.ps1
```

Or:
```
cd scripts
.\package-vsix.ps1
```

Output:
```
releases\txtilt-<version>.vsix
```
