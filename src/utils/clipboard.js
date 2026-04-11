export async function copyToClipboard(text, toastFn) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    if (toastFn) toastFn('Copied to clipboard');
  } catch {
    if (toastFn) toastFn('Failed to copy');
  }
}
