import { TruckIcon } from "../Icons/Icons";

export default function TopBar() {
  return (
    <div className="bg-teal-900 text-white text-xs sm:text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-x-8 gap-y-1 font-medium">
        <span className="flex items-center gap-1.5">
          <TruckIcon /> Free shipping on orders above ₹599
        </span>
        <span className="hidden sm:flex items-center gap-1.5">
          +91-7042130170
        </span>
        <span className="hidden sm:flex items-center gap-1.5">
          Fragrance Blessed by Devotion
        </span>
      </div>
    </div>
  );
}
