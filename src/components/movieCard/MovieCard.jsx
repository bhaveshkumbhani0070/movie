"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

const MovieCard = ({
  movie: { movie_name, rating, genre, movie_cast, release_date, likes, id },
}) => {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [movieLikes, setMovieLikes] = useState(0);

  useEffect(() => {
    session && likes && setIsLiked(likes.includes(session?.user?.id));
    session && likes && setMovieLikes(likes.length);
  }, [likes, session]);

  const handleLike = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/movie/${id}/like`,
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

  return (
    <div className="bg-gray-100 rounded-xl dark:bg-gray-800">
      <div className="">
        <Link href={`/movie/${id}`}>
          <img
            src={"/movie.jpg"}
            width="100%"
            height="100%"
            className="rounded-tl-lg rounded-tr-lg hover:opacity-75 transition-opacity duration-300"
          />
        </Link>
        <div className="p-4">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold">{movie_name}</h3>
            <p className="text-gray-600">Rating: {rating}</p>
            <p className="text-gray-600">Type: {genre}</p>
            <p className="text-gray-600">Cast: {movie_cast}</p>

            <span className="text-sm mt-2">
              Release date:{" "}
              <span className="font-semibold">{release_date}</span>
            </span>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-lg font-semibold">{movieLikes}</span>{" "}
            {isLiked ? (
              <AiFillLike
                onClick={handleLike}
                size={20}
                className="text-blue-500 ml-2 cursor-pointer"
              />
            ) : (
              <AiOutlineLike
                onClick={handleLike}
                size={20}
                className="text-blue-500 ml-2 cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
