export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-lav-200 border-t-lav-600"></div>
    </div>
  );
}