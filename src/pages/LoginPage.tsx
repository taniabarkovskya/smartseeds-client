import { Link } from "react-router-dom";
import { LoginForm } from "@/features/auth/ui/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-[#9590B8]">
      <header className="flex items-center justify-between px-10 py-6">
        <span className="font-heading text-3xl font-bold text-foreground">SmartSeeds</span>
        <nav className="flex items-center gap-6">
          <Link to="#" className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            Contact
          </Link>
          <Link to="#" className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            Download
          </Link>
        </nav>
      </header>

      <main className="flex flex-col items-center pt-16 px-4 pb-20">
        <h1 className="font-heading text-5xl font-bold text-foreground mb-8">Login</h1>
        <div className="w-full max-w-md rounded-2xl bg-white px-8 py-8 shadow-sm">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
