import waterSlideFun1 from "@/assets/lifestyle/water-slide-fun-1.jpg";
import bounceHouseNet1 from "@/assets/lifestyle/bounce-house-net-1.jpg";
import kidsGroup1 from "@/assets/lifestyle/kids-group-1.jpg";
import slideFun1 from "@/assets/lifestyle/slide-fun-1.jpg";
import kidsFriends1 from "@/assets/lifestyle/kids-friends-1.jpg";
import bounceJumping1 from "@/assets/lifestyle/bounce-jumping-1.jpg";
import netGirl1 from "@/assets/lifestyle/net-girl-1.jpg";
import boySlide1 from "@/assets/lifestyle/boy-slide-1.jpg";
import boyBounce1 from "@/assets/lifestyle/boy-bounce-1.jpg";

// All lifestyle images for reuse across pages
export const lifestyleImages = {
  waterSlideFun1,
  bounceHouseNet1,
  kidsGroup1,
  slideFun1,
  kidsFriends1,
  bounceJumping1,
  netGirl1,
  boySlide1,
  boyBounce1,
};

// Image groups for different pages - 3 per page
export const imageGroups = {
  home: [
    { src: waterSlideFun1, alt: "Happy child enjoying water slide at Orlando party" },
    { src: kidsFriends1, alt: "Group of kids having fun in bounce house at Orlando event" },
    { src: bounceJumping1, alt: "Kids jumping in colorful bounce house rental" },
  ],
  bounceHouse: [
    { src: bounceHouseNet1, alt: "Child playing in bounce house with safety netting" },
    { src: slideFun1, alt: "Girl laughing while enjoying inflatable slide" },
    { src: boyBounce1, alt: "Kids having fun at bounce house party in Orlando" },
  ],
  waterSlide: [
    { src: waterSlideFun1, alt: "Child splashing on water slide rental in Orlando" },
    { src: boySlide1, alt: "Boy sliding down inflatable water slide at party" },
    { src: kidsGroup1, alt: "Happy kids at water slide birthday party" },
  ],
  cityService: [
    { src: netGirl1, alt: "Girl enjoying bounce house rental in Orlando area" },
    { src: kidsFriends1, alt: "Children having fun at local Orlando party" },
    { src: boyBounce1, alt: "Kids playing at East Orlando inflatable rental event" },
  ],
  events: [
    { src: bounceJumping1, alt: "Kids jumping at birthday party event" },
    { src: kidsGroup1, alt: "Group of friends at Orlando celebration" },
    { src: slideFun1, alt: "Child enjoying party rental entertainment" },
  ],
  obstacleSlide: [
    { src: boySlide1, alt: "Boy on inflatable obstacle slide rental" },
    { src: bounceHouseNet1, alt: "Child navigating bounce house obstacle" },
    { src: bounceJumping1, alt: "Kids racing through inflatable obstacle course" },
  ],
};

interface LifestyleImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function LifestyleImage({ src, alt, className = "" }: LifestyleImageProps) {
  return (
    <div className={`w-full overflow-hidden rounded-2xl shadow-lg ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-contain"
        loading="lazy"
      />
    </div>
  );
}

interface LifestyleImageStripProps {
  images: { src: string; alt: string }[];
  className?: string;
}

export function LifestyleImageStrip({ images, className = "" }: LifestyleImageStripProps) {
  return (
    <section className={`section-padding ${className}`}>
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {images.map((image, index) => (
            <LifestyleImage
              key={index}
              src={image.src}
              alt={image.alt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Single image component for inline use
interface SingleLifestyleImageProps {
  src: string;
  alt: string;
  position?: "left" | "right" | "center";
  className?: string;
}

export function SingleLifestyleImage({ src, alt, position = "center", className = "" }: SingleLifestyleImageProps) {
  const positionClass = {
    left: "mr-auto",
    right: "ml-auto", 
    center: "mx-auto",
  }[position];

  return (
    <div className={`w-full max-w-2xl ${positionClass} ${className}`}>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </div>
    </div>
  );
}
