import {MoonIcon, SunIcon} from "lucide-react";
import {Button} from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {useTheme} from "next-themes";

export default function DarkModeToggle() {
  const {theme, setTheme} = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="h-4 w-4 dark:hidden block" />
          <MoonIcon className="h-4 w-4 dark:block hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-1">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(a) => setTheme(a as "light" | "dark" | "system")}
        >
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
