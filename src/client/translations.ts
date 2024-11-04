let currentLanguage: keyof typeof translations = "en-US";
const translations = {
  "en-US": {
    templateChoose: "Choose a frame",
  },
  "ja": {
    templateChoose: "写真のフレームを選んでください",
  },
};

export function t(key: keyof typeof translations["en-US"]) {
  return translations[currentLanguage][key];
}

export function setLanguage(language: typeof currentLanguage) {
  currentLanguage = language;
}
