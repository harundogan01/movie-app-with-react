import SkeletonCard from "@/components/SkeletonCard"
import { useState, useEffect, lazy, Suspense } from "react"
import { useOutletContext } from 'react-router-dom'
import { Helmet } from "react-helmet-async"
import { toast } from "react-toastify"
import { firebaseConfig, tmdbConfig } from '@/firebase/config'
import axios from "axios"
import useAuth from "@/firebase/useAuth"
import { addMovieToFavorites, removeMovieFromFavorites } from "@/firebase/favorites"
import InfiniteScroll from "react-infinite-scroll-component"
import MovieCard from "@/components/MovieCard"
import ScrollToTopButton from "@/components/ScrollToTopButton"
import { toastOptions } from "@/config/toastOptions"

const MovieModal = lazy(() => import('@/components/MovieModal'))

const Home = () => {
    const { searchQuery, selectedCategory, favorites, refreshFavorites } = useOutletContext()
    const user = useAuth().user
    const [movies, setMovies] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)
    const [selectedMovie, setSelectedMovie] = useState(null)

    const [showModal, setShowModal] = useState(false)

    const isMovieFavorited = (movieId) => favorites.some(fav => fav.id === movieId)

    const handleFavoriteClick = async (movie) => {
        if (!user) {
            window.location.href = '/login'
            return
        }

        const isFavorited = isMovieFavorited(movie.id)

        if (isFavorited) await removeMovieFromFavorites(user.uid, movie)
        else await addMovieToFavorites(user.uid, movie)

        refreshFavorites()
    }

    useEffect(() => {
        setMovies([])
        setPage(1)
        setHasMore(true)
    }, [searchQuery, selectedCategory])

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true)
            let url = ""
            if (searchQuery) url = `${tmdbConfig.tmdbUrl}/search/movie?api_key=${tmdbConfig.apiKey}&query=${searchQuery}&page=${page}`
            else if (selectedCategory) url = `${tmdbConfig.tmdbUrl}/discover/movie?api_key=${tmdbConfig.apiKey}&with_genres=${selectedCategory}&page=${page}`
            else url = `${tmdbConfig.tmdbUrl}/movie/popular?api_key=${tmdbConfig.apiKey}&page=${page}`

            try {
                const res = await axios.get(url)
                const newMovies = res.data.results

                setMovies((prev) => page === 1 ? newMovies : [...prev, ...newMovies])
                setHasMore(res.data.page < res.data.total_pages)
            }
            catch (error) {
                toast.error("Movie data could not be retrieved! ❌" + error.message, toastOptions)
            }
            finally {
                setLoading(false)
            }
        }
        fetchMovies()
    }, [page, searchQuery, selectedCategory])

    useEffect(() => {
        if (user) refreshFavorites()
    }, [user])

    const handleCardClick = (movie) => {
        setSelectedMovie(movie)
        setShowModal(true)
    }

    const closeModal = () => {
        setSelectedMovie(null)
        setShowModal(false)
    }

    return (
        <>
            <Helmet>
                <title>Home | MovieApp</title>
            </Helmet>

            <div className="min-h-screen bg-gray-100">
                <div className="container mx-auto px-4 py-6">
                    {loading && page === 1 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : movies.length > 0 ? (
                        <InfiniteScroll 
                        dataLength={movies.length}
                        next={() => setPage(prev => prev + 1)}
                        hasMore={hasMore}
                        loader={<SkeletonCard />}
                        endMessage={
                            <p className="text-center text-gray-500">No more movies.</p>
                        }>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {movies.map((movie, index) => (
                                    <MovieCard 
                                        key={movie.id}
                                        movie={movie}
                                        isFavorited={isMovieFavorited(movie.id)}
                                        onFavoriteClick={handleFavoriteClick}
                                        isAuthenticated={!!user}
                                        onClick={() => handleCardClick(movie)}
                                    />
                                ))}
                            </div>
                        </InfiniteScroll>
                    ) : (
                        <p className="text-center text-gray-600">
                            Movie not found.
                        </p>
                    )}
                </div>

                {showModal && selectedMovie && (
                    <Suspense fallback={<SkeletonCard />}>
                        <MovieModal movie={selectedMovie} onClose={closeModal}
                        refreshFavorites={refreshFavorites}
                        />
                    </Suspense>
                )}
                <ScrollToTopButton />
            </div>
        </>
    )
}
export default Home