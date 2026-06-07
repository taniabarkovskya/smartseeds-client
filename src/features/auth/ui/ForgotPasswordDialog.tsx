import { Mail } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ForgotPasswordDialog({ open, onClose }: ForgotPasswordDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Forgot password?">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Self-service password reset is not yet available. Please contact our support team — we will help you restore access within 24 hours.
        </p>

        <a
          href="mailto:support@smartseeds.ua"
          className="flex items-center gap-2 w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Mail className="size-4 text-primary" />
          support@smartseeds.ua
        </a>

        <Button
          variant="dark"
          size="lg"
          className="w-full"
          onClick={onClose}
        >
          Got it
        </Button>
      </div>
    </Dialog>
  );
}
