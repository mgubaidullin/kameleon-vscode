import * as vscode from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { MesssageMaping } from "vscode-page";
import { createOrShowPage } from "vscode-page";
import * as handlebars from "handlebars";
import { runInThisContext } from "vm";
import { InputBoxOptions } from "vscode";

export class Kamelet {
  name: string = '';
  title: string = '';
  description: string = '';
  icon: string = '';
  supportLevel: string = '';
  labels: Array<string> = [];
  group: string = '';
}

export class KameletsConfig {
  static context: vscode.ExtensionContext;
  static json: string = '';
  static kamelets: Map<string, string> = new Map;

  static getKameletList(): Array<Kamelet> {
    let kamelets: Array<Kamelet> = JSON.parse(KameletsConfig.json);
    kamelets.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      return a.name > b.name ? 1 : 0;
    });
    return kamelets;
  }
}

function loadKamelets() {
  return KameletsConfig.getKameletList();
}

function saveKamelet(folder: string, file: string, text: string) {
  let options: InputBoxOptions = {
    prompt: "Filename: ",
    placeHolder: "Enter new filename"
  };

  const kameletFile = vscode.Uri.file(path.join(folder, file));

  if (!fs.existsSync(kameletFile.fsPath)) {
    fs.writeFileSync(kameletFile.fsPath, text);
  } else {
    vscode.window.showInputBox(options).then(value => {
      if (!value) return;
      const kameletFile = vscode.Uri.file(path.join(folder, value));
      fs.writeFileSync(kameletFile.fsPath, text);
    });
  }
}

export const messageMappings: MesssageMaping[] = [
  {
    command: "ready",
    handler: async () => {
      let result = loadKamelets();
      return {
        kamelets: result
      };
    },
    templates: [
      {
        id: "kamelets",
        content: `
        {{#each kamelets}}
          <div class="column">
            <div class="kamelet-card">
              <div class="title">
                <p>{{title}}</p>
              </div>
              <div class="description">
                <p>{{description}}</p>
              </div>
              <div class="footer">
                <img src='{{icon}}' class="icon">
                <button class="btn" onclick="addKamelet('{{name}}')">
                    <i aria-hidden="true" class="fas fa-plus"></i> 
                </buton>
              </div>
            </div>
          </div>
        {{/each}}
        `
      },
      { id: "title", content: "{{title}}" }
    ]
  },
  {
    command: "addKamelet",
    handler: async parameter => {
      const text = KameletsConfig.kamelets.get(parameter.name) as string | undefined;;
      const folder = vscode.workspace.workspaceFolders?.[0].uri.path as string | undefined;;
      saveKamelet(folder ? folder : '', parameter.name + '.yaml', text ? text : '');
    }
  }
];
