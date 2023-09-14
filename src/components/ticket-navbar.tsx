import {useRouter} from "next/router";
import DarkModeToggle from "./dark-mode-toggle";
import {Button} from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {ArrowDown, ChevronDown, Plus} from "lucide-react";

export default function TicketNavbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full z-10 p-4">
      <div className="flex items-center justify-end">
        <div className="flex flex-row space-x-2">
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={() => router.push("/")}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {
                  {
                    en: "English",
                    bm: "Bahasa Melayu",
                  }[(router.query.lang as string) || "en"]
                }
                <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-1">
              <DropdownMenuRadioGroup
                value={(router.query.lang as string) || "en"}
                onValueChange={(a) =>
                  router.push({
                    pathname: `/${a}/ticket`,
                    query: {runningNumber: router?.query?.runningNumber},
                  })
                }
              >
                <DropdownMenuRadioItem value="en">
                  English
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bm">
                  Bahasa Melayu
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}
