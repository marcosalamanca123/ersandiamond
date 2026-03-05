import { Globe, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "ar", label: "العربية" },
  { code: "ru", label: "Русский" },
];

const TopBar = () => {
  return (
    <div className="bg-topbar text-topbar-foreground">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 text-sm">
        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:opacity-80 transition-opacity outline-none">
              <Globe className="h-3.5 w-3.5" />
              <span>Dil Seçiniz</span>
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((lang) => (
                <DropdownMenuItem key={lang.code}>{lang.label}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="hidden md:inline">
            Randevu Sistemini Seviyoruz — ERSAN DİAMOND
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:opacity-80 transition-opacity">Kampanyalar</a>
          <a href="#" className="hover:opacity-80 transition-opacity">Yardım & Destek</a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
