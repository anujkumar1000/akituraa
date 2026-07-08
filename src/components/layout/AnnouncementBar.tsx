const items = [
  "✨ Free shipping over ₹499",
  "💜 Handmade in small batches",
  "🦋 New drops every week",
  "🎁 10% off your first order",
  "🤙 Pan-India delivery",
];

export function AnnouncementBar() {
  // Duplicated track for a seamless CSS marquee.
  const track = [...items, ...items];
  return (
    <div className="overflow-hidden bg-lav-600 py-2 text-white">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap text-xs font-semibold">
        {track.map((t, i) => (
          <span key={i} className="px-2">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
