import { Button } from "@/components/ui/button";
import type { Language } from "@shared/schema";
import { languageNames } from "@/lib/translations";

interface LanguageSelectorProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSelector({ currentLang, onLanguageChange }: LanguageSelectorProps) {
  const languages: Language[] = ["ko", "en", "zh", "ja"];

  return (
    <div className="flex justify-center gap-2 px-4 py-6">
      {languages.map((lang) => (
        <Button
          key={lang}
          data-testid={`button-lang-${lang}`}
          variant={currentLang === lang ? "default" : "outline"}
          size="sm"
          onClick={() => onLanguageChange(lang)}
          className="min-w-[70px]"
        >
          {languageNames[lang]}
        </Button>
      ))}
    </div>
  );
}
