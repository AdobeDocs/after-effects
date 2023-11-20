# After Effects ExtendScript Samples

This folder contains samples of ScriptUI panels utilizing ExtendScript APIs for accessing typefaces and editing Text layers in Adobe After Effects. These APIs are available in Adobe After Effects 24.0 and later, but may be subject to change while still in Beta.

[Read the first official announcement in the Adobe Community here.](https://community.adobe.com/t5/after-effects-beta-discussions/new-text-scripting-hooks-starting-after-effects-beta-24-0x14/td-p/13976407)

Full documentation is available on docsforadobe:
- [Fonts object (new)](https://ae-scripting.docsforadobe.dev/other/fontsobject.html)
- [Font object (new)](https://ae-scripting.docsforadobe.dev/other/fontobject.html)
- [TextDocument object (updated)](https://ae-scripting.docsforadobe.dev/other/textdocument.html)


## Usage

After being downloaded, these scripts can be run in After Effects 24.0 or higher via File > Scripts > Run Script File...

### InspectFont_EditType_ScriptUISample

Use this panel to view and inspect attributes of all installed typefaces, and also to edit newly-added attributes of Text layers.

### InspectVariableFonts_ApplyControls_ScriptUISample.jsx

Use this panel to view and inspect attributes of installed **variable** typefaces, and also to apply variable typefaces and animation controls to Text layers.

### ReplaceFontsInProject_ScriptUISample.jsx

View typefaces used in the currently open project and replace them project-wide.

### PerCharacter_StyleEdit_ScriptUISample.jsx

Use this panel to randomize the typeface and colors used on individual characters of a selected Text layer, utilizing newly-added access to character and paragraph ranges within a TextDocument.

## Feedback

We are actively gathering feedback on these new APIs while they are in Beta. Please post any questions or other feedback in the [After Effects (Beta) forums](https://community.adobe.com/t5/after-effects-beta/ct-p/ct-after-effects-beta?page=1&sort=latest_replies&filter=all&lang=all&tabid=discussions).
