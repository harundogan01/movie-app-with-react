import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fetchFavoriteMovies } from '@/firebase/favorites'
import { Helmet } from 'react-helmet-async'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { toastOptions } from '@/config/toastOptions'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const auth = getAuth()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            toast.success('Login succeed! 🎉', toastOptions)
            navigate('/')
        }
        catch (error) {
            toast.error('Login failed! ❌' + error.message, toastOptions)
        }

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) fetchFavoriteMovies(user.uid)
            })

            return () => unsubscribe()
        }, [])
    }
    return (
        <>
            <Helmet>
                <title>Login | MovieApp</title>
            </Helmet>
            <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
                <form onSubmit={handleLogin} className='bg-white p-6 rounded-lg shadow-md w-full max-w-sm'>
                    <h2 className='text-2xl font-bold mb-4 text-center'>log In</h2>
                    <input type='email' placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)}
                        className='w-full p-2 border rounded mb-4' required
                    />
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}
                        className='w-full p-2 border rounded mb-4' required
                    />
                    <button type='submit' className='w-full bg-green-600 rounded hover:bg-green-700 text-white py-2'>
                        log In
                    </button>
                    <p className='mt-4 text-center text-sm'>
                        Don't have an account?{" "}
                        <Link to="/register" className='text-blue-600 hover:underline'>Sign Up</Link>
                    </p>
                </form>
            </div>
        </>
    )
}

export default Login