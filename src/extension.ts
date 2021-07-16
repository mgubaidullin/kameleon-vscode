import * as vscode from 'vscode';
import * as path from 'path';
import { createOrShowPage } from "vscode-page";
import { messageMappings } from "./home";
import { KameletsConfig, Kamelet } from "./home";
import { TextDocument } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	loadKameletConfig(context);
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

function loadKameletConfig(context: vscode.ExtensionContext) {
	KameletsConfig.context = context;
	const kameletsFile = vscode.Uri.file(
		path.join(context.extensionPath, 'pages', 'kamelets.json')
	);

	vscode.workspace.openTextDocument(kameletsFile).then((document) => {
		KameletsConfig.json = document.getText();
		KameletsConfig.getKameletList().forEach(kamelet => {
				return loadKamelet(context, kamelet.name);
			});
	});
}

function loadKamelet(context: vscode.ExtensionContext, name: string) {
	const kameletFile = vscode.Uri.file(
		path.join(context.extensionPath, 'kamelets', name+ '.kamelet.yaml')
	);

	vscode.workspace.openTextDocument(kameletFile).then((document) => {
		KameletsConfig.kamelets.set(name, document.getText());
	});
}

