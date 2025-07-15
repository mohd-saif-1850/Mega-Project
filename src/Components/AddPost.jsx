import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";
import { useSelector } from "react-redux";
import service from "../Appwrite/appwriteConfiq";

export default function AddPost() {
  const { register, handleSubmit, watch } = useForm();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  const watchImage = watch("image");

  useEffect(() => {
    if (watchImage && watchImage[0]) {
      const file = watchImage[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [watchImage]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");

    try {
      let fileId = null;

      if (data.image && data.image[0]) {
        const uploaded = await service.fileUpload(data.image[0]);
        fileId = uploaded.$id;
      }

      const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${ID.unique()}`;

      await service.createPost({
        title: data.title.trim(),
        content: data.content.trim(),
        image: fileId,
        status: data.status,
        userId: user.$id,
        slug,
        type: "post",
        Author: user.name,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate("/profile");
    } catch (e) {
      setError(e?.message || "Something went wrong while creating the post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded shadow border">
        <h2 className="text-2xl font-bold text-center mb-6">Add a New Post</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            {...register("title", { required: true })}
            placeholder="Title"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />

          <textarea
            {...register("content", { required: true })}
            placeholder="Content"
            rows="5"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full border rounded cursor-pointer p-1"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-60 object-cover rounded mt-2"
            />
          )}

          <select
            {...register("status")}
            className="w-full cursor-pointer p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded cursor-pointer text-white ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-900"
            }`}
          >
            {isSubmitting ? "Posting…" : "Add Post"}
          </button>

          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
