import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { Dialog } from "@/components/ui/dialog";

export function LoginPage() {
  const [downloadOpen, setDownloadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#9590B8]">
      <header className="flex items-center justify-between px-4 py-5 md:px-10 md:py-6">
        <span className="font-heading text-2xl font-bold text-foreground md:text-3xl">SmartSeeds</span>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link to="/contact" className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            Contact
          </Link>
          <button
            onClick={() => setDownloadOpen(true)}
            className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
          >
            Download
          </button>
        </nav>
      </header>

      <main className="flex flex-col items-center pt-10 px-4 pb-16 md:pt-16 md:pb-20">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-6 md:text-5xl md:mb-8">Login</h1>
        <div className="w-full max-w-md rounded-2xl bg-white px-5 py-6 shadow-sm md:px-8 md:py-8">
          <LoginForm />
        </div>
      </main>

      <Dialog open={downloadOpen} onClose={() => setDownloadOpen(false)} title="Coming Soon 🌱">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Our mobile app is currently in development. Stay tuned and be among the first to try it!
        </p>
        <button
          onClick={() => setDownloadOpen(false)}
          className="mt-5 w-full rounded-xl bg-[#9590B8] py-2.5 text-sm font-medium text-white hover:opacity-85 transition-opacity"
        >
          Got it
        </button>
      </Dialog>
    </div>
  );
}
