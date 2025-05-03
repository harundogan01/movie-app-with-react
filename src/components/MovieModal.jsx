import Skeleton from './SkeletonCard'
import { lazy, Suspense } from 'react'

const MovieModal = ({ movie, onClose }) => {
    if (!movie) return null

    const MovieCardDetails = lazy(() => import('./MovieCardDetails'))

    return (
        <>
            <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50'>
                <div className='bg-white rounded-lg shadow-lg w-full p-6 relative
                2xs:overflow-hidden 2xs:overflow-y-auto 2xs:w-3/4 2xs:h-[70%]'>
                    <button onClick={onClose}
                    className='absolute 2xs:top-0 2xs:text-[30px] top-4 right-4 text-gray-600 hover:text-gray-900 text-xl'>
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