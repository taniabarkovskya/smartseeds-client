import { Link } from "react-router-dom";
import { Mail, Clock, MessageCircle } from "lucide-react";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-[#9590B8]">
      <header className="flex items-center justify-between px-4 py-5 md:px-10 md:py-6">
        <Link to="/login" className="font-heading text-3xl font-bold text-foreground hover:opacity-80 transition-opacity">
          SmartSeeds
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/contact"
            className="text-sm font-medium text-foreground opacity-70 transition-opacity"
          >
            Contact
          </Link>
          <Link
            to="#"
            className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
          >
            Download
          </Link>
        </nav>
      </header>

      <main className="flex flex-col items-center pt-10 px-4 pb-16 md:pt-16 md:pb-20">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-3 md:text-5xl">Contact Us</h1>
        <p className="text-foreground/70 text-base mb-10">
          We're here to help. Reach out anytime.
        </p>

        <div className="w-full max-w-md rounded-2xl bg-white px-8 py-8 shadow-sm flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#9590B8]/15">
              <Mail className="h-5 w-5 text-[#9590B8]" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-0.5">
                Support email
              </p>
              <a
                href="mailto:support@smartseeds.app"
                className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
              >
                support@smartseeds.app
              </a>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#9590B8]/15">
              <MessageCircle className="h-5 w-5 text-[#9590B8]" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-0.5">
                Feedback
              </p>
              <a
                href="mailto:feedback@smartseeds.app"
                className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
              >
                feedback@smartseeds.app
              </a>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#9590B8]/15">
              <Clock className="h-5 w-5 text-[#9590B8]" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-0.5">
                Response time
              </p>
              <p className="text-sm font-medium text-foreground">Within 24 hours on business days</p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-foreground/60">
          Back to{" "}
          <Link to="/login" className="font-medium text-foreground hover:opacity-70 transition-opacity underline underline-offset-2">
            login
          </Link>
        </p>
      </main>
    </div>
  );
}
