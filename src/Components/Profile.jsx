import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../Store-Redux/authSlice";
import authService from "../Appwrite/auth";
import service from "../Appwrite/appwriteConfiq";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const nameFromRedux = user?.name;

  const [name, setName] = useState(nameFromRedux || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setName(nameFromRedux || "");
  }, [nameFromRedux]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const fileId = user.prefs?.avatarId;
        if (fileId) {
          const file = await service.getFile(fileId);
          setAvatarPreview(file.href || file);
        }
      } catch {
        setAvatarPreview("");
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!user) return setLoading(false);
    (async () => {
      try {
        const { documents } = await service.allUserPosts(user.$id);
        const withImages = await Promise.all(
          documents.map(async (p) => {
            const fileId = p["Content-Image"];
            const file = fileId ? await service.getFile(fileId) : null;
            return { ...p, imageUrl: file?.href || file };
          })
        );
        setPosts(withImages.filter((d) => d.Type === "post" || !d.Type));
        setArticles(withImages.filter((d) => d.Type === "article"));
      } catch (err) {
        console.error("Error loading your posts:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let avatarId = user.prefs?.avatarId;
      if (avatarFile) {
        const uploaded = await service.fileUpload(avatarFile);
        avatarId = uploaded.$id;
        await authService.updatePrefs({ avatarId });
      }
      if (name && name !== user.name) {
        await authService.updateName(name);
      }
      const { documents } = await service.allUserPosts(user.$id);
      const myDocs = documents.filter((d) => d.UserID === user.$id);
      await Promise.all(
        myDocs.map((doc) =>
          service.updatePost(doc.$id, { Author: name })
        )
      );
      const updatedUser = await authService.getUser();
      dispatch(setUser(updatedUser));
      setSaved(true);
      setEditing(false);
    } catch (err) {
      console.error("Profile save error:", err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDelete = async (item) => {
    setDeletingId(item.$id);
    try {
      await service.deletePost(item.$id);
      if (item["Content-Image"]) {
        await service.deleteFile(item["Content-Image"]);
      }
      setPosts((prev) => prev.filter((p) => p.$id !== item.$id));
      setArticles((prev) => prev.filter((a) => a.$id !== item.$id));
    } catch {
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-center py-10">Loading…</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      
      {!editing ? (
        <div className="flex items-center gap-6 mb-6">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full" />
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {nameFromRedux}{" "}
              {saved && <span className="text-green-500">✔</span>}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="ml-auto cursor-pointer px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={saveProfile} className="space-y-4 mb-6">
          <div className="flex items-center gap-6">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full" />
            )}
            <div className="flex-1 space-y-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
              <input type="file" accept="image/*" onChange={handleAvatar} />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className={`px-4 cursor-pointer py-2 text-white rounded ${
                saving ? "bg-gray-400" : "bg-black"
              }`}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setName(nameFromRedux || "");
                setAvatarFile(null);
              }}
              className="px-4 cursor-pointer py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Your Posts */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600">
            No posts.{" "}
            <Link to="/add-post?type=post" className="text-blue-600 underline">
              Create one →
            </Link>
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <div
                key={p.$id}
                
                className="border rounded shadow hover:shadow-lg transition"
              >
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    onClick={() => navigate(`/post/${p.$id}`)}
                    className="w-full cursor-pointer h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{p.Title}</h3>
                  <p className="text-sm text-gray-500 mb-2 capitalize">
                    Status:{" "}
                    <span
                      className={
                        p.Status === "private"
                          ? "text-red-500"
                          : "text-green-600"
                      }
                    >
                      {p.Status}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post-form/${p.$id}?type=post`);
                      }}
                      className="px-3 py-1 cursor-pointer bg-green-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p);
                      }}
                      disabled={deletingId === p.$id}
                      className={`px-3 py-1 cursor-pointer text-white rounded ${
                        deletingId === p.$id ? "bg-gray-400" : "bg-red-500"
                      }`}
                    >
                      {deletingId === p.$id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Your Articles */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Articles</h2>
        {articles.length === 0 ? (
          <p className="text-gray-600">
            No articles.{" "}
            <Link to="/add-post?type=article" className="text-blue-600 underline">
              Create one →
            </Link>
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <div
                key={a.$id}
                
                className="border rounded shadow hover:shadow-lg transition"
              >
                {a.imageUrl ? (
                  <img
                    src={a.imageUrl}
                    onClick={() => navigate(`/post/${a.$id}`)}
                    className="w-full h-48 cursor-pointer object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{a.Title}</h3>
                  <p className="text-sm text-gray-500 mb-2 capitalize">
                    Status:{" "}
                    <span
                      className={
                        a.Status === "private"
                          ? "text-red-500"
                          : "text-green-600"
                      }
                    >
                      {a.Status}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post-form/${a.$id}?type=article`);
                      }}
                      className="px-3 py-1 cursor-pointer bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(a);
                      }}
                      disabled={deletingId === a.$id}
                      className={`px-3 py-1 cursor-pointer text-white rounded ${
                        deletingId === a.$id ? "bg-gray-400" : "bg-red-500"
                      }`}
                    >
                      {deletingId === a.$id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
