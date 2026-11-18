import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#030305] text-zinc-400 py-16 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl tracking-[0.35em] font-medium text-white">
                TESSRO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            </Link>
            <p className="text-zinc-500 text-xs font-sans mt-2 leading-relaxed">
              Bespoke digital architecture for modern brands. Choose between dedicated human designers or fine-tuned AI website generation.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          {/* Links Column 1: Services */}
          <div>
            <div className="text-white uppercase tracking-wider mb-4 font-semibold">Services</div>
            <ul className="space-y-2.5 text-zinc-500">
              <li><a href="#plans" className="hover:text-white transition">Human Designer ($49.99)</a></li>
              <li><a href="#ai-builder" className="hover:text-white transition">AI Website Builder ($29.99)</a></li>
              <li><a href="#micro-tools" className="hover:text-white transition">AI Logo Studio ($5.00)</a></li>
              <li><a href="#micro-tools" className="hover:text-white transition">AI Video Studio ($5.00)</a></li>
            </ul>
          </div>

          {/* Links Column 2: Visual Archetypes */}
          <div>
            <div className="text-white uppercase tracking-wider mb-4 font-semibold">AI Archetypes</div>
            <ul className="space-y-2.5 text-zinc-500">
              <li><a href="#ai-builder" className="hover:text-white transition">Glassmorphism UI</a></li>
              <li><a href="#ai-builder" className="hover:text-white transition">Claymorphism 3D</a></li>
              <li><a href="#ai-builder" className="hover:text-white transition">Neo-Brutalism Raw</a></li>
              <li><a href="#ai-builder" className="hover:text-white transition">Swiss Minimalism</a></li>
              <li><a href="#ai-builder" className="hover:text-white transition">Liquid Glass Bento</a></li>
            </ul>
          </div>

          {/* Links Column 3: Platform */}
          <div>
            <div className="text-white uppercase tracking-wider mb-4 font-semibold">Architecture</div>
            <ul className="space-y-2.5 text-zinc-500">
              <li><a href="#workflow" className="hover:text-white transition">Google Cloud Storage (1TB)</a></li>
              <li><a href="#workflow" className="hover:text-white transition">Multi-Cloud Storage Clusters</a></li>
              <li><a href="#workflow" className="hover:text-white transition">Free Vercel Edge Hosting</a></li>
              <li><a href="#workflow" className="hover:text-white transition">Designer Ticket System</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600 text-[11px]">
          <div>
            &copy; 2026 TESSRO DIGITAL INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-400 transition">PRIVACY POLICY</Link>
            <Link href="/terms" className="hover:text-zinc-400 transition">TERMS OF SERVICE</Link>
            <Link href="/admin" className="hover:text-zinc-400 transition">ADMIN PORTAL</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
