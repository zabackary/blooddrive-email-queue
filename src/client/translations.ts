let currentLanguage: keyof typeof translations = "en-US";
const translations = {
  "en-US": {
    templateChoose: "Choose a frame",
    templateChooseLabel: "Choose a frame",
    mailPrint: "Digital downloads and printing",
    mailPrintLabel: "Email and print",
    freeDownloads:
      "Digital downloads are offered for free. If you'd like to download a digital copy of your photos, please add your email.",
    printAction: "Print",
    printEmailAction: "Print and email",
    addEmail: "Add email",
    removeEmail: "Remove email",
    loading: "Hold on a second...",
  },
  "ja": {
    templateChoose: "写真のフレームを選んでください",
    templateChooseLabel: "写真のフレームを選ぶ",
    mailPrint: "ディジタルダウンロードとプリントアウト",
    mailPrintLabel: "メールとプリントアウト",
    freeDownloads:
      "ディジタルダウンロードは無料サービスです。もしダウンロードをしたかったら、メールアドレスを入力してください。",
    printAction: "プリントアウトする",
    printEmailAction: "プリントアウトしてメールする",
    addEmail: "メールアドレスを足す",
    removeEmail: "メールアドレスを引く",
    loading: "少々お待ちください",
  },
};

export function t(key: keyof typeof translations["en-US"]) {
  return translations[currentLanguage][key];
}

export function setLanguage(language: typeof currentLanguage) {
  currentLanguage = language;
}
