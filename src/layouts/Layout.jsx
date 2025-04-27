import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import FavoritesModal from '@/components/FavoritesModal'
import useAuth from '@/firebase/useAuth'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase/firebase'

const Layout = () => {
    const [showFavoritesModal, setShowFavoritesModal] = useState(false)
    const [selectedCategory, setSelectedCategory ] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [favorites, setFavorites] = useState([])
    const user = useAuth().user

    const handleFavoritesToggle = (value) => {
        setShowFavoritesModal(value)
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
    }

    const handleCategoryChange = (category) => {
        setSelectedCategory(category)
    }

    const refreshFavorites = async () => {
        if (!user) return
        const userRef = doc(db, "favorites", user.uid)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) setFavorites(userDoc.data().movies || [])
        else setFavorites([])
    }

    return (
        <>
            <Navbar onSearch={handleSearch} onCategoryChange={handleCategoryChange} onFavoritesClick={() => handleFavoritesToggle(true)} />
            <main>
                <Outlet context={{ searchQuery, selectedCategory, favorites, refreshFavorites }} />
            </main>
            { showFavoritesModal && <FavoritesModal open={showFavoritesModal} favorites={favorites} 
                onClose={() => handleFavoritesToggle(false)} refreshFavorites={refreshFavorites}
            />}
        </>
    )
}

export default Layout