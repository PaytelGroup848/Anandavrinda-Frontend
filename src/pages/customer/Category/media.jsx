import { motion } from "framer-motion";
import { Newspaper, Sparkles, X, ZoomIn } from "lucide-react";
import { useState } from "react";

const MEDIA_ITEMS = [
  {
    id: 1,
    image: "/images/WhatsApp-Image-2026-08-01-at-1.12.25-PM-1-1024x589.jpeg",
    title: "Anandavrinda in Amar Ujala",
  },
  {
    id: 2,
    image: "/images/WhatsApp-Image-2026-08-01-at-1.12.25-PM-1-1024x589.jpeg",
    title: "Anandavrinda Journey",
  },
];

export default function Media() {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/20 to-white py-14 sm:py-20 lg:py-24">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-orange-700 ring-1 ring-orange-100">
            <Newspaper className="h-4 w-4" />
            Media Recognition
          </div>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            From our humble beginnings to making a mark in the world of
            fragrances, devotion and traditional products — Anandavrinda's
            journey continues to inspire.
          </p>
        </motion.div>

        {/* Media Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {MEDIA_ITEMS.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
              }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-lg shadow-gray-200/40 transition-all duration-300 hover:border-orange-100 hover:shadow-2xl hover:shadow-orange-100/40"
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>

              {/* Bottom Content */}
              <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    Anandavrinda Journey
                  </p>

                  <h3 className="mt-1 text-base font-black text-gray-950 sm:text-lg">
                    {item.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedImage(item.image)}
                  className="flex cursor-pointer h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition-all duration-300 hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                  aria-label={`View ${item.title}`}
                >
                  <ZoomIn className="h-5 w-5 transition-transform group-hover/icon:scale-110" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-3 text-center"
        >
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-orange-300" />

          <p className="text-xs font-semibold text-gray-400 sm:text-sm">
            A journey built with devotion, fragrance & tradition
          </p>

          <span className="h-px w-12 bg-gradient-to-l from-transparent to-orange-300" />
        </motion.div>
      </div>

      {/* Fullscreen Image Viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute cursor-pointer right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/50 text-white backdrop-blur-md transition hover:bg-white/70"
            aria-label="Close image"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image */}
          <motion.img
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={selectedImage}
            alt="Anandavrinda Media"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
