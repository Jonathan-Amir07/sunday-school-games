(() => {
  const phrases = window.CopticArabicPhrases;
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const titleEnglish = document.title;
  const ignoredTags = new Set(['SCRIPT','STYLE','NOSCRIPT']);
  let language = 'ar';
  try { language = localStorage.getItem('sundaySchoolLanguage') === 'en' ? 'en' : 'ar'; } catch {}

  function arabic(text) {
    if (phrases[text]) return phrases[text];
    let match;
    if ((match = text.match(/^1 (?:SAMUEL|Samuel) (\d+)(.*)$/))) return `صموئيل الأول ${match[1]}${match[2]}`;
    if ((match = text.match(/^(\d+) of (\d+) (placed|in place|moments placed|moments|sorted)$/))) {
      const labels = {placed:'اتحطّت', 'in place':'في مكانها', 'moments placed':'مواقف اترتبت', moments:'مواقف', sorted:'اترتبت'};
      return `${match[1]} من ${match[2]} ${labels[match[3]]}`;
    }
    if ((match = text.match(/^(\d+) of (\d+) sorted · one question left$/))) return `${match[1]} من ${match[2]} اترتبت · فاضل سؤال`;
    if ((match = text.match(/^(\d+) icons remaining$/))) return `فاضل ${match[1]} أيقونات`;
    if ((match = text.match(/^MOMENT (\d+) OF (\d+)$/))) return `الموقف ${match[1]} من ${match[2]}`;
    if ((match = text.match(/^FIND MOMENT (\d+)$/))) return `دوّر على الموقف ${match[1]}`;
    if ((match = text.match(/^CLASSROOM CODE · LESSON (\d+)$/))) return `كود الفصل · الدرس ${match[1]}`;
    if ((match = text.match(/^FOR THE CLASSROOM · LESSON (\d+)$/))) return `للفصل · الدرس ${match[1]}`;
    if ((match = text.match(/^LESSON (\d+)$/))) return `الدرس ${match[1]}`;
    if ((match = text.match(/^Now find the place for (.+)\.$/))) return `دلوقتي دوّر على مكان ${arabic(match[1])}.`;
    if ((match = text.match(/^Correct! (.+)$/))) return `صح! ${arabic(match[1])}`;
    if ((match = text.match(/^Try again\. (.+)$/))) return `جرّب تاني. ${arabic(match[1])}`;
    if ((match = text.match(/^Hint: position (\d+) should be “(.+)”$/))) return `تلميح: الكارت رقم ${match[1]} لازم يكون «${arabic(match[2].replace(/\.$/, ''))}».`;
    if ((match = text.match(/^Hint: (.+)$/))) return `تلميح: ${arabic(match[1])}`;
    if ((match = text.match(/^That belongs to (.+)\. (.+)$/))) return `ده من ${arabic(match[1])}. ${arabic(match[2])}`;
    if ((match = text.match(/^QR code that opens (.+)$/))) return `كود يفتح ${arabic(match[1])}`;
    if ((match = text.match(/^(\d+) of 5 moments are in the right place\. Look again at the story and try moving a card\.$/))) return `${match[1]} من 5 مواقف في مكانهم. بص على القصة تاني وحرّك كارت.`;
    if ((match = text.match(/^(\d+) \/ (\d+) Packed$/))) return `${match[1]} من ${match[2]} في الشنطة`;
    if ((match = text.match(/^(\d+) of (\d+)$/))) return `${match[1]} من ${match[2]}`;
    if ((match = text.match(/^(\d+) pts$/))) return `${match[1]} نقطة`;
    if ((match = text.match(/^(\d+) hints? left(?: \(.*?\))?$/))) return `فاضل ${match[1]} تلميحات`;
    return text;
  }

  function translateNode(node) {
    if (node.parentElement?.closest('.lang-toggle') || ignoredTags.has(node.parentElement?.tagName)) return;
    const current = node.nodeValue;
    if (!current || !current.trim()) return;
    if (language === 'ar') {
      const trimmed = current.trim();
      const translated = arabic(trimmed);
      if (translated !== trimmed) {
        originalText.set(node, current);
        node.nodeValue = current.replace(trimmed, translated);
      }
    } else if (originalText.has(node)) {
      const source = originalText.get(node);
      if (node.nodeValue !== source) node.nodeValue = source;
    }
  }

  function translateAttributes(element) {
    if (element.classList?.contains('lang-toggle')) return;
    for (const attribute of ['aria-label','alt','title','placeholder']) {
      const current = element.getAttribute(attribute);
      if (!current) continue;
      let saved = originalAttributes.get(element);
      if (!saved) { saved = {}; originalAttributes.set(element, saved); }
      if (language === 'ar') {
        let translated = arabic(current);
        let match;
        if (translated === current && attribute === 'aria-label') {
          if ((match = current.match(/^Move (.+) (earlier|later)$/))) translated = `حرّك ${arabic(match[1])} ${match[2] === 'earlier' ? 'لفوق' : 'لتحت'}`;
          else if ((match = current.match(/^Place (.+): (.+)$/))) translated = `حط ${arabic(match[1])}: ${arabic(match[2])}`;
          else if ((match = current.match(/^(.+)\. (.+)$/))) translated = `${arabic(match[1])}. ${arabic(match[2])}`;
        }
        if (translated !== current) { saved[attribute] = current; element.setAttribute(attribute, translated); }
      } else if (saved[attribute]) {
        element.setAttribute(attribute, saved[attribute]);
        delete saved[attribute];
      }
    }
  }

  function translateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) { translateNode(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    translateAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeType === Node.TEXT_NODE) translateNode(node);
      else translateAttributes(node);
    }
  }

  function updateToggle() {
    const button = document.querySelector('.lang-toggle');
    if (!button) return;
    button.textContent = language === 'ar' ? 'English' : 'العربي';
    button.setAttribute('aria-label', language === 'ar' ? 'حوّل للإنجليزي' : 'Switch to Arabic');
    button.setAttribute('title', language === 'ar' ? 'حوّل للإنجليزي' : 'Switch to Arabic');
  }

  function setLanguage(next) {
    language = next === 'en' ? 'en' : 'ar';
    try { localStorage.setItem('sundaySchoolLanguage', language); } catch {}
    document.documentElement.lang = language === 'ar' ? 'ar-EG' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = language === 'ar' ? arabic(titleEnglish) : titleEnglish;
    translateTree(document.body);
    updateToggle();
  }

  function init() {
    const header = document.querySelector('.topbar, .site-header');
    if (header) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lang-toggle';
      button.addEventListener('click', () => setLanguage(language === 'ar' ? 'en' : 'ar'));
      if (header.classList.contains('topbar') && header.querySelector('.topbar-actions')) header.querySelector('.topbar-actions').append(button);
      else header.append(button);
    }
    setLanguage(language);
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') translateNode(mutation.target);
        else if (mutation.type === 'attributes') translateAttributes(mutation.target);
        else mutation.addedNodes.forEach(translateTree);
      }
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','alt','title','placeholder']});
  }

  window.CopticI18n = {setLanguage, get language() { return language; }, translate: arabic};
  init();
})();
