import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getAuth, onIdTokenChanged, signOut } from 'firebase/auth'
import { toastOptions } from '@/config/toastOptions'

const useAuth = () => {
    const [user, setUser] = useState(null)
    let timeoutId = null

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onIdTokenChanged(auth, async (user) => {
            clearTimeout(timeoutId)
            if (user) {
                const tokenResult = await user.getIdTokenResult()
                const expirationTime = new Date(tokenResult.expirationTime).getTime()
                const now = Date.now()
                const remainingTime = expirationTime - now

                timeoutId = setTimeout(() => {
                    signOut(auth)
                    setUser(null)
                    localStorage.removeItem('accessTokenForMovieApp')
                    toast.info('Session expired. Please log in again! ⚠️', toastOptions)
                    window.location.href = '/login'
                }, remainingTime)

                const token = await user.getIdToken()
                localStorage.setItem('accessTokenForMovieApp', token)
                setUser(user)
            }
            else {
                localStorage.removeItem('accessTokenForMovieApp')
                setUser(null)
            }
        })

        return () => {
            unsubscribe()
            clearTimeout(timeoutId)
        }
    }, [])
    return { user }
}

export default useAuth