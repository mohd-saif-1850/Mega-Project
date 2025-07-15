import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import service from "../Appwrite/appwriteConfiq";

export default function PostCard() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetched = await service.getPost(postId);
        setPost(fetched);

        if (fetched["Content-Image"]) {
          const file = await service.getFile(fetched["Content-Image"]);
          setImageUrl(file?.href || file);
        }
      } catch (err) {
        console.error("Error loading post:", err.message);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
      }
    };

    fetchPost();
  }, [postId]);

  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${post.Title || "image"}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download image");
    }
  };

  if (loading) return <p className="text-center py-10">Loading…</p>;
  if (!post) return <p className="text-center py-10">Post not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Link to="/" className="text-blue-600 underline text-sm">&larr; Back to Home</Link>
        
      <h1 className="text-3xl font-bold">{post.Title}</h1>
      <p className="text-gray-600 text-sm">By: {post.Author || "Unknown"}</p>

      {imageUrl && (
        <div className="relative rounded-lg overflow-hidden mx-auto w-full max-w-xl">
          <img
            src={imageUrl}
            alt={post.Title}
            className="rounded-lg w-full h-auto max-h-[400px] object-contain"
          />
          <button
            onClick={downloadImage}
            className="absolute bottom-3 right-3 px-3 py-1 text-sm bg-blue-500 cursor-pointer bg-opacity-60 text-white rounded-md hover:bg-opacity-80 transition"
          >
             <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
  </svg>
          </button>
        </div>
      )}

      <div className="prose max-w-none text-lg leading-relaxed">
        {post.Content}
      </div>
    </div>
  );
}
