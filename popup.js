document.addEventListener('DOMContentLoaded', async () => {
  const selector = document.getElementById('lang-select');
  
  // Load saved language
  const { lang } = await chrome.storage.local.get('lang');
  if (lang) selector.value = lang;

  selector.addEventListener('change', () => {
    const newLang = selector.value;
    chrome.storage.local.set({ lang: newLang }, () => {
      chrome.runtime.reload(); // Refresh extension to apply locale
    });
  });
});
