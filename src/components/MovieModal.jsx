import Skeleton from './SkeletonCard'
import { lazy, Suspense } from 'react'

const MovieModal = ({ movie, onClose }) => {
    if (!movie) return null

    const MovieCardDetails = lazy(() => import('./MovieCardDetails'))

    return (
        <>
            <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50'>
                <div className='bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative'>
                    <button onClick={onClose}
                    className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl'>
                        &times;
                    </button>

                    <Suspense fallback={<Skeleton />}>
                        <MovieCardDetails movie={movie} />
                    </Suspense>
                </div>
            </div>
        </>
    )
}

export default MovieModal