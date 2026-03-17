import { ByreixLogo } from "./ByreixLogo";
import { Github, Twitter, Send } from "lucide-react";
import { AdSlot, BannerAd, BannerAdSize } from "@/components/ads";

export function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Swap", "Send", "TrendView", "Smart Escrow"],
    },
    {
      title: "Resources",
      links: ["Documentation", "API", "Support", "Community"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Contact"],
    },
  ];

  return (
    <footer className="bg-background border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <ByreixLogo />
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              Non-custodial wallet infrastructure for the Sidrachain ecosystem: secure by default,
              clear by design.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-(--byreix-gold-soft) mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <AdSlot adId="footer-ads" className="mt-8">
          <BannerAd
            imageURL="/mockThumbnail.png"
            linkURL="https://example.com"
            size={BannerAdSize.MEDIUM_RECTANGLE}
            altText="Footer Ad"
          />
        </AdSlot>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2026 ByReiXwift. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
