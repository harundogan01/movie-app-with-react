import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import useAuth from '@/firebase/useAuth'
import { toast } from 'react-toastify'
import { tmdbConfig, firebaseConfig } from '@/firebase/config'
import axios from 'axios'
import { toastOptions } from '@/config/toastOptions'

const Navbar = ({ onSearch, onCategoryChange, onFavoritesClick }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [genres, setGenres] = useState([])

    const navigate = useNavigate()
    const auth = getAuth()
    const user = useAuth().user

    const handleSearch = (e) => {
        e.preventDefault()
        onSearch(searchTerm)
    }

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await axios.get(
                    `${tmdbConfig.tmdbUrl}/genre/movie/list?api_key=${tmdbConfig.apiKey}`
                )
                setGenres(res.data.genres)
            }
            catch (error) {
                toast.error("Couldn't reach the categories! ❌" + error.message, toastOptions)
            }
        }

        fetchGenres()
    }, [])

    const handleClick = () => {
        if (user) {
            signOut(auth).then(() => {
                window.history.replaceState(null, "", "/login")
                navigate('/login')
            })
        }
        else navigate('/login')
    }

    return (
        <>
            <nav className='bg-white shadow sticky top-0 z-50'>
                <div className='mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4'>
                    <Link to="/" className='text-xl font-bold text-blue-600'>
                        🎬 Movie App
                    </Link>
                    <form onSubmit={handleSearch} className='flex items-center gap-2 w-full md:w-auto'>
                        <input type='text' placeholder='Search a movie...' value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='border rounded px-3 py-1 w-full md:w-64'
                        />
                        <button type='submit' className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700'>
                            🔍 <span className='2xs:hidden md:inline'>Search</span>
                        </button>
                    </form>
                    <select onChange={e => onCategoryChange(e.target.value)} className='border px-3 py-1 rounded w-full md:w-auto'>
                        <option value="">Choose a category</option>
                        {genres.map(genre => (
                            <option key={genre.id} value={genre.id}>{genre.name}</option>
                        ))}
                    </select>
                    <div className='gap-2 flex'>
                        {user && (
                            <button type='button' onClick={onFavoritesClick}
                            className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700'>
                                Favorites
                            </button>
                        )}
                        <button type='submit' onClick={() => handleClick()}
                        className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700'>
                            { user ? 'Logout' : 'Login'}
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar