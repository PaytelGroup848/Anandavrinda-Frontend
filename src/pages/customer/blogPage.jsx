import { useEffect } from "react";
import {
  Flame,
  Sparkles,
  Gift,
  Wind,
  Leaf,
  Heart,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  Star,
  Flower2,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";

const FONT_LINK_ID = "anandavrinda-blog-fonts";

function useBlogFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;

    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700;800&display=swap";

    document.head.appendChild(link);
  }, []);
}

/* =========================================================
   CATEGORY / PRODUCT CONTENT
========================================================= */

const CATEGORIES = [
  {
    id: "agarbatti",
    icon: Wind,
    tag: "Everyday Fragrance",
    title: "Agarbatti",
    description:
      "Premium incense sticks crafted to fill your home with soothing fragrances and create a peaceful everyday atmosphere.",
    image: "/images/agarbatti.jpg",
    fallbackImage: "/images/backflow-incense-cone-500x500-1-300x300.webp",
    points: [
      "Long-lasting fragrance",
      "Rich and soothing aromas",
      "Perfect for everyday use",
    ],
  },
  {
    id: "dhoop",
    icon: Flame,
    tag: "Pure Fragrance",
    title: "Dhoop Cones & Sticks",
    description:
      "Traditional dhoop cones and sticks made for puja, meditation and creating a beautifully fragrant spiritual space.",
    image: "/images/dhoop.jpg",
    fallbackImage:
      "/images/incense-loban-dhoop-cone-1650616953-6302472-300x300.jpeg",
    points: [
      "Deep traditional fragrance",
      "Ideal for puja & meditation",
      "Easy and convenient to use",
    ],
  },
  {
    id: "fragrance",
    icon: Sparkles,
    tag: "Premium Collection",
    title: "Fragrances",
    description:
      "Discover beautiful fragrances designed to transform everyday spaces into calm, refreshing and welcoming environments.",
    image: "/images/fragrance.jpg",
    fallbackImage: "/images/backflow-incense-cone-500x500-1-300x300.webp",
    points: [
      "Refreshing fragrance profiles",
      "Perfect for home & gifting",
      "Premium aromatic experience",
    ],
  },
  {
    id: "havan",
    icon: Leaf,
    tag: "Traditional Essentials",
    title: "Havan Cups",
    description:
      "Convenient Havan essentials designed to make traditional rituals simple, meaningful and easy to perform.",
    image: "/images/havan-cups.jpg",
    fallbackImage: "/images/hc1-300x300.webp",
    points: [
      "Easy to use",
      "Traditional ingredients",
      "Perfect for puja & havan",
    ],
  },
  {
    id: "chandan",
    icon: Flower2,
    tag: "Spiritual Essentials",
    title: "Chandan Tika",
    description:
      "Traditional Chandan Tika products made for puja, festive occasions and everyday spiritual rituals.",
    image: "/images/chandan-tika.jpg",
    fallbackImage: "/images/oip-300x180.jpg",
    points: [
      "Traditional sandalwood experience",
      "Ideal for puja & festivals",
      "Perfect for personal use",
    ],
  },
  {
    id: "gifting",
    icon: Gift,
    tag: "Special Occasions",
    title: "Corporate Gifting",
    description:
      "Thoughtfully curated gifting options for clients, employees, business partners and festive celebrations.",
    image: "/images/corporate-gifting.jpg",
    fallbackImage: "/images/2147720593-300x300.jpg",
    points: [
      "Elegant gifting options",
      "Perfect for festive occasions",
      "Suitable for corporate events",
    ],
  },
];

/* =========================================================
   FESTIVE COLLECTION
========================================================= */

const FESTIVE_ITEMS = [
  {
    title: "Rakhi Collection",
    description:
      "Celebrate the beautiful bond of love with thoughtfully designed Rakhi collections.",
    image: "/images/rakhi.jpg",
    icon: Star,
  },
  {
    title: "Puja Essentials",
    description:
      "Everything you need to make your traditional rituals more meaningful.",
    image: "/images/puja-essentials.jpg",
    icon: Flower2,
  },
  {
    title: "Festive Gifting",
    description:
      "Make every celebration memorable with elegant and meaningful gifts.",
    image: "/images/festive-gifting.jpg",
    icon: Gift,
  },
];

/* =========================================================
   VALUES
========================================================= */

const VALUES = [
  {
    icon: Leaf,
    title: "Tradition at heart",
    text: "Our products are inspired by India's rich traditions of fragrance, पूजा and festive celebrations.",
  },
  {
    icon: ShieldCheck,
    title: "Quality you can trust",
    text: "We focus on consistent quality so every fragrance and festive essential delivers a dependable experience.",
  },
  {
    icon: Heart,
    title: "Made for meaningful moments",
    text: "From daily पूजा to festivals and gifting, our products are created to become part of special moments.",
  },
];

/* =========================================================
   STATS
========================================================= */

const STATS = [
  {
    icon: Sparkles,
    value: "Premium",
    label: "Fragrance collections",
  },
  {
    icon: Flower2,
    value: "Traditional",
    label: "Indian essentials",
  },
  {
    icon: Gift,
    value: "Festive",
    label: "Gifting collections",
  },
];

/* =========================================================
   IMAGE COMPONENT
========================================================= */

function ProductImage({ src, fallback, alt, className = "" }) {
  const handleError = (event) => {
    if (fallback && event.currentTarget.src !== fallback) {
      event.currentTarget.src = fallback;
    } else {
      event.currentTarget.style.display = "none";
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function QubanHCBlogPage() {
  useBlogFonts();

  return (
    <div
      className="min-h-screen bg-[#fffdf8] text-[#17130f]"
      style={{
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#fffaf0]">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-orange-200/40 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-amber-100/60 blur-3xl" />

        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #d6b36a 1px, transparent 0)",
            backgroundSize: "30px 30px",
            maskImage: "linear-gradient(to bottom, black, transparent 80%)",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          {/* Left */}

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-orange-700">
              <Sparkles size={14} />
              Fragrance • Tradition • Celebration
            </div>

            <h1
              className="mt-6 text-[40px] font-extrabold leading-[1.08] tracking-tight text-[#21170e] sm:text-[48px] lg:text-[58px]"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Bring home the
              <span className="block bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                fragrance of tradition.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-7 text-stone-600 sm:text-base">
              Discover premium agarbatti, dhoop, fragrances, Havan essentials,
              Chandan Tika and festive gifting collections designed to bring
              warmth, devotion and beautiful moments into everyday life.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#collections"
                className="inline-flex items-center gap-2 rounded-full bg-[#25170d] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#3a2415]"
              >
                Explore Collections
                <ArrowRight size={16} />
              </a>

              <a
                href="#story"
                className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-6 py-3.5 text-sm font-bold text-[#25170d] transition hover:border-orange-300"
              >
                Our Story
              </a>
            </div>

            {/* Stats */}

            <div className="mt-12 grid grid-cols-3 gap-5 border-t border-orange-100 pt-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center gap-1.5 text-orange-600">
                    <stat.icon size={16} />
                  </div>

                  <p
                    className="mt-2 text-lg font-extrabold tracking-tight text-[#25170d] sm:text-xl"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {stat.value}
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-stone-500 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Collage */}

          <div className="relative mx-auto w-full max-w-xl">
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.slice(0, 4).map((item, index) => (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-[28px] shadow-lg ${
                    index % 2 === 1 ? "translate-y-7" : ""
                  }`}
                >
                  <div className="aspect-square">
                    <ProductImage
                      src={item.image}
                      fallback={item.fallbackImage}
                      alt={item.title}
                      className="transition duration-700 hover:scale-110"
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-12">
                    <p className="text-sm font-bold text-white">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating badge */}

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl border border-orange-100 bg-white px-5 py-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 text-orange-700">
                  <Flame size={17} />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Crafted for
                  </p>

                  <p className="text-sm font-extrabold text-[#25170d]">
                    Fragrance & Tradition
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STORY
      ===================================================== */}

      <section id="story" className="mx-auto max-w-4xl px-5 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-600">
            From the Anandavrinda Journal
          </p>

          <h2
            className="mt-4 text-[30px] font-extrabold leading-tight tracking-tight text-[#25170d] sm:text-[38px]"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            More than fragrance,
            <span className="text-orange-700"> it's a feeling.</span>
          </h2>

          <div className="mx-auto mt-7 max-w-3xl space-y-5 text-[15px] leading-8 text-stone-600">
            <p>
              Fragrance has always been an important part of Indian homes,
              traditions and celebrations. From the first stick of agarbatti in
              the morning to the fragrance of dhoop during पूजा, these simple
              rituals create moments of peace and connection.
            </p>

            <p>
              At Anandavrinda, we bring together traditional fragrance
              essentials and festive products that fit naturally into modern
              life. Our collection includes agarbatti, dhoop, fragrances, Havan
              essentials, Chandan Tika and thoughtful gifting options.
            </p>

            <p>
              Whether you are preparing your home for a festival, creating a
              peaceful पूजा space or looking for a meaningful gift, we believe
              every product should add something beautiful to the moment.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="border-y border-orange-100 bg-[#fff9ef]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              What we believe
            </p>

            <h2
              className="mt-3 text-3xl font-extrabold text-[#25170d] sm:text-4xl"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Rooted in tradition. Made for today.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="group rounded-3xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-700 transition group-hover:bg-orange-100">
                  <value.icon size={21} />
                </div>

                <h3
                  className="mt-5 text-lg font-bold text-[#25170d]"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {value.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          COLLECTIONS
      ===================================================== */}

      <section
        id="collections"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
            Our Collections
          </p>

          <h2
            className="mt-3 text-3xl font-extrabold tracking-tight text-[#25170d] sm:text-4xl"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Fragrance, rituals & celebrations.
          </h2>

          <p className="mt-4 text-sm leading-7 text-stone-500 sm:text-base">
            Explore our carefully selected range of products created for
            everyday fragrance, traditional rituals, festive occasions and
            meaningful gifting.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Image */}

              <div className="relative aspect-[4/3] overflow-hidden bg-orange-50">
                <ProductImage
                  src={item.image}
                  fallback={item.fallbackImage}
                  alt={item.title}
                  className="transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-700 shadow-sm">
                  {item.tag}
                </span>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <h3
                    className="text-xl font-bold text-white"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {item.title}
                  </h3>

                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-orange-700 shadow-lg">
                    <item.icon size={18} />
                  </div>
                </div>
              </div>

              {/* Content */}

              <div className="p-6">
                <p className="text-sm leading-6 text-stone-500">
                  {item.description}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2 text-[13px] font-medium text-stone-600"
                    >
                      <CheckCircle2
                        size={15}
                        className="shrink-0 text-orange-600"
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#25170d] transition-all group-hover:gap-3"
                >
                  Explore collection
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================
          FESTIVE SECTION
      ===================================================== */}

      <section className="bg-[#25170d]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
                Celebrate beautifully
              </p>

              <h2
                className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl"
                style={{
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Festivals are made of
                <span className="text-orange-300"> little traditions.</span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-stone-300">
                From Rakhi and festive gifting to puja essentials, discover
                products that help you celebrate India's beautiful traditions
                with family, friends and loved ones.
              </p>

              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-orange-200">
                <Sparkles size={14} />
                Made for special occasions
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {FESTIVE_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                >
                  <div className="aspect-square overflow-hidden bg-orange-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/15 text-orange-300">
                      <item.icon size={17} />
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-stone-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          JOURNAL / ARTICLES
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Anandavrinda Journal
            </p>

            <h2
              className="mt-3 text-3xl font-extrabold text-[#25170d] sm:text-4xl"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Stories, rituals & fragrance.
            </h2>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-stone-500">
            <Clock size={16} />
            Discover something new
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/images/agarbatti.jpg"
                alt="Agarbatti"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.src =
                    "/images/backflow-incense-cone-500x500-1-300x300.webp";
                }}
              />
            </div>

            <div className="p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                Fragrance
              </p>

              <h3
                className="mt-2 text-xl font-bold text-[#25170d]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Why agarbatti is an essential part of Indian homes
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-500">
                Explore the timeless connection between fragrance, peace and
                everyday rituals.
              </p>

              <button className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#25170d]">
                Read article
                <ArrowRight size={15} />
              </button>
            </div>
          </article>

          <article className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/images/dhoop.jpg"
                alt="Dhoop"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.src =
                    "/images/incense-loban-dhoop-cone-1650616953-6302472-300x300.jpeg";
                }}
              />
            </div>

            <div className="p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                Tradition
              </p>

              <h3
                className="mt-2 text-xl font-bold text-[#25170d]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Dhoop vs agarbatti: understanding the difference
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-500">
                A simple guide to choosing the right fragrance for your home and
                rituals.
              </p>

              <button className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#25170d]">
                Read article
                <ArrowRight size={15} />
              </button>
            </div>
          </article>

          <article className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/images/festive-gifting.jpg"
                alt="Festive gifting"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.src = "/images/2147720593-300x300.jpg";
                }}
              />
            </div>

            <div className="p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                Gifting
              </p>

              <h3
                className="mt-2 text-xl font-bold text-[#25170d]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Thoughtful gifting for every celebration
              </h3>

              <p className="mt-3 text-sm leading-6 text-stone-500">
                Ideas to make festivals, corporate events and special occasions
                more memorable.
              </p>

              <button className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#25170d]">
                Read article
                <ArrowRight size={15} />
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#3a210f] via-[#5a2f12] to-[#21140b] px-7 py-14 text-center sm:px-10 md:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange-400/15 text-orange-300">
              <Sparkles size={22} />
            </div>

            <h2
              className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Fragrance that makes every moment special.
            </h2>

            <p className="relative mx-auto mt-4 max-w-2xl text-sm leading-7 text-orange-100/70 sm:text-base">
              Explore Anandavrinda's collection of agarbatti, dhoop, fragrances,
              traditional essentials and festive gifting products.
            </p>

            <a
              href="/"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#3a210f] transition hover:bg-orange-50"
            >
              Explore Our Collection
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
