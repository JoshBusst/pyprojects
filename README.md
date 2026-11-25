# Python Code Folding

A Visual Studio Code extension for quickly generating new Python projects from a directory of templates. Users can freely curate project templates and recreate these in a static, editable projects directory.

## Features

Implements the below commands:

| Command | Description |
|---|---|
| **pyprojects.create** | Create a new project from a template. |
| **pyprojects.getTemplatesDirectory** | A popup to print the current templates directory. |
| **pyprojects.setTemplatesDirectory** | Set a new templates directory. |
| **pyprojects.getProjectsDirectory** | A popup to print the current projects directory. |
| **pyprojects.setProjectsDirectory** | Set a new projects directory. |

## Usage

1. Open the Command Palette (`Ctrl + Shift + P`).
2. Search for `pyprojects`.
3. Select `pyprojects.create`.
4. Select a project name, desired template, and initialisation flags.
5. Your new project will be generated as an exact copy of the existing template. Venv and Git init flags can optionally be configured as part of project setup.

## Requirements

- Visual Studio Code
- Python language support
- Node.js and npm (for development)

## Development

Clone the repository and install dependencies:

```bash
npm install
```

Compile the TypeScript source:

```bash
npx tsc
```

Press `F5` in VS Code to launch the Extension Development Host and test the extension.

## Building an Installable Extension

The extension can be packaged into a `.vsix` file using Microsoft's Visual Studio Code Extension Manager (`vsce`).

### 1. Install vsce

```bash
npm install --global @vscode/vsce
```

### 2. Package the extension

From the project root directory, run:

```bash
vsce package
```

This generates an installable `.vsix` file in the project directory.

### 3. Install the extension

Install the generated package directly through the terminal, for instance:

```bash
code --install-extension pyprojects-1.0.0.vsix
```

Alternatively, in VS Code:

1. Open the Extensions panel.
2. Select the three-dot menu (`...`).
3. Select **Install from VSIX...**.
4. Select the generated `.vsix` file.

The extension is now installed locally and available through the Command Palette.

## Implementation

The extension uses the VS Code API's built-in folding commands. Python class and function declarations are identified using simple regular expressions, with VS Code's Python language provider handling the actual folding regions.

## License

See license included in this repository.