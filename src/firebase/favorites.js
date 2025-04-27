import { toast } from 'react-toastify'
import { db } from './firebase'
import { getDoc, setDoc, doc, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore'
import { toastOptions } from '@/config/toastOptions'

export const addMovieToFavorites = async (userId, movie) => {
    try {
        const userRef = doc(db, "favorites", userId)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
            const movies = userDoc.data().movies || []
            const exists = movies.some(ref => ref.id === movie.id)
            if (exists) {
                toast.info("This movie has been added to favorites! ℹ️", toastOptions)
                return
            }
            await updateDoc(userRef, {
                movies: arrayUnion(movie)
            })
            toast.success("Movie added to favorites! 🎉", toastOptions)
        }
        else {
            await setDoc(userRef, {
                movies: [movie]
            })
        }
    }
    catch (error) {
        toast.error("Error adding to favorites! ❌" + error.message, toastOptions)
    }
}

export const removeMovieFromFavorites = async (userId, movie) => {
    try {
        const userRef = doc(db, "favorites", userId)
        await updateDoc(userRef, {
            movies: arrayRemove(movie)
        })
        toast.success("Movie removed from favorites! 🎉", toastOptions)
    }
    catch (error) {
        toast.error("Failed to remove from favorites! ❌" + error.message, toastOptions)
    }
}

export const fetchFavoriteMovies = async (userId) => {
    try {
        const userRef = doc(db, "favorites", userId)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
            const data = userDoc.data()
            return data.movies || []
        }
        else return []
    }
    catch (error) {
        toast.error("Error fetching favorite movies! ❌" + error.message, toastOptions)
        return []
    }
}