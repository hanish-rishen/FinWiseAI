"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Check, Globe2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

// Simplified to only include English, Hindi, and Tamil
const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    flag: "🇮🇳",
  },
];

export default function LanguageSettings() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Reset the selectedLanguage if the global language changes
    setSelectedLanguage(language);
  }, [language]);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    setSaveSuccess(false);
  };

  const handleSaveLanguage = () => {
    setLanguage(selectedLanguage);
    setSaveSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("language_settings")}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                <Globe2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t("select_language")}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("language_description")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <RadioGroup
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
              className="space-y-3"
            >
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`flex items-center p-3 rounded-lg border ${
                    selectedLanguage === lang.code
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700"
                      : "border-gray-200 dark:border-gray-800"
                  } hover:border-blue-300 dark:hover:border-blue-800 transition-colors`}
                >
                  <RadioGroupItem
                    value={lang.code}
                    id={lang.code}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={lang.code}
                    className="flex-1 flex items-center cursor-pointer"
                  >
                    <div className="text-xl mr-3">{lang.flag}</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {lang.nativeName}
                      </div>
                      {lang.name !== lang.nativeName && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {lang.name}
                        </div>
                      )}
                    </div>
                    {selectedLanguage === lang.code && (
                      <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 ml-auto" />
                    )}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
              {saveSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 dark:text-green-400 text-sm flex items-center mb-4 sm:mb-0"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {t("save_success")}
                </motion.div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                  {t("current_language")}{" "}
                  <span className="font-medium">
                    {languages.find((l) => l.code === language)?.name ||
                      "English"}
                  </span>
                </div>
              )}

              <Button
                onClick={handleSaveLanguage}
                disabled={language === selectedLanguage}
              >
                {t("save_preference")}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="mt-6 bg-white dark:bg-gray-900 shadow-sm">
          <div className="p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
              {t("about_language_support")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t("language_support_description")}
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
              <li>{t("feature_interface")}</li>
              <li>{t("feature_conversations")}</li>
              <li>{t("feature_documents")}</li>
              <li>{t("feature_accents")}</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
