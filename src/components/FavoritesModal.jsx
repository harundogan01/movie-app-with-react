import { useEffect, useState, lazy, Suspense } from 'react'
import { removeMovieFromFavorites } from '@/firebase/favorites'
import MovieCard from '@/components/MovieCard'
import useAuth from '@/firebase/useAuth'
import SkeletonCard from './SkeletonCard'
import { addMovieToFavorites } from '../firebase/favorites'

const MovieModal = lazy(() => import('@/components/MovieModal'))

const FavoritesModal = ({ open, onClose, favorites, refreshFavorites }) => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const isMovieFavorited = movieId => favorites.some(fav => fav.id === movieId)

    const handleCardClick = movie => {
        setSelectedMovie(movie)
        setShowModal(true)
    }

    const closeModal = () => {
        setSelectedMovie(null)
        setShowModal(false)
    }

    const handleFavoriteClick = async movie => {
        if (!user) {
            window.location.href = '/login'
            return
        }

        const isFavorited = isMovieFavorited(movie.id)

        if (isFavorited) await removeMovieFromFavorites(user.uid, movie)
        else await addMovieToFavorites(user.uid, movie)

        refreshFavorites()
    }

    useEffect(() => {
        if (user?.uid) setLoading(false)
    }, [user])

    if (!open) return null

    return (
        <>
            <div className='fixed inset-0 bg-black bg-opacity-50 flex w-full justify-center items-center z-50'>
                <div className='bg-white p-6 rounded-md max-w-2xl relative shadow-lg'>
                    <button onClick={onClose} className='absolute top-3 right-3 text-gray-600 hover:text-black'>
                        ✖
                    </button>
                    <h2 className='text-xl font-semibold mb-4'>
                        Your Favorites
                    </h2>
                    <hr />
                    <div className={`space-y-2 max-h-[600px] w-full overflow-y-auto
                    ${favorites.length == 0 ? 'w-[400px] h-[400px] flex items-center justify-center' : ''}`}>
                        {loading ? (
                            Array(5).fill(0).map((_, idx) => (
                                <div key={idx} className='animate-pulse h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2'>

                                </div>
                            ))
                        ) : favorites.length > 0 ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4'>
                                {favorites.map((movie, index) => (
                                    <MovieCard 
                                        key={index}
                                        movie={movie}
                                        isFavorited={isMovieFavorited(movie.id)}
                                        onFavoriteClick={handleFavoriteClick}
                                        isAuthenticated={!!user}
                                        onClick={() => handleCardClick(movie)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>No favorites yet.</p>
                        )}
                    </div>
                </div>
                {showModal && selectedMovie && (
                    <Suspense fallback={<SkeletonCard />}>
                        <MovieModal movie={selectedMovie} onClose={closeModal}
                        refreshFavorites={refreshFavorites} />
                    </Suspense>
                )}
            </div>
        </>
    )
}

export default FavoritesModal