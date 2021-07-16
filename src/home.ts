import * as vscode from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { MesssageMaping } from "vscode-page";
import { createOrShowPage } from "vscode-page";
import * as handlebars from "handlebars";
import { runInThisContext } from "vm";

export class KameletsConfig {
  static json: string = '';
}

function loadKamelets() {
  let kamelets = JSON.parse(KameletsConfig.json);
  return kamelets;
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
    handler: async parameters => {
      console.log(parameters);
      return {
        status: "OK"
      };
    }
  }
];
