
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export function ThemeToggle() {
  const { setTheme, theme, themes } = useTheme();
  const { translate } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9 transition-all duration-300 hover:scale-110">
          {theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : theme === "light" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Palette className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{translate("Select Theme")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setTheme("light")} className={theme === "light" ? "bg-accent" : ""}>
            <Sun className="h-4 w-4 mr-2" />
            {translate("Light")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className={theme === "dark" ? "bg-accent" : ""}>
            <Moon className="h-4 w-4 mr-2" />
            {translate("Dark")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("blue")} className={theme === "blue" ? "bg-accent" : ""}>
            <div className="h-4 w-4 mr-2 rounded-full bg-blue-500" />
            {translate("Blue")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("purple")} className={theme === "purple" ? "bg-accent" : ""}>
            <div className="h-4 w-4 mr-2 rounded-full bg-purple-500" />
            {translate("Purple")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("green")} className={theme === "green" ? "bg-accent" : ""}>
            <div className="h-4 w-4 mr-2 rounded-full bg-green-500" />
            {translate("Green")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("orange")} className={theme === "orange" ? "bg-accent" : ""}>
            <div className="h-4 w-4 mr-2 rounded-full bg-orange-500" />
            {translate("Orange")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme("system")} className={theme === "system" ? "bg-accent" : ""}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {translate("System")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
