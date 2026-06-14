import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sprout, Menu, X } from "lucide-react";
import { supabase } from "@/shared/api/supabase";
import { Dialog } from "@/components/ui/dialog";

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

const NAV_LINKS = [
  { to: "/courses",       label: "Content" },
  { to: "/tasks",         label: "Tasks" },
  { to: "/ai",            label: "AI Assistant" },
  { to: "/notifications", label: "Notifications" },
];

export function AppHeader() {
  const navigate = useNavigate();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
      <header className="px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo + desktop nav */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Sprout className="size-5 text-foreground" />
              <span className="font-heading font-bold text-foreground">SmartSeeds</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
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
              onClick={() => setSignOutOpen(true)}
              className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity ml-2"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex items-center justify-center text-foreground p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden mt-3 border-t border-white/20 pt-3 flex flex-col">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
              >
                {label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-3 mt-1 border-t border-white/20 text-foreground">
              <a href="#" aria-label="Instagram" className="hover:opacity-70 transition-opacity">
                <IconInstagram />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:opacity-70 transition-opacity">
                <IconLinkedin />
              </a>
              <a href="#" aria-label="X" className="hover:opacity-70 transition-opacity">
                <IconX />
              </a>
              <button
                onClick={() => { setMenuOpen(false); setSignOutOpen(true); }}
                className="ml-auto text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      <Dialog open={signOutOpen} onClose={() => setSignOutOpen(false)} title="Sign Out">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Are you sure you want to sign out?
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => setSignOutOpen(false)}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 rounded-xl bg-[#9590B8] py-2.5 text-sm font-medium text-white hover:opacity-85 transition-opacity"
          >
            Sign Out
          </button>
        </div>
      </Dialog>
    </>
  );
}
