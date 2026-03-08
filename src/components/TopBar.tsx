import { Globe, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const languages: { code: Language; label: string }[] = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "ar", label: "العربية" },
  { code: "ru", label: "Русский" },
];

const TopBar = () => {
  const { language, setLanguage, t } = useLanguage();
  const currentLabel = languages.find((l) => l.code === language)?.label || "Türkçe";

  return (
    <div className="bg-topbar text-topbar-foreground">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 text-sm">
        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:opacity-80 transition-opacity outline-none">
              <Globe className="h-3.5 w-3.5" />
              <span>{currentLabel}</span>
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className="flex items-center justify-between"
                >
                  {lang.label}
                  {language === lang.code && <Check className="h-3.5 w-3.5 ml-2" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="hidden md:inline">
            {t("topbar.appointment")}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:opacity-80 transition-opacity">{t("topbar.campaigns")}</a>
          <a href="#" className="hover:opacity-80 transition-opacity">{t("topbar.help")}</a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
