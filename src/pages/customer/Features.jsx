import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Headphones,
  LockKeyhole,
  Medal,
  PackageCheck,
  RotateCcw,
  Truck,
  Sparkles,
  Heart,
} from "lucide-react";

const defaultFeaturesList = [
  {
    id: 1,
    title: "Free Shipping",
    description:
      "Enjoy free delivery on orders above ₹599 with reliable tracking and no hidden charges.",
    icon: Truck,
  },
  {
    id: 2,
    title: "Easy Returns",
    description:
      "Simple return support on eligible products with a smooth and hassle-free experience.",
    icon: RotateCcw,
  },
  {
    id: 3,
    title: "Secure Payments",
    description:
      "Shop with confidence through secure checkout and trusted payment gateways.",
    icon: LockKeyhole,
  },
  {
    id: 4,
    title: "Dedicated Support",
    description:
      "Our care team is always here to help you with orders, products and your shopping experience.",
    icon: Headphones,
  },
  {
    id: 5,
    title: "Premium Quality",
    description:
      "Carefully selected fragrances and devotional essentials made to bring purity and a beautiful experience.",
    icon: Medal,
  },
  {
    id: 6,
    title: "Fast Dispatch",
    description:
      "Your favourite fragrances and devotional essentials are packed carefully and dispatched promptly.",
    icon: PackageCheck,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Features({
  features = defaultFeaturesList,
  title = "Why Anandavrinda",
  subtitle = "More than a fragrance store — we bring together tradition, devotion and beautiful aromas to make every moment feel special.",
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.12,
  });

  const renderTitle = () =>
    title.split(" ").map((word, index) =>
      word === "Anandavrinda" ? (
        <span
          key={`${word}-${index}`}
          className="bg-gradient-to-r from-[#92400e] via-[#b45309] to-[#d97706] bg-clip-text text-transparent"
        >
          {word}{" "}
        </span>
      ) : (
        <span key={`${word}-${index}`}>{word} </span>
      ),
    );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#fffaf0] to-[#fff7e6] py-16 sm:py-20 lg:py-24">
      {/* Background decorative glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-yellow-100/40 blur-3xl" />

        {/* subtle devotional pattern */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #d6a756 1px, transparent 0)",
            backgroundSize: "34px 34px",
            maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-11 max-w-3xl text-center sm:mb-14"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-amber-800 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            The Anandavrinda Promise
          </span>

          {/* Heading */}
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#4a1d0b] sm:text-4xl lg:text-5xl">
            {renderTitle()}
          </h2>

          {/* Decorative divider */}
          <div className="mx-auto mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />

            <Sparkles className="h-4 w-4 text-amber-600" />

            <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
          </div>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#795548] sm:text-base lg:text-lg">
            {subtitle}
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                whileHover={{
                  y: -7,
                  transition: { duration: 0.2 },
                }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-amber-100 bg-white/90 p-6 shadow-[0_10px_35px_rgba(120,53,15,0.07)] backdrop-blur-sm transition-all duration-300 hover:border-amber-200 hover:bg-white hover:shadow-[0_20px_50px_rgba(120,53,15,0.13)]"
              >
                {/* Top decorative line */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Soft glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-100/40 blur-2xl transition-all duration-500 group-hover:bg-amber-200/50" />

                {/* Icon */}
                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-amber-200 group-hover:from-amber-600 group-hover:to-orange-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-200/50">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="relative text-lg font-black text-[#4a1d0b] transition-colors group-hover:text-amber-700">
                  {feature.title}
                </h3>

                <p className="relative mt-2 text-sm leading-6 text-[#795548]">
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div className="mt-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <Heart className="h-3.5 w-3.5 fill-current" />
                  Crafted with care
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
