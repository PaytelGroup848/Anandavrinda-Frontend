import { lazy, Suspense, useCallback, memo, useEffect, useState } from "react";
import Hero from "./Hero";
import NewsLetter from "./NewsLetter";
import Features from "./Features";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { productService } from "../../services/product";
import { useNavigate } from "react-router-dom";
import { wishlistService } from "../../services/wishlist";
import { useAuth } from "../../context/AuthContext";
import ShopPopup from "../../components/Navbar/ShopPopup";
import categoryService from "../../services/category";
import Categories from "./Categories";
import { Sparkles } from "lucide-react";
import Media from "./Category/media";

const FeaturedProducts = lazy(
  () => import("./FeaturedProucts/FeaturedProducts"),
);

const SectionSkeleton = ({ height = "h-[360px]" }) => (
  <div
    className={`w-full ${height} animate-pulse rounded-[2rem] bg-gradient-to-br from-gray-100 via-teal-50 to-gray-100`}
  />
);

const CustomerPage = memo(() => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await productService.getAllProducts({ limit: 12 });
        const payload = response?.data || response || {};
        const nextProducts = payload?.products || payload?.data?.products || [];

        if (mounted)
          setProducts(Array.isArray(nextProducts) ? nextProducts : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (mounted) setError("Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const requireLogin = useCallback(
    (from = "/") => {
      if (isLoggedIn) return true;

      navigate("/login", { state: { from } });
      toast.error("Please login first");
      return false;
    },
    [isLoggedIn, navigate],
  );

  const handleAddToCart = useCallback(
    async (productId) => {
      if (!requireLogin("/")) return;

      try {
        await addToCart({ id: productId }, 1);
        window.dispatchEvent(new Event("cart-changed"));
        toast.success("Added to cart!");
      } catch (cartError) {
        const message =
          cartError?.response?.data?.message || "Failed to add to cart";
        toast.error(message);
      }
    },
    [addToCart, requireLogin],
  );

  const handleBuyNow = useCallback(
    async (productId) => {
      if (!requireLogin("/checkout")) return;

      try {
        await addToCart({ id: productId }, 1);
        window.dispatchEvent(new Event("cart-changed"));
        navigate("/checkout");
      } catch (cartError) {
        const message =
          cartError?.response?.data?.message || "Unable to start checkout";
        toast.error(message);
      }
    },
    [addToCart, navigate, requireLogin],
  );

  const handleWishlistToggle = useCallback(
    async (productId, isCurrentlyWishlisted = false) => {
      if (!requireLogin("/")) {
        return { success: false };
      }

      try {
        if (isCurrentlyWishlisted) {
          await wishlistService.removeFromWishlist(productId);
          window.dispatchEvent(new Event("wishlist-changed"));
          toast.success("Removed from wishlist");
          return { success: true, isWishlisted: false };
        }

        await wishlistService.addToWishlist(productId);
        window.dispatchEvent(new Event("wishlist-changed"));
        toast.success("Added to wishlist");
        return { success: true, isWishlisted: true };
      } catch (wishlistError) {
        const message =
          wishlistError?.response?.data?.message || "Wishlist update failed";
        toast.error(message);
        return { success: false };
      }
    },
    [requireLogin],
  );

  const hasError = error && products.length === 0;

  return (
    <div>
      <main className="min-h-screen overflow-hidden bg-white">
        <Hero />

        <Categories
          title="Shop by Category"
          subtitle="Explore our premium range of divine charcoal-free fragrances"
          limit={8}
          showAllButton={false}
          variant="compact"
        />

        <img
          src="/images/ChatGPT-Image-Jul-11-2026-05_29_50-PM-1024x546.png"
          alt="Anandavrinda"
          className="h-[500px] w-full"
        />

        <section className="relative bg-gradient-to-b from-[#fffaf2] to-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-[#008236] sm:text-4xl">
                  Featured Products
                </h2>

                <p className="mt-1 max-w-3xl text-sm font-semibold text-orange-600 sm:text-base">
                  Discover our handpicked collection of soulful fragrances,
                  sacred essentials and traditional favourites — thoughtfully
                  crafted to bring warmth, devotion and beautiful moments into
                  your everyday life.
                </p>
              </div>
            </div>

            {hasError ? (
              <div className="rounded-[2rem] border border-red-100 bg-red-50 p-10 text-center">
                <p className="font-black text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 rounded-full bg-[#7f1d1d] px-5 py-3 text-sm font-black text-white transition hover:bg-[#641515]"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <Suspense fallback={<SectionSkeleton height="h-[420px]" />}>
                <FeaturedProducts
                  products={products}
                  loading={loading}
                  error={error}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onWishlistToggle={handleWishlistToggle}
                />
              </Suspense>
            )}
          </div>
        </section>
        <Features />
        <Media />
        {/* <NewsLetter /> */}
      </main>
    </div>
  );
});

CustomerPage.displayName = "CustomerPage";

export default CustomerPage;
