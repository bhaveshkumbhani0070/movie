import MovieCard from "@/components/movieCard/MovieCard";

export async function fetchMovies() {
  try {
    const res = await fetch(process.env.NEXTAUTH_URL + "/api/movie", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching Movies:", error);
    return []; // Return an empty array or handle the error as needed
  }
}

export default async function Home() {
  try {
    const movies = await fetchMovies();
    return (
      <div className="container mx-auto px-4 py-8">
        {movies.length > 0 && (
          <h2 className="text-2xl font-bold mb-4">Movie page</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.length > 0 ? (
            movies.map((movie) => <MovieCard key={movie._id} movie={movie} />)
          ) : (
            <h3 className="text-xl">No movies are currently available</h3>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering the Home component:", error);
    // Handle the error gracefully or display an error message to the user
    return <div>Error loading movies. Please try again later.</div>;
  }
}
