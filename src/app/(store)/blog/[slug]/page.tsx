import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getAllBlogSlugs, getBlogPosts } from "@/lib/data/repository";

export const revalidate = 300; // ISR — refresh posts every 5 min
import { ProductMedia } from "@/components/ui/ProductMedia";
import { Badge } from "@/components/ui/Badge";
import { Markdown } from "@/components/blog/Markdown";
import { Newsletter } from "@/components/home/Newsletter";
import { SITE } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getAllBlogSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    alternates: { canonical: `${SITE.url}/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const more = (await getBlogPosts()).filter((p) => p.slug !== slug).slice(0, 2);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-lav-700">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/blog" className="hover:text-lav-700">Journal</Link>
      </nav>

      <div className="mb-3 flex gap-1.5">{post.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div>
      <h1 className="text-3xl font-bold text-lav-900 sm:text-4xl">{post.title}</h1>
      <p className="mt-2 text-sm text-muted">By {post.author} · {fmt(post.date)} · {post.readMins} min read</p>

      <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-3xl shadow-soft">
        <ProductMedia url={post.cover} alt={post.title} sizes="(max-width:768px) 100vw, 768px" priority />
      </div>

      <Markdown content={post.body} />

      {more.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl font-bold text-lav-900">Keep reading ✿</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-3 rounded-2xl bg-white p-3 shadow-soft hover:shadow-float">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <ProductMedia url={p.cover} alt={p.title} sizes="80px" />
                </div>
                <div>
                  <h3 className="line-clamp-2 font-display text-sm font-bold text-lav-900 group-hover:text-lav-700">{p.title}</h3>
                  <p className="mt-1 text-xs text-muted">{p.readMins} min read</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10"><Newsletter /></div>
    </article>
  );
}
