"use client";

import { useEffect, useState } from "react";
import "datatables.net-dt/css/dataTables.dataTables.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import $ from "jquery";

const DataTable = dynamic(() => import("datatables.net"), { ssr: false });

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [summary, setSummary] = useState({
    movie: { watched: 0, remaining: 0, total: 0 },
    series: { watched: 0, remaining: 0, total: 0 },
    anime: { watched: 0, remaining: 0, total: 0 },
  });

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

  const grandTotal = {
    watched:
      summary.movie.watched + summary.series.watched + summary.anime.watched,
    remaining:
      summary.movie.remaining +
      summary.series.remaining +
      summary.anime.remaining,
    total: summary.movie.total + summary.series.total + summary.anime.total,
  };

  useEffect(() => {
    if (typeof window !== "undefined" && posts.length > 0) {
      import("datatables.net").then(() => {
        $("#contentTable").DataTable();
      });
    }
  }, [posts]);

  // console.log(posts);
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-semibold mb-6 text-center">
        Movies & Series List
      </h1>
      <div className="m-6 text-center">
        <p className="m-0">
          Why does this website even exists? Well I'm very fond of movies and
          web series and I have a problem where I cannot remember any of the
          names of the movies or series I've watched, which makes me angry. So
          to overcome that problem, I have used all the free open-source tools
          and my poor programming skills to make a website that somewhat helps
          me overcome this issue.
        </p>
        <p className="m-1">
          If there is a movie, series, or anime that you want me to watch, you
          can email me at{" "}
          <a
            href="mailto:shantnu04@gmail.com"
            className="text-blue-500 hover:text-blue-700"
          >
            shantnu04@gmail.com
          </a>{" "}
          and I will try to watch that movie as soon as possible.
        </p>
        <p className="m-2">
          If you want to contribute to this project, you can fork this repo from{" "}
          <a
            className="text-blue-500 hover:text-blue-700"
            href="https://github.com/shantnudon/shantnu-watch-list"
          >
            GitHub
          </a>{" "}
          and make a pull request.
        </p>
        <p className="m-3">
          Are you an admin?{" "}
          <Link className="text-blue-500 hover:text-blue-700" href="/login">
            Login
          </Link>
        </p>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg mb-6">
        <h3 className="text-center text-2xl font-semibold m-2">Summary</h3>
        <table id="" className="min-w-full bg-white table-auto">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Watched</th>
              <th className="py-3 px-6 text-left">Remaining</th>
              <th className="py-3 px-6 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {["movie", "series", "anime"].map((type) => (
              <tr key={type} className="bg-gray-100 border-b hover:bg-gray-200">
                <td className="py-3 px-6">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </td>
                <td className="py-3 px-6">{summary[type].watched}</td>
                <td className="py-3 px-6">{summary[type].remaining}</td>
                <td className="py-3 px-6">{summary[type].total}</td>
              </tr>
            ))}
            <tr className="bg-gray-200 border-b font-semibold">
              <td className="py-3 px-6">Grand Total</td>
              <td className="py-3 px-6">{grandTotal.watched}</td>
              <td className="py-3 px-6">{grandTotal.remaining}</td>
              <td className="py-3 px-6">{grandTotal.total}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table id="contentTable" className="min-w-full bg-white table-auto">
          <thead className="bg-blue-500 text-white">
            <tr>
              {/* <th className="py-3 px-6 text-left">SNo</th> */}
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Year</th>
              <th className="py-3 px-6 text-left">Genre</th>
              <th className="py-3 px-6 text-left">Runtime</th>
              <th className="py-3 px-6 text-left">Plot</th>
              <th className="py-3 px-6 text-left">Poster</th>
              <th className="py-3 px-6 text-left">IMDB ID</th>
              <th className="py-3 px-6 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <>
                {/* {console.log(post)} */}
                <tr
                  key={post._id}
                  className="bg-gray-100 border-b hover:bg-gray-200"
                >
                  {/* <td>{index + 1}</td> */}
                  <td className="py-3 px-6">{post.title}</td>
                  <td className="py-3 px-6">{post.type}</td>
                  <td className="py-3 px-6">{post.status}</td>
                  <td className="py-3 px-6">{post.data.Year}</td>
                  <td className="py-3 px-6">{post.data.Genre}</td>
                  <td className="py-3 px-6">{post.data.Runtime}</td>
                  <td className="py-3 px-6">{post.data.Plot}</td>
                  <td className="py-3 px-6">
                    <img src={post.data.Poster} alt={post.title} />
                  </td>
                  <td className="py-3 px-6">{post.imdbId}</td>
                  <td className="py-3 px-6">{post.remarks}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
