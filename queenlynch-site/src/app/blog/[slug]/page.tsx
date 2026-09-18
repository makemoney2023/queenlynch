import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getPostBySlug, getPublishedPosts } from '@/lib/blog-data';
import { SITE_URL, GONE_BLOG_SLUGS } from '@/lib/constants';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedDate,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  
  if (GONE_BLOG_SLUGS.includes(slug)) {
    return (
      <>
        <Header />
        <main className="py-20 bg-gray-50 min-h-screen">
          <div className="container-custom max-w-3xl text-center">
            <h1 className="text-5xl font-bold mb-6">410 - Content Gone</h1>
            <p className="text-xl text-gray-600 mb-8">
              This blog post is no longer available and has been permanently removed.
            </p>
            <Link
              href="/blog"
              className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              View All Posts
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const post = getPostBySlug(slug);

  if (!post || post.status === 'gone') {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="py-20 bg-gray-50 min-h-screen">
        <article className="container-custom max-w-4xl">
          <Link
            href="/blog"
            className="text-emerald-700 hover:underline inline-flex items-center gap-2 mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {post.featuredImage && (
            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <time className="text-emerald-700 font-medium">
            {new Date(post.publishedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>

          <h1 className="text-5xl font-bold mt-4 mb-8 text-balance">{post.title}</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>
            
            <div className="bg-emerald-50 border-l-4 border-emerald-700 p-6 my-8">
              <p className="text-gray-700">
                For personalized health advice and recommendations, visit us at{' '}
                <strong>Queen Lynch Pharmacy</strong> in Brampton or call us at{' '}
                <a href="tel:9054503500" className="text-emerald-700 hover:underline">
                  (905) 450-3500
                </a>
                .
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
