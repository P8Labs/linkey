import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-20">
        <header className="text-center mb-20">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <span className="text-white font-bold text-xl">P8</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 dark:text-white mb-4">
            Linkey
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto font-light">
            One link to rule them all
          </p>
        </header>

        {/* Main Content */}
        <div className="text-center mb-20">
          <div className="max-w-lg mx-auto">
            <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg font-light leading-relaxed">
              A minimalist link-in-bio solution crafted by P8labs. Clean, fast,
              and effortlessly elegant.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium py-3 px-8 rounded-full hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Create Your Page
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500 font-light">
            Made with ♡ by P8labs
          </p>
        </footer>
      </div>
    </div>
  );
}
