import kidsBouncHouse1 from "@/assets/kids-bounce-house-1.jpg";
import kidsSlide1 from "@/assets/kids-slide-1.jpg";
import toddlerBounce1 from "@/assets/toddler-bounce-1.jpg";
import waterSlideFun1 from "@/assets/water-slide-fun-1.jpg";
import slideTunnel1 from "@/assets/slide-tunnel-1.jpg";
import kidsGroupBounce1 from "@/assets/kids-group-bounce-1.jpg";
import girlsJumping1 from "@/assets/girls-jumping-1.jpg";
import kidsSmilingBounce1 from "@/assets/kids-smiling-bounce-1.jpg";
import waterSlideBoy1 from "@/assets/water-slide-boy-1.jpg";
import kidsGroupSlide1 from "@/assets/kids-group-slide-1.jpg";

// All available images for use throughout the site
export const siteImages = {
  kidsBouncHouse1,
  kidsSlide1,
  toddlerBounce1,
  waterSlideFun1,
  slideTunnel1,
  kidsGroupBounce1,
  girlsJumping1,
  kidsSmilingBounce1,
  waterSlideBoy1,
  kidsGroupSlide1,
};

// Image sets for different pages
export const homePageImages = [kidsGroupSlide1, waterSlideBoy1, kidsGroupBounce1];
export const cityServiceImages = [girlsJumping1, kidsSmilingBounce1, kidsSlide1];
export const deliveryPageImages = [kidsBouncHouse1, toddlerBounce1, slideTunnel1];

// Hero background images for city pages (rotating by index)
export const heroBackgrounds = [
  kidsGroupSlide1,
  waterSlideBoy1,
  girlsJumping1,
  kidsSmilingBounce1,
  kidsGroupBounce1,
  waterSlideFun1,
  kidsSlide1,
  slideTunnel1,
  toddlerBounce1,
  kidsBouncHouse1,
];

// Get a hero background based on city slug (for consistent assignment)
export function getHeroBackground(citySlug: string): string {
  const hash = citySlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return heroBackgrounds[hash % heroBackgrounds.length];
}

interface ContentImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ContentImage({ src, alt, className = "" }: ContentImageProps) {
  return (
    <div className={`my-8 rounded-xl overflow-hidden shadow-lg ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-64 md:h-80 object-cover object-center"
        loading="lazy"
      />
    </div>
  );
}

interface ContentImageRowProps {
  images: string[];
  alts: string[];
  className?: string;
}

export function ContentImageRow({ images, alts, className = "" }: ContentImageRowProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 my-12 ${className}`}>
      {images.map((src, index) => (
        <div key={index} className="rounded-xl overflow-hidden shadow-lg">
          <img
            src={src}
            alt={alts[index] || `Party rental fun ${index + 1}`}
            className="w-full h-48 md:h-56 object-cover object-center"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
