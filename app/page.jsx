"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [summary, setSummary] = useState({
    movie: { watched: 0, remaining: 0, total: 0 },
    series: { watched: 0, remaining: 0, total: 0 },
    anime: { watched: 0, remaining: 0, total: 0 },
  });

  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" }); // Sorting state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [postsPerPage, setPostsPerPage] = useState(8); // Default cards per page
  const [theme, setTheme] = useState("dark"); // Default dark theme
  const [statusFilter, setStatusFilter] = useState("all"); // Watched/Unwatched filter
  const [typeFilter, setTypeFilter] = useState("all"); // Type filter (movie/series/anime)
  const [selectedPost, setSelectedPost] = useState(null); // State for selected post
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawer state

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/list");
      const data = await res.json();
      setPosts(data);

      const newSummary = {
        movie: { watched: 0, remaining: 0, total: 0 },
        series: { watched: 0, remaining: 0, total: 0 },
        anime: { watched: 0, remaining: 0, total: 0 },
      };

      data.forEach((post) => {
        if (post.type === "movie") {
          newSummary.movie.total++;
          post.status === "watched"
            ? newSummary.movie.watched++
            : newSummary.movie.remaining++;
        } else if (post.type === "series") {
          newSummary.series.total++;
          post.status === "watched"
            ? newSummary.series.watched++
            : newSummary.series.remaining++;
        } else if (post.type === "anime") {
          newSummary.anime.total++;
          post.status === "watched"
            ? newSummary.anime.watched++
            : newSummary.anime.remaining++;
        }
      });

      setSummary(newSummary);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const filteredPosts = posts
    .filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((post) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "watched" && post.status === "watched") return true;
      if (statusFilter === "unwatched" && post.status !== "watched")
        return true;
      return false;
    })
    .filter((post) => {
      if (typeFilter === "all") return true;
      if (typeFilter === "movie" && post.type === "movie") return true;
      if (typeFilter === "series" && post.type === "series") return true;
      if (typeFilter === "anime" && post.type === "anime") return true;
      return false;
    })
    .sort((a, b) => {
      if (sortConfig.key) {
        if (sortConfig.direction === "asc") {
          return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      }
      return 0;
    });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const grandTotal = {
    watched:
      summary.movie.watched + summary.series.watched + summary.anime.watched,
    remaining:
      summary.movie.remaining +
      summary.series.remaining +
      summary.anime.remaining,
    total: summary.movie.total + summary.series.total + summary.anime.total,
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      {/* <div className="sticky top-10 z-50 ">
        <div className="flex ">
          <button
            className={`px-4 py-2 ${
              theme === "dark"
                ? "bg-gray-700 dark:bg-gray-800"
                : "bg-gray-300 text-gray-800"
            } rounded-lg shadow-md hover:bg-gray-600 transition-colors`}
            onClick={toggleTheme}
          >
            {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          </button>
        </div>
      </div> */}
      <div className="absolute">
        <div className="fixed top-2 left-0 m-0 p-0 z-10 ">
          <div className="flex">
            <button className={``} onClick={toggleTheme}>
              {theme === "light" ? (
                <svg
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      opacity="0.5"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M22 12.0004C22 17.5232 17.5228 22.0004 12 22.0004C10.8358 22.0004 9.71801 21.8014 8.67887 21.4357C8.24138 20.3772 8 19.217 8 18.0004C8 15.7792 8.80467 13.7459 10.1384 12.1762C11.31 13.8818 13.2744 15.0004 15.5 15.0004C17.8615 15.0004 19.9289 13.741 21.0672 11.8572C21.3065 11.4612 22 11.5377 22 12.0004Z"
                      fill="#1C274C"
                    ></path>
                    <path
                      d="M2 12C2 16.3586 4.78852 20.0659 8.67887 21.4353C8.24138 20.3768 8 19.2166 8 18C8 15.7788 8.80467 13.7455 10.1384 12.1758C9.42027 11.1303 9 9.86422 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12Z"
                      fill="#1C274C"
                    ></path>
                  </g>
                </svg>
              ) : (
                <svg
                  width="64px"
                  height="64px"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fill="#FFAC33"
                      d="M16 2s0-2 2-2s2 2 2 2v2s0 2-2 2s-2-2-2-2V2zm18 14s2 0 2 2s-2 2-2 2h-2s-2 0-2-2s2-2 2-2h2zM4 16s2 0 2 2s-2 2-2 2H2s-2 0-2-2s2-2 2-2h2zm5.121-8.707s1.414 1.414 0 2.828s-2.828 0-2.828 0L4.878 8.708s-1.414-1.414 0-2.829c1.415-1.414 2.829 0 2.829 0l1.414 1.414zm21 21s1.414 1.414 0 2.828s-2.828 0-2.828 0l-1.414-1.414s-1.414-1.414 0-2.828s2.828 0 2.828 0l1.414 1.414zm-.413-18.172s-1.414 1.414-2.828 0s0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0s0 2.828 0 2.828l-1.414 1.414zm-21 21s-1.414 1.414-2.828 0s0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0s0 2.828 0 2.828l-1.414 1.414zM16 32s0-2 2-2s2 2 2 2v2s0 2-2 2s-2-2-2-2v-2z"
                    ></path>
                    <circle fill="#FFAC33" cx="18" cy="18" r="10"></circle>
                  </g>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`${theme === "dark" ? "dark" : ""}`}>
        <div
          className={`min-h-screen ${
            theme === "dark"
              ? "bg-gray-900 dark:bg-gray-900 text-gray-200 dark:text-white"
              : "bg-teal-100 text-gray-800"
          }`}
        >
          <div className="container mx-auto px-4 py-12 max-w-7xl">
            <header className="mb-8 text-center">
              <h1
                className={`text-5xl font-extrabold mb-6 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
                    : "text-purple-600"
                }`}
              >
                Shantnu's Watch List
              </h1>
              <div
                className={`max-w-3xl mx-auto ${
                  theme === "dark"
                    ? "bg-gray-800 dark:bg-gray-700"
                    : "bg-white border border-gray-200"
                } rounded-xl p-8 shadow-lg`}
              >
                <p className="mb-4 leading-relaxed">
                  🎬 Welcome to my curated watchlist! It's where I keep track of
                  movies, series, and anime I’ve watched or plan to watch.
                </p>
                <p className="mb-4 leading-relaxed">
                  Why does this website even exists? Well I'm very fond of
                  movies and web series and I have a problem where I cannot
                  remember any of the names of the movies or series I've
                  watched, which makes me angry. So to overcome that problem, I
                  have used all the free open-source tools and my poor
                  programming skills to make a website that somewhat helps me
                  overcome this issue.
                </p>
                <div className="space-y-2">
                  <p>
                    Want to recommend something?
                    <a
                      href="mailto:shantnu04@gmail.com"
                      className="text-purple-400 hover:underline"
                    >
                      Email me
                    </a>
                  </p>
                  <p>
                    Find the project on
                    <a
                      href="https://github.com/shantnudon/shantnu-watch-list"
                      className="text-purple-400 hover:underline"
                    >
                      GitHub
                    </a>
                  </p>
                  <p>
                    Admin?
                    <Link
                      href="/login"
                      className="text-purple-400 hover:underline"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </header>

            <section className="mb-16">
              <h2
                className={`text-3xl font-bold mb-8 text-center ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Watch Statistics
              </h2>
              <div
                className={`${
                  theme === "dark" ? "bg-gray-800 dark:bg-gray-700" : "bg-white"
                } rounded-xl shadow-lg overflow-hidden`}
              >
                <table className=" table-fixed w-full overflow-y-scroll">
                  <thead
                    className={`${
                      theme === "dark"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <tr>
                      {["Type", "Watched", "Remaining", "Total"].map(
                        (header, index) => (
                          <th
                            key={index}
                            className="py-5 px-6 text-left font-semibold"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {["movie", "series", "anime"].map((type, index) => (
                      <tr
                        key={index}
                        className={`${
                          theme === "dark"
                            ? "border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors"
                            : "border-b border-gray-200"
                        }`}
                      >
                        <td className="py-4 px-6 font-medium">
                          <span className="inline-flex items-center">
                            {type === "movie" && "🎥"}
                            {type === "series" && "📺"}
                            {type === "anime" && "🌸"}
                            <span className="ml-2">
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                          </span>
                        </td>
                        <td className="py-4 px-6">{summary[type].watched}</td>
                        <td className="py-4 px-6">{summary[type].remaining}</td>
                        <td className="py-4 px-6">{summary[type].total}</td>
                      </tr>
                    ))}
                    <tr
                      className={`${
                        theme === "dark" ? "bg-gray-500" : "bg-gray-100"
                      }`}
                    >
                      <td className="py-4 px-6 font-semibold">Total</td>
                      <td className="py-4 px-6 font-semibold">
                        {grandTotal.watched}
                      </td>
                      <td className="py-4 px-6 font-semibold">
                        {grandTotal.remaining}
                      </td>
                      <td className="py-4 px-6 font-semibold">
                        {grandTotal.total}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <input
                type="text"
                placeholder="Search by title..."
                className="mb-4 md:mb-0 px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="flex items-center mb-4 md:mb-0">
                <label htmlFor="statusFilter" className="mr-2">
                  Filter by status:
                </label>
                <select
                  id="statusFilter"
                  className="px-4 py-2 dark:border-none rounded-lg dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="watched">Watched</option>
                  <option value="unwatched">Unwatched</option>
                </select>
              </div>

              <div className="flex items-center mb-4 md:mb-0">
                <label htmlFor="typeFilter" className="mr-2">
                  Filter by type:
                </label>
                <select
                  id="typeFilter"
                  className="px-4 py-2 dark:border-none rounded-lg dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="movie">Movies</option>
                  <option value="series">Series</option>
                  <option value="anime">Anime</option>
                </select>
              </div>

              <div className="flex items-center">
                <label htmlFor="postsPerPage" className="mr-2">
                  Show:
                </label>
                <select
                  id="postsPerPage"
                  className="px-4 py-2 dark:border-none rounded-lg dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={postsPerPage}
                  onChange={(e) => setPostsPerPage(Number(e.target.value))}
                >
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentPosts.map((post, index) => (
                <div
                  key={index}
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 dark:bg-gray-700 dark:text-white"
                      : "bg-white text-gray-800"
                  } rounded-xl p-6 shadow-md`}
                  onClick={() => handleCardClick(post)}
                >
                  <img
                    src={post.data.Poster}
                    alt={post.title}
                    className="w-full h-48 object-cover mb-4 rounded-lg"
                  />
                  <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                  <p className="text-sm mb-4">
                    <span className="font-semibold">Type:</span> {post.type}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-[30px] ${
                      post.status === "watched"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-black"
                    }`}
                  >
                    {post.status === "watched" ? "Watched" : "Unwatched"}
                  </span>
                  <br />
                  <br />
                  <span className="px-2 py-1 rounded-[30px] bg-slate-400 text-black">
                    {post.data.Genre}
                  </span>
                </div>
              ))}

              {drawerOpen && selectedPost && (
                <div
                  className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end transition-opacity duration-300 ${
                    drawerOpen ? "opacity-100" : "opacity-0"
                  }`}
                  onClick={closeDrawer}
                >
                  <div
                    className={`glass w-full h-auto p-6 shadow-lg transform transition-all duration-300 ease-in-out ${
                      drawerOpen ? "translate-y-0" : "translate-y-full"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">
                        {selectedPost.title}
                      </h2>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={closeDrawer}
                      >
                        ✖
                      </button>
                    </div>
                    <div className="flex mt-2">
                      <div>
                        <img
                          src={selectedPost.data.Poster}
                          alt={selectedPost.title}
                          className="w-28 h-auto object-cover mb-4 rounded-lg"
                        />
                      </div>
                      <div className="m-2">
                        <p>
                          <strong>Type:</strong> {selectedPost.type}
                        </p>
                        <p>
                          <strong>Status:</strong> {selectedPost.status}
                        </p>
                        <p>
                          <strong>Genre:</strong> {selectedPost.data.Genre}
                        </p>
                        <p>
                          <strong>Release Year:</strong>
                          {selectedPost.data.ReleaseYear}
                        </p>
                        <p className="">
                          <strong>Description:</strong>
                          {selectedPost.data.Description}
                        </p>
                        <p className="">
                          <strong>IMDB website: </strong>
                          <a
                            href={`https://www.imdb.com/title/${selectedPost.imdbId}`}
                            target="_blank"
                            className="text-blue-500 hover:underline "
                          >
                            Click here to check the IMDB website details -
                            {selectedPost.imdbId}
                          </a>
                        </p>
                        <p className="">
                          <strong>Remarks: </strong>
                          {selectedPost.remarks}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-center items-center gap-2 sm:flex-row flex-col">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md disabled:opacity-50"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md disabled:opacity-50"
              >
                Prev
              </button>
              <p>
                Showing {indexOfFirstPost + 1} to {indexOfLastPost} of
                {filteredPosts.length} entries
              </p>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md disabled:opacity-50"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
