import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getPublishedPosts } from '@/lib/blog-data';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Blog Posts',
  description: 'Latest health and wellness articles from Queen Lynch Pharmacy',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default function BlogPage() {
  const posts = getPublishedPosts();

  return (
    <>
      <Header />
      <main className="py-20 bg-gray-50 min-h-screen">
        <div className="container-custom">
          <h1 className="text-5xl font-bold text-center mb-12">Latest Articles</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
              >
                {post.featuredImage && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <time className="text-sm text-emerald-700 font-medium">
                    {new Date(post.publishedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h2 className="text-2xl font-bold mt-2 mb-3 group-hover:text-emerald-700 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
