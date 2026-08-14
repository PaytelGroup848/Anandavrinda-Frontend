import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CloseIcon } from "../Icons/Icons";

// Default categories (only used if no prop passed)
const defaultCategories = [
  {
    id: 1,
    title: "Backflow Cones",
    image: "/images/backflow-incense-cone-500x500-1-300x300.webp",
    link: "/category/backflow-cones",
    color: "from-sky-400 to-blue-500",
  },
  {
    id: 2,
    title: "Chandan Tika",
    image: "/images/oip-300x180.jpg",
    link: "/category/chandan-tika",
    color: "from-slate-500 to-slate-700",
  },
  {
    id: 3,
    title: "Corporate Gifting",
    image: "/images/2147720593-300x300.jpg",
    link: "/category/gifts",
    color: "from-teal-400 to-teal-600",
  },
  {
    id: 4,
    title: "Dhoop Cones & Sticks",
    image: "/images/incense-loban-dhoop-cone-1650616953-6302472-300x300.jpeg",
    link: "/category/dhoop-cones-and-dhoop-stick",
    color: "from-rose-400 to-pink-500",
  },
  {
    id: 5,
    title: "Havan Cups",
    image: "/images/hc1-300x300.webp",
    link: "/category/havan-cups",
    color: "from-rose-400 to-pink-500",
  },
];

// Skeleton loader for categories
const CategorySkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="w-full aspect-square bg-gray-200 rounded-2xl" />
        <div className="mt-3 h-4 bg-gray-200 rounded w-3/4 mx-auto" />
      </div>
    ))}
  </div>
);

export default function ShopPopup({
  isOpen,
  onClose,
  onCategorySelect,
  categories = null,
  loading = false,
}) {
  const [imageErrors, setImageErrors] = useState({});
  

  // Use provided categories or fallback to default
  const displayCategories = categories?.length ? categories : defaultCategories;

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleImageError = (categoryId) => {
    setImageErrors((prev) => ({ ...prev, [categoryId]: true }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => {
          onCategorySelect?.(cat);
          onClose();
        }}
      />

      {/* Popup container */}
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Shop by <span className="text-teal-600">Category</span>
          </h2>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Loading state */}
        {loading ? (
          <CategorySkeleton />
        ) : (
          <>
            {/* Category grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {displayCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.link}
                  onClick={() => {
                    onCategorySelect?.(cat);
                    onClose();
                  }}
                  className="group relative flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 group-hover:ring-2 group-hover:ring-teal-400 transition-all duration-300">
                    {!imageErrors[cat.id] ? (
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => handleImageError(cat.id)}
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${cat.color || "from-gray-400 to-gray-600"} flex items-center justify-center`}
                      >
                        <span className="text-white text-lg font-bold">
                          {cat.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="mt-3 text-sm font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
                    {cat.title}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Animation keyframes (add to global CSS if missing) */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
