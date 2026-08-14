import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Product images for rotation (add your actual paths)
const productImages = [
  {
    src: "/images/where-festivity-meets-pure-fragrance-2.png",
    alt: "Festival Fragrance",
    category: "Festival Fragrance",
  },
  {
    src: "/images/where-festivity-meets-pure-fragrance-3.png",
    alt: "Pure Fragrance",
    category: "Pure Fragrance",
  },
  // {
  //   src: "/images/diaper.png",
  //   alt: "Hand Sanitiser",
  //   category: "Hygiene",
  // },
  // {
  //   src: "/images/BABY diAPER.webp",
  //   alt: "Kids Scooter",
  //   category: "Mobility",
  // },
  // {
  //   src: "/images/diaper 1.png",
  //   alt: "Cleaning Wipes",
  //   category: "Essentials",
  // },
];

export default function HeroDesktop() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % productImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovering]);

  const currentImage = productImages[currentIndex];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex justify-center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative w-full ">
            {/* Image container with smooth crossfade */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.95, rotateY: -90 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="relative"
                >
                  <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    className="w-full h-auto object-contain  drop-shadow-lg"
                  />
                  {/* Overlay category tag */}
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                    {currentImage.category}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dot indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {productImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "w-8 bg-teal-600"
                        : "w-2 bg-gray-300 hover:bg-teal-400"
                    }`}
                    aria-label={`View product ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced decorative wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-12 sm:h-16 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>

      {/* Tailwind animation keyframes for blobs (add to your global CSS if needed) */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 12s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
