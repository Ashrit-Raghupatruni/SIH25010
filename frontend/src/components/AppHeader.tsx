import { Sprout, Globe, Bell, Mic } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
];

const AppHeader = () => {
  const { t, i18n } = useTranslation();
  const [showLang, setShowLang] = useState(false);

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    setShowLang(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-end px-6">

        <div className="flex items-center gap-2">
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-accent"
            aria-label={t("voice_input")}
          >
            <Mic className="h-5 w-5" />
          </button>

          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-accent"
            aria-label={t("notifications")}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowLang(!showLang)}
              className="flex h-10 items-center gap-1.5 rounded-xl bg-muted px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent"
            >
              <Globe className="h-4 w-4" />
              {languages.find((l) => l.code === i18n.language)?.label ?? "English"}
            </button>
            {showLang && (
              <div className="absolute right-0 top-12 w-36 rounded-xl border bg-card p-1 shadow-lg">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                      i18n.language === l.code ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
