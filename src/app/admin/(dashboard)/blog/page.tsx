import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getBlogPosts } from "@/lib/data/repository";

export default async function AdminBlog() {
  const posts = await getBlogPosts();
  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-lav-900">Blog</h1>
      <p className="mb-5 text-sm text-muted">{posts.length} posts</p>

      <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
        <table className="w-full text-sm">
          <thead className="border-b border-lav-150 text-left text-xs uppercase tracking-wide text-muted">
            <tr><th className="p-3">Title</th><th className="hidden p-3 sm:table-cell">Tags</th><th className="p-3">Date</th><th className="p-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-lav-100">
            {posts.map((p) => (
              <tr key={p.slug} className="hover:bg-lav-50">
                <td className="p-3 font-semibold text-lav-900">{p.title}</td>
                <td className="hidden p-3 text-lav-700 sm:table-cell">{p.tags.join(", ")}</td>
                <td className="p-3 text-muted">{new Date(p.date).toLocaleDateString("en-IN")}</td>
                <td className="p-3 text-right">
                  <Link href={`/blog/${p.slug}`} target="_blank" className="inline-grid h-8 w-8 place-items-center rounded-full text-lav-600 hover:bg-lav-100" aria-label="View"><ExternalLink className="h-4 w-4" /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-5 rounded-2xl bg-butter/50 px-4 py-3 text-sm text-[#8a6d1a]">
        💡 Posts live in <code className="rounded bg-white/60 px-1.5 py-0.5">src/data/blog.ts</code>. Connect the DB + a rich-text editor to author posts here.
      </p>
    </div>
  );
}
