# README

This extension allows you to add or remove semicolon, colon or comma in the end of selected lines.

## Using

1. Install this plugin :)
2. Open Command Palette (Ctrl+P), you could search for:
    - Toggle Semicolon.
    - Toggle Colon.
    - Toggle Comma.
3. Add key bindings (Recommended) .
    - Open key bindings settings file:
        + Open Command Palette (Ctrl+P)
        + Search for 'Open keyboard shortcuts'
    - Add and save you key bindings. For example:
```
// Place your key bindings in this file to overwrite the defaults
[
    { "key": "ctrl+;",   "command": "extension.toggleSemicolon", "when": "editorTextFocus" },
    { "key": "ctrl+shift+;",   "command": "extension.toggleColon", "when": "editorTextFocus" },
    { "key": "ctrl+,",   "command": "extension.toggleComma", "when": "editorTextFocus" }
]
```
4. Enjoy! :)


## Extension Settings
For multiple selections, by default, it should apply for all selected line as same behaviour as the first selected line.
<br/>
I found it's good with me, but if you want pure toggle for each line, you can turn off it by:
- Open User Settings file:
    + Open Command Palette (Ctrl+P)
    + Search for 'Open User Settings'
- Add and save:
```
// Place your settings in this file to overwrite the default settings
{
    "extension.toggleSemicolon.followFirstSelection" : false
}
```
