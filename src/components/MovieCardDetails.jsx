import moment from "moment"
import { Helmet } from "react-helmet-async"
import { tmdbConfig } from '@/firebase/config'

const MovieCardDetails = ({ movie }) => {
    return (
        <>
            <Helmet>
                <title>{movie.title} | MovieApp</title>
            </Helmet>
            <div className="flex flex-col md:flex-row gap-6">
                <img src={`${tmdbConfig.imageUrl + movie.poster_path}`} 
                    alt={movie.title}
                    className="w-full md:w-1/3 rounded"
                />
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        {moment(movie.release_date).format("DD.MM.YYYY")}
                    </p>
                    <p className="text-gray-700 mb-4">{movie.overview}</p>
                    <p className="text-yellow-600 font-semibold">
                        Vote Average: {movie.vote_average}
                    </p>
                </div>
            </div>
        </>
    )
}

export default MovieCardDetails