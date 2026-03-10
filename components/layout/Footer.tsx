import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-background/50 backdrop-blur-lg mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-8 py-8">
        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <span className="font-semibold text-muted-foreground">
            StickerAI © {new Date().getFullYear()}
          </span>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/#" className="hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/#" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/#" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
