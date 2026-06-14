import { useState } from "react";
import { Link } from "react-router-dom";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { Dialog } from "@/components/ui/dialog";

export function RegisterPage() {
  const [downloadOpen, setDownloadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#9590B8]">
      <header className="flex items-center justify-between px-10 py-6">
        <span className="font-heading text-3xl font-bold text-foreground">SmartSeeds</span>
        <nav className="flex items-center gap-6">
          <Link
            to="/contact"
            className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
          >
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

      <main className="flex flex-col items-center pt-10 px-4 pb-20">
        <h1 className="font-heading text-5xl font-bold text-foreground mb-8">
          Create Account
        </h1>
        <div className="w-full max-w-md rounded-2xl bg-white px-8 py-8 shadow-sm">
          <RegisterForm />
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
