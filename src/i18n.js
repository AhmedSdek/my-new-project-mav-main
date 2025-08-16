import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          hello: "Hello",
        },
      },
      ar: {
        translation: {
          hello: "مرحبا",
        },
      },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    load: "languageOnly",
    checkWhitelist: true,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

// 👇 تصحيح قيمة localStorage بعد init
const lng = i18n.language?.split("-")[0]; // ياخد en بس من en-US
if (lng && ["en", "ar"].includes(lng)) {
  localStorage.setItem("i18nextLng", lng);
  i18n.changeLanguage(lng); // يحدث اللغه الحاليه
}

export default i18n;
