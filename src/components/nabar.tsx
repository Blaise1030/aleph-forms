import DarkModeToggle from "./dark-mode-toggle";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-10 p-4">
      <div className="flex items-center justify-end">
        <DarkModeToggle />
      </div>
    </nav>
  );
}
