const vscode = require('vscode');
const path = require('path');

const handledPinned = new Set();

function isTxTildeUri(uri) {
  return !!uri && uri.scheme === 'file' && /\.tx~$/i.test(uri.fsPath);
}

function toTxtUri(txTildeUri) {
  const txtPath = txTildeUri.fsPath.replace(/\.tx~$/i, '.txt');
  return vscode.Uri.file(txtPath);
}

function isDiffTabOpenFor(uri) {
  const tabGroups = vscode.window.tabGroups;
  if (!tabGroups) {
    return false;
  }

  const target = uri.toString();
  for (const group of tabGroups.all) {
    for (const tab of group.tabs) {
      const input = tab.input;
      if (!input || !input.original || !input.modified) {
        continue;
      }
      const originalUri = input.original && input.original.uri;
      const modifiedUri = input.modified && input.modified.uri;
      if (
        (originalUri && originalUri.toString() === target) ||
        (modifiedUri && modifiedUri.toString() === target)
      ) {
        return true;
      }
    }
  }

  return false;
}

async function openDiffForTxTilde(uri) {
  if (!isTxTildeUri(uri)) {
    return;
  }

  const txtUri = toTxtUri(uri);
  try {
    await vscode.workspace.fs.stat(txtUri);
  } catch (err) {
    return;
  }

  const title = `${path.basename(uri.fsPath)} -> ${path.basename(txtUri.fsPath)}`;
  await vscode.commands.executeCommand('vscode.diff', uri, txtUri, title, {
    preview: false,
    preserveFocus: true
  });
}

function registerAutoDiff(context) {
  const tabGroups = vscode.window.tabGroups;
  if (!tabGroups) {
    return;
  }

  const tabDisposable = tabGroups.onDidChangeTabs(async (event) => {
    for (const tab of event.closed) {
      const uri = tab.input && tab.input.uri;
      if (isTxTildeUri(uri)) {
        handledPinned.delete(uri.toString());
      }
    }

    const candidates = event.changed.concat(event.opened);
    for (const tab of candidates) {
      const uri = tab.input && tab.input.uri;
      if (!isTxTildeUri(uri)) {
        continue;
      }

      const key = uri.toString();
      if (tab.isPreview) {
        handledPinned.delete(key);
        continue;
      }

      if (handledPinned.has(key) || isDiffTabOpenFor(uri)) {
        continue;
      }

      handledPinned.add(key);
      await openDiffForTxTilde(uri);
    }
  });

  context.subscriptions.push(tabDisposable);
}

function activate(context) {
  registerAutoDiff(context);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
