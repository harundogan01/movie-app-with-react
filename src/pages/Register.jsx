import { useState } from 'react'
import { toast } from 'react-toastify'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { toastOptions } from '@/config/toastOptions'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const auth = getAuth()
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            navigate('/login')
            toast.success('Registration succeed! 🎉', toastOptions)
        }
        catch (error) {
            toast.error('Registration failed! ❌' + error.message, toastOptions)
        }
    }

    return (
        <>
            <Helmet>
                <title>Register | MovieApp</title>
            </Helmet>
            <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
                <form onSubmit={handleRegister} className='bg-white p-6 rounded-lg shadow-md w-full max-w-sm'>
                    <h2 className='text-2xl font-bold mb-4 text-center'>Sign Up</h2>
                    <input type='email' placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)}
                        className='w-full p-2 border rounded mb-4' required
                    />
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} 
                        className='w-full p-2 border rounded mb-4' required
                    />
                    <button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded'>
                        Sign Up
                    </button>
                    <p className='mt-4 text-center text-sm'>
                        Do you already have an account?{" "}
                        <Link to="/login" className='text-blue-600 hover:underline'>Log In</Link>
                    </p>
                </form>
            </div>
        </>
    )
}

export default Register