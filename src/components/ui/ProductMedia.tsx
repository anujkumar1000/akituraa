import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heart, Star, Butterfly, Cloud, Sparkle, Smiley } from "@/components/decorations/Kawaii";

// Renders a real image when given a URL, or an on-brand kawaii
// gradient placeholder when the url uses the "placeholder:<key>"
// scheme. Lets the whole site look finished before real photos
// exist — and degrades gracefully if an image is missing.

const GRADIENTS = [
  "from-lav-200 via-lav-300 to-blush",
  "from-blush via-lav-200 to-lav-300",
  "from-sky via-lav-200 to-lav-300",
  "from-mint via-lav-100 to-lav-300",
  "from-butter via-lav-150 to-lav-300",
  "from-lav-300 via-blush to-lav-200",
];

const ICONS = [Heart, Star, Butterfly, Cloud, Sparkle, Smiley];

function hashKey(key: string) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

export function ProductMedia({
  url,
  alt,
  className,
  sizes,
  priority,
}: {
  url: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const isPlaceholder = url.startsWith("placeholder:");

  if (!isPlaceholder) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  const key = url.slice("placeholder:".length);
  const h = hashKey(key);
  const gradient = GRADIENTS[h % GRADIENTS.length];
  // NOTE: use the UNSIGNED shift (>>>). hashKey returns a uint32 that
  // can exceed 2^31; the signed >> would make this negative and yield
  // ICONS[-n] === undefined (a crashing element type).
  const Icon = ICONS[(h >>> 3) % ICONS.length];

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br",
        gradient,
        className
      )}
      role="img"
      aria-label={alt}
    >
      <Icon className="h-1/3 w-1/3 text-white/80 drop-shadow-sm" />
    </div>
  );
}
