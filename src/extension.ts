// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "copy-on-click" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let isActived = true;
		
	let activeSwitcher = vscode.commands.registerCommand('copy-on-click.copy-on-click-active-switch', function () {
		isActived = !isActived;
		if (isActived){
			vscode.window.showInformationMessage('copy-on-click is actived');
		}else{
			vscode.window.showInformationMessage('copy-on-click is closed');
		}
	});

	let operaterType = 1;
	let operaterStep = 1;
	let operaterSwitcher = vscode.commands.registerCommand('copy-on-click.copy-on-click-operate-switch', function () {
		if (isActived){
			operaterStep=1;
			switch (operaterType) {
				case 1:
					operaterType++
					vscode.window.showInformationMessage('copy-paste-paste');
					break;
				case 2:
					operaterType=1
					vscode.window.showInformationMessage('copy-paste');
					break;
			}
		}
	});

	let disposable = vscode.commands.registerCommand('copy-on-click.copy-on-click', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('copy-on-click registerCommand');
		let clickTime = 0;
		vscode.window.onDidChangeTextEditorSelection(e => {
			if (isActived){
				// 防双击
				let currentTime = new Date().getTime();
				if (currentTime - clickTime < 200) {
					console.log('Double click detected');
					return
				}
				clickTime = currentTime;

				const editor = vscode.window.activeTextEditor;
				if (editor) {
					const document = editor.document;
					const selection = editor.selection;
					const wordRange = document.getWordRangeAtPosition(selection.active);
					if (wordRange) {
						switch (operaterType) {
							case 1:
								if (operaterStep==1){
									// copy
									const word = document.getText(wordRange);
									vscode.env.clipboard.writeText(word);
									operaterStep++
								}else{
									// delete
									editor.edit(editBuilder => {
										editBuilder.delete(wordRange);
									});
									// paste
									vscode.commands.executeCommand('editor.action.clipboardPasteAction');
									operaterStep=1
								}
								break
							case 2:
								if (operaterStep==1){
									// copy
									const word = document.getText(wordRange);
									vscode.env.clipboard.writeText(word);
								}else if (operaterStep==2 || operaterStep==3){
									// delete
									editor.edit(editBuilder => {
										editBuilder.delete(wordRange);
									});
									// paste
									vscode.commands.executeCommand('editor.action.clipboardPasteAction');
								}
								operaterStep++;
								if (operaterStep==4){
									operaterStep=1
								}
								break;
						}
						

						// // copy paste paste
						// if (operaterStep==1){
						// 	// copy
						// 	const word = document.getText(wordRange);
						// 	vscode.env.clipboard.writeText(word);
						// 	operaterStep++;
						// }else if (operaterStep==2 || operaterStep==4){
						// 	// delete
						// 	editor.edit(editBuilder => {
						// 		editBuilder.delete(wordRange);
						// 	});
						// 	// paste
						// 	vscode.commands.executeCommand('editor.action.clipboardPasteAction');
						// 	operaterStep++;
						// }else if (operaterStep==3){
						// 	operaterStep++;
						// }else{
						// 	operaterStep=1
						// }

					}
				}
			}
		});
	});

	context.subscriptions.push(activeSwitcher,operaterSwitcher,disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
