"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import jwt, { decode } from "jsonwebtoken";

export default function AdminDashboard() {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const authToken = Cookies.get("token");

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const logout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/list");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          body: JSON.stringify({ token }),
        });

        if (res.status === 200) {
          const data = await res.json();
          console.log("Decoded User: ", data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Token verification failed", error);
        router.push("/login");
      }
    };

    verifyToken();
  }, [router]);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Add Post function
  const handleAddPost = async (newPost) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${authToken}`);

      const res = await fetch("/api/list", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(newPost),
      });

      if (res.ok) {
        fetchPosts();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error("Failed to add post", error);
    }
  };

  // Update Post function
  const handleUpdatePost = async (updatedPost) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${authToken}`);

      const res = await fetch("/api/list", {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(updatedPost),
      });

      if (res.ok) {
        fetchPosts();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Failed to update post", error);
    }
  };

  // Delete Post function
  const handleDeletePost = async (id) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${authToken}`);

      const res = await fetch("/api/list", {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify({ _id: id }),
      });
      // console.log(res);

      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowAddModal(true)}
        >
          Add Post
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>

      {/* Posts Table */}
      <table className=" table-auto mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Remarks</th>
            <th className="px-4 py-2">IMDB ID</th>
            <th className="px-4 py-2">data</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <td className="border px-4 py-2">{post.title}</td>
              <td className="border px-4 py-2">{post.type}</td>
              <td className="border px-4 py-2">{post.status}</td>
              <td className="border px-4 py-2">{post.remarks}</td>
              <td className="border px-4 py-2">{post.imdbId}</td>
              <td className="border px-4 py-2">
                <pre>{JSON.stringify(post.data, null, 2)}</pre>
              </td>
              {/* <pre>{JSON.stringify(movieData.data, null, 2)}</pre> */}
              <td className="border px-4 py-2">
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-1 rounded-md mr-2"
                  onClick={() => {
                    setSelectedPost(post);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded-md"
                  onClick={() => handleDeletePost(post._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />

      {/* Add Post Modal */}
      {showAddModal && (
        <AddEditModal
          closeModal={() => setShowAddModal(false)}
          savePost={handleAddPost}
        />
      )}

      {/* Edit Post Modal */}
      {showEditModal && selectedPost && (
        <AddEditModal
          closeModal={() => setShowEditModal(false)}
          savePost={handleUpdatePost}
          post={selectedPost}
        />
      )}
    </div>
  );
}

function AddEditModal({ closeModal, savePost, post }) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    type: post?.type || "movie",
    status: post?.status || "watched",
    remarks: post?.remarks || "",
    imdbId: post?.imdbId || "",
    data: post?.data || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (post) {
      savePost({ ...formData, _id: post._id });
    } else {
      savePost(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">
          {post ? "Edit Post" : "Add Post"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="text-blue-500">
            <a
              href={`https://www.imdb.com/find/?q=${formData.title}`}
              target="_blank"
            >
              Check the IMDB details here
            </a>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">IMDB ID</label>
            <input
              type="text"
              name="imdbId"
              value={formData.imdbId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <input
            type="hidden"
            name="data"
            value={formData.data}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="anime">Anime</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="watched">Watched</option>
              <option value="not-watched">Not Watched</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {post ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
