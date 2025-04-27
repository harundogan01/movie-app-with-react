import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid"
import { tmdbConfig } from '@/firebase/config'

const MovieCard = ({ movie, onClick, isFavorited, onFavoriteClick, isAuthenticated}) => {
    const posterUrl = movie.poster_path
    ? `${tmdbConfig.imageUrl + movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image"

    return (
        <>
            <div className="relative group cursor-pointer" onClick={onClick}>
                <img src={posterUrl} alt={movie.title}
                    className="rounded-lg shadow-md hover:opacity-80 transition duration-200"
                />
                <button title={!isAuthenticated ? "You must log in" : ""}
                onClick={e => {
                    e.stopPropagation()
                    onFavoriteClick(movie)
                }}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-red-100 transition">
                    {isFavorited ? (
                        <HeartSolid className="text-red-500 w-6 h-6" />
                    ) : (
                        <HeartOutline className="text-gray-500 w-6 h-6" />
                    )}
                </button>
            </div>
        </>
    )
}

export default MovieCard