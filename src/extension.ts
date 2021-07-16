import * as vscode from 'vscode';
import * as path from 'path';
import { createOrShowPage } from "vscode-page";
import { messageMappings } from "./home";
import { KameletsConfig } from "./home";

export function activate(context: vscode.ExtensionContext) {

	const kameletsFile = vscode.Uri.file(
		path.join(context.extensionPath, 'pages', 'kamelets.json')
	);

	vscode.workspace.openTextDocument(kameletsFile).then((document) => {
		KameletsConfig.json = document.getText();
	});

	registerCommands(context);
}

export function deactivate() { }

function registerCommands(context: vscode.ExtensionContext) {
	let homePage = vscode.commands.registerCommand("kameleon.add-kamelet", async () => {
		createOrShowPage(
			"name",
			"kameleon.add-kamelet",
			"Kamelets",
			"pages",
			"home.html",
			context,
			messageMappings
		);
	});

	context.subscriptions.push(homePage);
}
