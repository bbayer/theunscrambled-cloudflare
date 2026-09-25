import type { Child, FC } from "hono/jsx";

export interface LayoutProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  children: Child;
}

export const Layout: FC<LayoutProps> = ({
  title,
  description,
  canonicalUrl = "https://theunscrambled.com",
  children,
}) => {
  return (
    <html lang="en" class="h-full bg-slate-50 text-slate-900 antialiased">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#16a34a" />

        {/* Favicon SVG Data URI */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%2316a34a'/><text x='50' y='70' font-size='60' font-family='sans-serif' font-weight='900' fill='white' text-anchor='middle'>U</text></svg>" type="image/svg+xml" />

        {/* Open Graph / Social */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Unscrambled" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />

        {/* Schema.org WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "The Unscrambled",
              "url": "https://theunscrambled.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://theunscrambled.com/unscramble-{search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-W2L8DX0CTX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W2L8DX0CTX');
          `,
          }}
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3302383181316413"
          crossorigin="anonymous"
        ></script>

        {/* Tailwind CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: {
                      50: '#f0fdf4',
                      100: '#dcfce7',
                      500: '#22c55e',
                      600: '#16a34a',
                      700: '#15803d',
                    }
                  }
                }
              }
            }
          `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
          `,
          }}
        />
      </head>
      <body class="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {/* Navigation Bar */}
        <header class="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2 group">
              <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm shadow-emerald-500/20 group-hover:bg-emerald-700 transition">
                U
              </div>
              <span class="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                The Unscrambled
              </span>
            </a>

            <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="/anagram-solver" class="hover:text-emerald-600 transition">
                Anagram Solver
              </a>
              <a href="/5-letter-words" class="hover:text-emerald-600 transition">
                5-Letter Words
              </a>
              <a href="/j-words" class="hover:text-emerald-600 transition">
                J-Words
              </a>
              <a href="/words-ending-in-ing" class="hover:text-emerald-600 transition">
                Words ending in -ing
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main class="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer class="border-t border-slate-200 bg-white mt-16 py-12 text-sm text-slate-500">
          <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-8">
            <div class="space-y-2">
              <div class="flex items-center gap-2 font-bold text-slate-900">
                <span class="w-5 h-5 rounded bg-emerald-600 text-white text-xs flex items-center justify-center">U</span>
                The Unscrambled
              </div>
              <p class="text-xs text-slate-500 max-w-sm">
                Fast, comprehensive unscrambler and anagram solver for Scrabble, Words with Friends, Wordscapes, and Jumble word puzzles.
              </p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
              <div>
                <h4 class="font-semibold text-slate-900 mb-3">Popular Lengths</h4>
                <ul class="space-y-1.5">
                  <li><a href="/2-letter-words" class="hover:underline">2 Letter Words</a></li>
                  <li><a href="/3-letter-words" class="hover:underline">3 Letter Words</a></li>
                  <li><a href="/4-letter-words" class="hover:underline">4 Letter Words</a></li>
                  <li><a href="/5-letter-words" class="hover:underline">5 Letter Words</a></li>
                  <li><a href="/6-letter-words" class="hover:underline">6 Letter Words</a></li>
                  <li><a href="/7-letter-words" class="hover:underline">7 Letter Words</a></li>
                </ul>
              </div>

              <div>
                <h4 class="font-semibold text-slate-900 mb-3">Letter Hubs</h4>
                <ul class="space-y-1.5">
                  <li><a href="/q-words" class="hover:underline">Words with Q</a></li>
                  <li><a href="/z-words" class="hover:underline">Words with Z</a></li>
                  <li><a href="/x-words" class="hover:underline">Words with X</a></li>
                  <li><a href="/j-words" class="hover:underline">Words with J</a></li>
                  <li><a href="/k-words" class="hover:underline">Words with K</a></li>
                </ul>
              </div>

              <div>
                <h4 class="font-semibold text-slate-900 mb-3">Word Tools</h4>
                <ul class="space-y-1.5">
                  <li><a href="/anagram-solver" class="hover:underline">Anagram Solver</a></li>
                  <li><a href="/words-starting-with-un" class="hover:underline">Words Starting with UN</a></li>
                  <li><a href="/words-ending-in-ed" class="hover:underline">Words Ending in ED</a></li>
                  <li><a href="/sitemap.xml" class="hover:underline">Sitemap</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} The Unscrambled. All rights reserved.</p>
            <p>Fast, accurate anagram & Scrabble word solver.</p>
          </div>
        </footer>
      </body>
    </html>
  );
};
