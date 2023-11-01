"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "timeago.js";
import { useRouter } from "next/navigation";
import Comment from "@/components/comment/Comment";

const MovieDetails = (ctx) => {
  const [movieDetails, setMovieDetails] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [movieLikes, setMovieLikes] = useState(0);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchComments() {
      const res = await fetch(`/api/comment/${ctx.params.id}`, {
        cache: "no-store",
      });
      const comments = await res.json();

      setComments(comments);
    }
    fetchComments();
  }, []);

  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/movie/${ctx.params.id}`,
        {
          cache: "no-store",
        }
      );
      const movie = await res.json();
      console.log("get movie details ", movie);
      setMovieDetails(movie);
      setIsLiked(movie?.likes?.includes(session?.user?.id));
      setMovieLikes(movie?.likes?.length || 0);
    }
    session && fetchMovie();
  }, [session]);

  const handleDelete = async () => {
    try {
      const confirmModal = confirm(
        "Are you sure you want to delete your movie?"
      );

      if (confirmModal) {
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/movie/${ctx.params.id}`,
          {
            headers: {
              authorization: `${session?.user?.accessToken}`,
            },
            method: "DELETE",
          }
        );

        if (res.ok) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/movie/${ctx.params.id}/like`,
        {
          headers: {
            authorization: `${session?.user?.accessToken}`,
          },
          method: "PUT",
        }
      );

      console.log(res);
      if (res.ok) {
        if (isLiked) {
          setIsLiked((prev) => !prev);
          setMovieLikes((prev) => prev - 1);
        } else {
          setIsLiked((prev) => !prev);
          setMovieLikes((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    if (commentText?.length < 2) {
      toast.error("Comment must be at least 2 characters long");
      return;
    }

    try {
      const body = {
        movieId: ctx.params.id,
        authorId: session?.user?.id,
        text: commentText,
      };

      const res = await fetch(`/api/comment`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `${session?.user?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(body),
      });

      const newComment = await res.json();

      setComments((prev) => {
        return [newComment, ...prev];
      });

      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <img
              src={"/movie.jpg"}
              width="750"
              height="650"
              alt="Image to show"
              className="mx-auto"
            />
          </div>
          <div className="md:col-span-1">
            <h3 className="text-2xl font-semibold">
              {movieDetails?.movie_name}
            </h3>
            {movieDetails?.authorId?.id.toString() ===
            session?.user?.id?.toString() ? (
              <div className="flex items-center mt-2 space-x-4">
                <Link
                  href={`/movie/edit/${ctx.params.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className="mt-2">
                Author:{" "}
                <span className="font-semibold">
                  {movieDetails?.authorId?.username}
                </span>
              </div>
            )}
            <div className="mt-2">
              <div className="text-sm font-medium text-gray-600">
                Category:{" "}
                <span className="text-blue-500">{movieDetails?.category}</span>
              </div>
              <div className="ml-auto">
                <span className="text-sm text-gray-600">
                  Posted:{" "}
                  <span className="font-semibold">
                    {format(movieDetails?.createdAt)}
                  </span>
                </span>
              </div>
            </div>
            <div className="mt-4">
              <p>{movieDetails?.desc}</p>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-lg font-semibold">{movieLikes}</span>
                {isLiked ? (
                  <AiFillLike
                    size={20}
                    onClick={handleLike}
                    className="text-blue-500 ml-2 cursor-pointer"
                  />
                ) : (
                  <AiOutlineLike
                    size={20}
                    onClick={handleLike}
                    className="text-blue-500 ml-2 cursor-pointer"
                  />
                )}
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center">
                <img
                  src={"/person.jpeg"}
                  width="45"
                  height="45"
                  alt=""
                  className="w-12 h-12 rounded-full"
                />
                <input
                  value={commentText}
                  type="text"
                  placeholder="Type message..."
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleComment}
                  className="px-4 py-2 ml-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Post
                </button>
              </div>
            </div>
            <div className="mt-6">
              {comments?.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    setComments={setComments}
                  />
                ))
              ) : (
                <h4 className="text-sm text-gray-600">
                  No comments. Be the first one to leave a comment!
                </h4>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MovieDetails;
