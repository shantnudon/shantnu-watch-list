"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import os from "os";

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

  // const systemStats = {
  //   uptime: os.uptime(),
  //   totalMemory: os.totalmem(),
  //   freeMemory: os.freemem(),
  //   loadAverage: os.loadavg(),
  //   cpus: os.cpus(),
  //   networkInterfaces: os.networkInterfaces(),
  //   platform: os.platform(),
  //   release: os.release(),
  //   hostname: os.hostname(),
  //   arch: os.arch(),
  // };

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
    const token = Cookies.get("token");

    if (!token) {
      router.push("/");
    }
  }, []);

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
      <table className="min-w-full table-auto mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Remarks</th>
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
      {/* <button
        onClick={openModal}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Show System Info
      </button> */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-center text-xl font-semibold">
              <div className="min-h-screen bg-gray-100 p-6">
                <h1 className="text-center text-3xl text-blue-600 mb-8">
                  Admin Panel - System Stats
                </h1>
                <div className="max-w-screen-xl mx-auto p-6 bg-white rounded-lg shadow-md">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">Uptime:</span>
                      <span>
                        {(systemStats.uptime / 60).toFixed(2)} minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Memory:</span>
                      <span>
                        {(systemStats.totalMemory / 1024 ** 3).toFixed(2)} GB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Free Memory:</span>
                      <span>
                        {(systemStats.freeMemory / 1024 ** 3).toFixed(2)} GB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        Load Average (1 min):
                      </span>
                      <span>{systemStats.loadAverage[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Platform:</span>
                      <span>{systemStats.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Release:</span>
                      <span>{systemStats.release}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Hostname:</span>
                      <span>{systemStats.hostname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Architecture:</span>
                      <span>{systemStats.arch}</span>
                    </div>

                    <div>
                      <span className="font-semibold">CPU Info:</span>
                      <ul className="ml-4 space-y-2">
                        {systemStats.cpus.map((cpu, index) => (
                          <li key={index}>
                            CPU {index + 1}: {cpu.model} - {cpu.speed} MHz
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-semibold">Network Interfaces:</span>
                      <ul className="ml-4 space-y-2">
                        {Object.entries(systemStats.networkInterfaces).map(
                          ([iface, details], index) => (
                            <li key={index}>
                              {iface}: {JSON.stringify(details)}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </h2>
            <div className="flex justify-center mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
