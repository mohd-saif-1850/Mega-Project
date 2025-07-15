import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import service from "../Appwrite/appwriteConfiq";

const IMAGE_FIELD = "Content-Image";

export default function Home() {
  const user = useSelector((s) => s.auth.user);
  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visiblePosts, setVisiblePosts] = useState(3);
  const [visibleArticles, setVisibleArticles] = useState(3);

  useEffect(() => {
    (async () => {
      try {
        const { documents } = await service.allPosts();
        const withImages = await Promise.all(
          documents.map(async (doc) => {
            const fileId = doc[IMAGE_FIELD];
            const file = fileId ? await service.getFile(fileId) : null;
            const imageUrl = file?.href || (file?.href === undefined ? file : null);
            return { ...doc, imageUrl };
          })
        );

        const allPosts = withImages.filter((d) => d.Type === "post" || d.Type == null);
        const allArticles = withImages.filter((d) => d.Type === "article");

        setPosts(allPosts);
        setArticles(allArticles);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center py-10">Loading…</p>;

  return (
    <div className="min-h-screen px-4 py-10 bg-white max-w-5xl mx-auto space-y-16">
      {/* POSTS */}
      <section>
        <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {posts.slice(0, visiblePosts).map((p) => (
            <Link
              to={`/post/${p.$id}`}
              key={p.$id}
              className="border rounded-lg shadow-sm hover:shadow-md transition block"
            >
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.Title}
                  className="w-full h-48 object-cover rounded-t"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{p.Title}</h2>
                <p className="text-gray-700 line-clamp-3 mb-2">{p.Content}</p>
                <p className="text-sm text-gray-500">By: {p.Author || "Unknown"}</p>
              </div>
            </Link>
          ))}
        </div>

        {visiblePosts < posts.length && (
          <div className="text-center">
            <button
              onClick={() => setVisiblePosts((prev) => prev + 3)}
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded"
            >
              Show More Posts
            </button>
          </div>
        )}
      </section>

      {/* ARTICLES */}
      <section>
        <h1 className="text-3xl font-bold mb-6">Articles</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {articles.slice(0, visibleArticles).map((a) => (
            <Link
              to={`/post/${a.$id}`}
              key={a.$id}
              className="border rounded-lg shadow-sm hover:shadow-md transition block"
            >
              {a.imageUrl ? (
                <img
                  src={a.imageUrl}
                  alt={a.Title}
                  className="w-full h-48 object-cover rounded-t"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{a.Title}</h2>
                <p className="text-gray-700 line-clamp-3 mb-2">{a.Content}</p>
                <p className="text-sm text-gray-500">By: {a.Author || "Unknown"}</p>
              </div>
            </Link>
          ))}
        </div>

        {visibleArticles < articles.length && (
          <div className="text-center">
            <button
              onClick={() => setVisibleArticles((prev) => prev + 3)}
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded"
            >
              Show More Articles
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
