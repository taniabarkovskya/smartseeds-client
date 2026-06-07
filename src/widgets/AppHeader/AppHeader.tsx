import { useNavigate, Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import { supabase } from "@/shared/api/supabase";

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <line x1="7" y1="11" x2="7" y2="17" />
      <line x1="11" y1="17" x2="11" y2="11" />
      <path d="M11 13.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V17" />
      <circle cx="7" cy="8" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function AppHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <Sprout className="size-5 text-foreground" />
          <span className="font-heading font-bold text-foreground">SmartSeeds</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/courses"
            className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
          >
            Content
          </Link>
          <Link
            to="/courses"
            className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
          >
            Tasks
          </Link>
          <button className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            AI Assistant
          </button>
          <button className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            Notifications
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-foreground">
          <a href="#" aria-label="Instagram" className="hover:opacity-70 transition-opacity">
            <IconInstagram />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:opacity-70 transition-opacity">
            <IconLinkedin />
          </a>
          <a href="#" aria-label="X" className="hover:opacity-70 transition-opacity">
            <IconX />
          </a>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity ml-2"
        >
          Вийти
        </button>
      </div>
    </header>
  );
}
