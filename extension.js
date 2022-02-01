const vscode = require("vscode");

let { buildMatchers, getTextMatch } = require("./utils");

function activate(context) {
  let { commands, workspace, Range } = vscode;
  let root = workspace.workspaceFolders[0].uri.path;
  let { generateRules } = require(root + "/node_modules/tailwindcss/lib/lib/generateRules");
  let resolveConfig = require(root + "/node_modules/tailwindcss/resolveConfig");
  let { createContext } = require(root + "/node_modules/tailwindcss/lib/lib/setupContextUtils");
  let tailwindConfig = require(root + "/tailwind.config.js");
  tailwindConfig.content = ["no-op"];

  const config = workspace.getConfiguration();
  const langConfig = config.get("tailwind-class-sorter.classRegex") || {};

  let tWcontext = createContext(resolveConfig(tailwindConfig));

  function bigSign(bigIntValue) {
    return (bigIntValue > 0n) - (bigIntValue < 0n);
  }

  let sortClassString = (classStr) => {
    let parts = classStr.split(/\s+/).filter((x) => x !== "" && x !== "|");

    let unknownClassNames = [];
    let knownClassNamesWithOrder = [];

    for (let className of parts) {
      let order = generateRules(new Set([className]), tWcontext).sort(([a], [z]) => bigSign(z - a))[0]?.[0] ?? null;

      if (order) {
        knownClassNamesWithOrder.push([className, order]);
      } else {
        unknownClassNames.push(className);
      }
    }

    let knownClassNames = knownClassNamesWithOrder
      .sort(([, a], [, z]) => (a === z ? 0 : bigSign(a - z)))
      .map(([className]) => className);

    // console.log(classes);

    let needSeparator = unknownClassNames.length > 0 && knownClassNames.length > 0;

    return unknownClassNames.join(" ") + (needSeparator ? " | " : "") + knownClassNames.join(" ");
  };

  let disposable = commands.registerTextEditorCommand(
    "tailwind-class-sorter.sortTailwindClasses",
    function (editor, edit) {
      const editorText = editor.document.getText();
      const editorLangId = editor.document.languageId;

      const matchers = buildMatchers(langConfig[editorLangId]);

      for (const matcher of matchers) {
        getTextMatch(matcher.regex, editorText, (text, startPosition) => {
          const endPosition = startPosition + text.length;
          const range = new Range(editor.document.positionAt(startPosition), editor.document.positionAt(endPosition));

          edit.replace(range, sortClassString(text));
        });
      }
    }
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    workspace.onWillSaveTextDocument((_e) => {
      commands.executeCommand("tailwind-class-sorter.sortTailwindClasses");
    })
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
