import { Link } from "react-router-dom";

/* ---------- Inline Social Icons ---------- */
const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
);

const YoutubeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const WhatsappIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12.001 2.003c-5.523 0-10 4.477-10 10 0 1.766.462 3.492 1.34 5.008L2 22l5.13-1.323a9.95 9.95 0 0 0 4.871 1.276h.004c5.523 0 10-4.477 10-10s-4.477-10-9.999-10zm5.919 15.919a8.29 8.29 0 0 1-5.919 2.45h-.003a8.263 8.263 0 0 1-4.211-1.152l-.302-.18-3.045.786.813-2.968-.197-.304a8.24 8.24 0 0 1-1.267-4.394c0-4.556 3.708-8.264 8.264-8.264 2.208 0 4.283.86 5.844 2.421a8.207 8.207 0 0 1 2.42 5.844c0 4.555-3.707 8.263-8.262 8.263z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Footer Component – QubanHC / Anandavrinda themed                 */
/* ------------------------------------------------------------------ */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-slate-700 mt-auto relative">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand & Social */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src="/images/anandavrinda.jpeg"
                alt="Anandavrinda"
                className="h-28 w-28 object-contain bg-white p-2"
              />
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Experience peace and positivity through pure, handcrafted
              Agarbatti and Dhoop Batti — made with love and natural essence.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="text-slate-800 hover:text-teal-600 transition-colors"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-slate-800 hover:text-teal-600 transition-colors"
              >
                <TwitterIcon />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-slate-800 hover:text-teal-600 transition-colors"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-slate-800 hover:text-teal-600 transition-colors"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Quick links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-slate-700 hover:text-teal-600 transition-colors"
                >
                  privacy polic
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-slate-700 hover:text-teal-600 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-sm text-slate-700 hover:text-teal-600 transition-colors"
                >
                  Shipping-policy
                </Link>
              </li>
              <li>
                <Link
                  to="/return-policy"
                  className="text-sm text-slate-700 hover:text-teal-600 transition-colors"
                >
                  Return policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Information
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/track-order"
                  className="text-sm text-slate-700 hover:text-teal-600 transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm text-slate-700 hover:text-teal-600 transition-colors"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@anandavrinda.com"
                  className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
                >
                  info@anandavrinda.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+917042130170"
                  className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
                >
                  +91-7042130170
                </a>
                <p className="text-xs text-slate-500 mt-0.5">
                  (Timings: 9 a.m.- 6 p.m.)
                </p>
              </li>
              <li className="text-sm text-slate-700">
                Address: 938, 4th Floor, Ward 3, Gurgaon Village, Gurugram
                122001
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
          <p className="text-xs text-slate-500">
            Copyright &copy; {currentYear} | Powered by{" "}
            <a
              href="https://anandavrinda.com"
              className="hover:text-teal-600 transition-colors"
            >
              anandavrinda.com
            </a>
          </p>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/917042130170"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe57] transition-colors"
      >
        <WhatsappIcon className="w-8 h-8" />
      </a>
    </footer>
  );
}
