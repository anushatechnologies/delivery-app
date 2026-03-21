import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Language = "en" | "te";

type Translations = {
  [key: string]: {
    en: string;
    te: string;
  };
};

const translations: Translations = {
  greeting: { en: "Hello", te: "నమస్కారం" },
  activeOrders: { en: "Active Orders", te: "ప్రస్తుత ఆర్డర్లు" },
  completedOrders: { en: "Completed Orders", te: "పూర్తయిన ఆర్డర్లు" },
  earnings: { en: "Earnings", te: "సంపాదన" },
  profile: { en: "Profile", te: "ప్రొఫైల్" },
  home: { en: "Home", te: "హోమ్" },
  tasks: { en: "Tasks", te: "పనులు" },
  account: { en: "Account", te: "ఖాతా" },
  logout: { en: "Logout", te: "లాగ్ అవుట్" },
  language: { en: "Language", te: "భాష" },
  help: { en: "Help Center", te: "సహాయ కేంద్రం" },
  refer: { en: "Refer & Earn", te: "రిఫర్ & ఎర్న్" },
  online: { en: "Online", te: "ఆన్‌లైన్" },
  offline: { en: "Offline", te: "ఆఫ్‌లైన్" },
  goOnline: { en: "Go Online", te: "ఆన్‌లైన్ వెళ్ళండి" },
  liveDemand: { en: "Live Demand", te: "లైవ్ డిమాండ్" },
  incentives: { en: "Today's Incentives", te: "నేటి ప్రోత్సాహకాలు" },
  notification: { en: "Notifications", te: "నోటిఫికేషన్లు" },
  vehicle: { en: "Vehicle", te: "వాహనం" },
  rating: { en: "Rating", te: "రేటింగ్" },
  personalDetails: { en: "Personal Details", te: "వ్యక్తిగత వివరాలు" },
  vehicleInfo: { en: "Vehicle Information", te: "వాహన సమాచారం" },
  kyc: { en: "KYC Verification", te: "KYC ధృవీకరణ" },
  terms: { en: "Terms & Conditions", te: "నిబంధనలు & షరతులు" },
  about: { en: "About", te: "గురించి" },
  stats: { en: "Statistics", te: "గణాంకాలు" },
  history: { en: "Order History", te: "ఆర్డర్ చరిత్ర" },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "@anusha_bazaar_language";

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLangState] = useState<Language>("en");

  useEffect(() => {
    const loadLang = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "te") {
        setLangState(stored as Language);
      }
    };
    loadLang();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLangState(lang);
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
