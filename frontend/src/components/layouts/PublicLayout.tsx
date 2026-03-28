import { Outlet, Link } from "react-router-dom";
import { Sprout, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
];

const PublicLayout = () => {
  const { i18n } = useTranslation();
  const [showLang, setShowLang] = useState(false);

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    setShowLang(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              Krishi<span className="text-primary">Mitra</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowLang(!showLang)}
                className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Globe className="h-4 w-4" />
                {languages.find((l) => l.code === i18n.language)?.label ?? "English"}
              </button>
              {showLang && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl border bg-card p-1 shadow-lg">
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
            <Link
              to="/dashboard"
              className="px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>
      <main className="pt-16">
        <Outlet />
      </main>
      <footer className="border-t py-12 mt-12 bg-card">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>© 2026 KrishiMitra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
