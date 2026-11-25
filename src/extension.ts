

import * as vscode from 'vscode';
import * as fs from 'fs';
import { promisify } from 'node:util';
import * as path from 'node:path';
import * as cp from 'child_process';


const CFG_TEMPLATES_DIR = 'templatesDirectory';
const CFG_PROJECTS_DIR = 'projectsDirectory';



// ---------- UI ITEMS ----------

const PROJECT_INIT_OPTIONS = [
	{
		label: 'Init Git',
		description: 'Initialise Git repository',
		picked: true,
	},
	{
		label: 'Init venv',
		description: 'Initialise Python virtual environment',
		picked: true,
	}
];

async function userUpdateDirectory(directory: string) {
	const newPath = await vscode.window.showInputBox({
		prompt: 'Please enter the new path.',
		placeHolder: configGet(directory),
		ignoreFocusOut: true,
	});

	if (newPath && fs.existsSync(newPath)) {
		configSet(directory, newPath);
		popup(`Directory updated successfully.`);
	} else {
		popup(`Directory does not exist! ${newPath}`);
	}
}



// ---------- HELPER FUNCTIONS ----------

function popup(msg: string) {
	vscode.window.showInformationMessage(msg);
}

function configGet(name: string): string {
	const config = vscode.workspace.getConfiguration('pyprojects');
    return config.get(name, '');
}

function configSet(name: string, value: string) {
	const config = vscode.workspace.getConfiguration('pyprojects');
	config.update(name, value, vscode.ConfigurationTarget.Global);
}

function getTemplatesDir(): string { return configGet(CFG_TEMPLATES_DIR); }
function getProjectsDir(): string { return configGet(CFG_PROJECTS_DIR); }



// ---------- DRIVER FUNCTIONS ----------

async function initialise(projectName: string, templatePath: string, projectPath: string, initGit: boolean, initVenv: boolean) {
	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: `Creating ${projectName}`,
			cancellable: false
		},
		async (progress) => {
			progress.report({ message: 'Copying template...' });
			fs.cpSync(templatePath, projectPath, { recursive: true });

			if (initGit) {
				progress.report({ message: 'Initialising Git...' });
				cp.execFileSync('git', ['init'], {
					cwd: projectPath,
					stdio: 'ignore'
				});
			}

			if (initVenv) {
				progress.report({ message: 'Creating venv...' });
				cp.execFileSync('python3', ['-m', 'venv', '.venv'], {
					cwd: projectPath,
					stdio: 'ignore'
				});
			}
		}
	);
}

async function addWorkspaceFolder(path: string, displayName: string) {
	const folders = vscode.workspace.workspaceFolders;

	if (!folders || folders.length === 0) { return; }

	const folderUri = vscode.Uri.file(path);

	vscode.workspace.updateWorkspaceFolders(folders.length, 0, {
		uri: folderUri,
		name: displayName,
	});
}

function openFolder(path: string) {
	const folderUri = vscode.Uri.parse(path.split(`\\`).join(`/`));
	vscode.commands.executeCommand(`vscode.openFolder`, folderUri, {
		forceNewWindow: true,
	});
}


// ---------- VSCODE EXT FUNCTIONS ----------

export function deactivate() {}

export function activate(context: vscode.ExtensionContext) {
	 const commands = {
        'pyprojects.create': async () => {

			// get project name
			const projectName = await vscode.window.showInputBox({
				prompt: 'Enter project name',
				placeHolder: 'my-project'
			});
	
			if (!projectName) { return; }
	

			// validate new projects path
			const projectPath = path.join(getProjectsDir(), projectName);
	
			if (fs.existsSync(projectPath)) {
				vscode.window.showErrorMessage(
					`Project already exists: ${projectPath}`
				);
				return;
			}


			// get templates list and a user-selected template
			const TEMPLATES_DIR = getTemplatesDir();

			const templates = fs.readdirSync(TEMPLATES_DIR, { withFileTypes: true })
				.filter(entry => entry.isDirectory())
				.map(entry => ({
					label: entry.name,
					description: path.join(TEMPLATES_DIR, entry.name),
					path: path.join(TEMPLATES_DIR, entry.name)
				}));
	
			if (templates.length === 0) {
				vscode.window.showErrorMessage('No templates found.');
				return;
			}

			const selectedTemplate = await vscode.window.showQuickPick(templates, {
				placeHolder: 'Select project template',
				canPickMany: false,
			});
	
			if (!selectedTemplate) { return; }


			// get initialisation flags
			let options = await vscode.window.showQuickPick(
				PROJECT_INIT_OPTIONS,
				{
					placeHolder: 'Select project options',
					canPickMany: true
				}
			);

			if (!options) { return; }
			
			const initGit = options.some(option => option.label === 'Init Git');
			const initVenv = options.some(option => option.label === 'Init venv');


			// copy project template and initialise
			try {
				initialise(projectName, selectedTemplate.path, projectPath, initGit, initVenv);
			} catch (error) {
				vscode.window.showErrorMessage(
					`Project creation failed: ${error}`
				);
				return;
			}
	
			vscode.window.showInformationMessage(
				`Created ${projectName} using ${selectedTemplate.label}`
			);


			// determine if user wants to open the newly created folder
			const openOptions = await vscode.window.showQuickPick(
				[
					{
						label: 'Workspace add',
						description: 'Add project to workspace',
						picked: true,
					},
					{
						label: 'Workspace open',
						description: 'Open project in a new window',
						picked: false,
					},
				],
				{
					placeHolder: 'Select project launch options',
					canPickMany: false,
				}
			);

			if (!openOptions) { return; }

			const addWorkspace = openOptions.label === 'Workspace add';
			const openWorkspace = openOptions.label === 'Workspace open';

			if (addWorkspace) {
				addWorkspaceFolder(projectPath, projectName);
			} else if (openWorkspace) {
				openFolder(projectPath);
			}
        },
		'pyprojects.getTemplatesDirectory': async () => {
			popup(`Templates Directory: ${getTemplatesDir()}`);
		},
        'pyprojects.setTemplatesDirectory': async () => {
			await userUpdateDirectory(CFG_TEMPLATES_DIR);
		},
        'pyprojects.getProjectsDirectory': async () => {
			popup(`Projects Directory: ${getProjectsDir()}`);
		},
		'pyprojects.setProjectsDirectory': async () => {
			await userUpdateDirectory(CFG_PROJECTS_DIR);
		},
    };

	// Register commands
    for (const [name, callback] of Object.entries(commands)) {
		console.log(`Registering command: ${name}`);

        context.subscriptions.push(
            vscode.commands.registerCommand(name, callback)
        );
    }
	console.log("PyProjects commands registered");
}
