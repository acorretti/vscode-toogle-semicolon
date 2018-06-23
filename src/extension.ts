'use strict';
import {commands, window, ExtensionContext, TextLine} from 'vscode';
import * as vscode from 'vscode';

// check if other lines should follow first line of selections. default = true;
let follow: Boolean;

export function activate(context: ExtensionContext) {
    follow = vscode.workspace.getConfiguration('extension.toggleSemicolon').get('followFirstSelection', true);

    let disposables = [
        commands.registerCommand('extension.toggleSemicolon', () => {
            toggle(getLines(), ';');
        }),
        commands.registerCommand('extension.toggleColon', () => {
            toggle(getLines(), ':')
        }),
        commands.registerCommand('extension.toggleComma', () => {
            toggle(getLines(), ',');
        })
    ];

    context.subscriptions.push(...disposables);
}

function toggle(lines: TextLine[], check: string = ';') {
    let firstToggle = -1; // -1 = not yet, 0 = remove, 1 = insert
    window.activeTextEditor.edit((editBuilder) => {
        const commentRX = new RegExp(check+' *\/\/');
        lines.forEach(line => {
            let found;
            if (commentRX.test(line.text)) {
                found = true;
            }
            else {
                found = line.text.slice(-1 * check.length) === check;
            }
            let shouldRemove = (follow && found && firstToggle !== 1) || (!follow && found);
            let shouldInsert = (follow && !found && firstToggle !== 0) || (!follow && !found);
            shouldRemove && remove(editBuilder, line, check);
            !shouldRemove && shouldInsert && insert(editBuilder, line, check);
            firstToggle = firstToggle === -1 ? found ? 0 : 1 : -1;
        });
    });
}

function remove(editBuilder: vscode.TextEditorEdit, line: TextLine, check: string) {
    let lastStrRange;
    const commentRX = new RegExp('//([^"\'`]{'+check.length+'}) *\/\/.*');
    if (commentRX.test(line.text)) {
        const commentMatch = commentRX.exec(line.text);
        lastStrRange = line.range.with(
            line.range.end.with(
                line.range.end.line,
                line.range.end.character - commentMatch[0].length
            ),
            line.range.end.with(
                line.range.end.line,
                line.range.end.character - commentMatch[0].length + check.length
            )
        );
    }
    else {
        lastStrRange = line.range.with(
            line.range.end.with(
                line.range.end.line,
                line.range.end.character - check.length
            )
        );
    }
    editBuilder.delete(lastStrRange);
}

function insert(editBuilder: vscode.TextEditorEdit, line: TextLine, check: string) {
    const commentRX = new RegExp('([^"\'`]) *\/\/.*');
    if (commentRX.test(line.text)) {
        const commentMatch = commentRX.exec(line.text);
        editBuilder.insert(line.range.end.with(
            line.range.end.line,
            line.range.end.character - commentMatch[0].length + 1
        ), check);
    }
    else {
        editBuilder.insert(line.range.end, check);
    }
}

function getLines(): TextLine[] {
    let lines = [];
    window.activeTextEditor.selections
        .forEach(sel => {
            for (let i = sel.start.line; i < sel.end.line + 1; i++) {
                lines.push(window.activeTextEditor.document.lineAt(i));
            }
        });
    return lines;
}