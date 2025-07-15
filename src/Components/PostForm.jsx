// PostForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import service from "../Appwrite/appwriteConfiq";

export default function PostForm() {
  const user = useSelector((s) => s.auth.user);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const typeFromQuery = searchParams.get("type") || "article";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
    status: "public",
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const post = await service.getPost(id);
          setForm({
            title: post.Title,
            content: post.Content,
            status: post.Status,
            image: post["Content-Image"] || null,
          });
          if (post["Content-Image"]) {
            const imgURL = await service.getFile(post["Content-Image"]);
            setPreview(imgURL);
          }
        } catch (err) {
          console.error("Error loading post:", err);
        }
      })();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setForm((prev) => ({ ...prev, image: file }));
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageId = form.image;
      if (form.image instanceof File) {
        const uploaded = await service.fileUpload(form.image);
        imageId = uploaded.$id;
      }

      if (id) {
        await service.updatePost(id, {
          Title: form.title,
          Content: form.content,
          "Content-Image": imageId,
          Status: form.status,
          Type: typeFromQuery,
        });
      } else {
        await service.createPost({
          title: form.title,
          content: form.content,
          image: imageId,
          status: form.status,
          userId: user?.$id,
          slug: `${form.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
          type: typeFromQuery,
          Author: user?.name,
        });
      }

      navigate("/profile");
    } catch (err) {
      console.error("Post error:", err);
    } finally {
      setLoading(false);
    }
  };

  const heading = id
    ? `Edit ${typeFromQuery === "post" ? "Post" : "Article"}`
    : `Add a New ${typeFromQuery === "post" ? "Post" : "Article"}`;

  const buttonText = loading
    ? "Saving..."
    : id
    ? `Update ${typeFromQuery === "post" ? "Post" : "Article"}`
    : `Publish ${typeFromQuery === "post" ? "Post" : "Article"}`;

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl p-8 shadow border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6">{heading}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows="5"
              placeholder="Write your content here..."
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image (optional)</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 w-full cursor-pointer border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 w-full max-h-72 rounded shadow-sm border"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 w-full cursor-pointer px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-black cursor-pointer text-white py-2 rounded hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 ${
              loading ? "cursor-not-allowed bg-gray-400" : ""
            }`}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
