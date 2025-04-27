import { toastOptions } from '@/config/toastOptions'
import { toast } from 'react-toastify'

function getEnvVariable(key) {
    const value = import.meta.env[key]
    if (!value) {
        toast.error(`Missing environment variable! ‼️ - ${key}`, toastOptions)
    }
    return value
}

const firebaseConfig = {
    apiKey: getEnvVariable('VITE_FIREBASE_API_KEY'),
    authDomain: getEnvVariable('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVariable('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVariable('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVariable('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVariable('VITE_FIREBASE_APP_ID'),
    measurementId: getEnvVariable('VITE_FIREBASE_MEASUREMENT_ID')
}

const tmdbConfig = {
    tmdbUrl: getEnvVariable('VITE_TMDB_URL'),
    apiKey: getEnvVariable('VITE_TMDB_API_KEY'),
    imageUrl: getEnvVariable('VITE_IMAGE_URL')
}

export { firebaseConfig, tmdbConfig }