// App-styled confirm dialog. Use instead of window.confirm (browser popups).
export function askConfirm({ title = 'Are you sure?', message = '', confirmText = 'Confirm', danger = false } = {}) {
  return new Promise((resolve) => {
    window.dispatchEvent(new CustomEvent('acc-ask', { detail: { title, message, confirmText, danger, resolve } }));
  });
}
