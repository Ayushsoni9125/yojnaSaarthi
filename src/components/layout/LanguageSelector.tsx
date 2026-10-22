"use client";

import { useEffect, useState, useRef } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export const INDIAN_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
];

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<string>("en");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize language from cookie or localStorage
  useEffect(() => {
    const getStoredLang = () => {
      const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z]+)/);
      if (match && match[1]) {
        return match[1].toLowerCase();
      }
      return localStorage.getItem("preferred_lang") || "en";
    };

    const lang = getStoredLang();
    setCurrentLang(lang);

    // Initialize Google Translate script
    if (!document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi,mr,bn,ta,te,gu,kn,pa,ml,or,ur",
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    localStorage.setItem("preferred_lang", langCode);

    if (langCode === "en") {
      // Clear cookie to revert to native English
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      window.location.reload();
      return;
    }

    // Set Google translate cookie for target language
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;

    // Fast trigger or reload for complete translation
    window.location.reload();
  };

  const selectedLang = INDIAN_LANGUAGES.find((l) => l.code === currentLang) || INDIAN_LANGUAGES[0];

  return (
    <div className="relative inline-block text-left notranslate" translate="no" ref={dropdownRef}>
      {/* Hidden element required for Google Translate engine */}
      <div id="google_translate_element" style={{ display: "none" }} />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="notranslate inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-95"
        translate="no"
        title="Change Language (भाषा बदलें)"
      >
        <Globe className="h-3.5 w-3.5 text-emerald-600" />
        <span className="font-medium text-slate-800 notranslate" translate="no">{selectedLang.nativeName}</span>
        <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="notranslate absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-150"
          translate="no"
        >
          <div className="px-3 py-2 border-b border-slate-100 mb-1 notranslate" translate="no">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider notranslate" translate="no">
              Select Language / भाषा चुनें
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1 notranslate" translate="no">
            {INDIAN_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors notranslate ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  translate="no"
                >
                  <div className="flex flex-col items-start text-left notranslate" translate="no">
                    <span className="text-sm font-semibold notranslate" translate="no">{lang.nativeName}</span>
                    <span className="text-[10px] text-slate-400 notranslate" translate="no">{lang.name}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
