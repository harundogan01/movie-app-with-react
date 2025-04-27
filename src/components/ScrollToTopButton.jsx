import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            <button onClick={scrollToTop}
            className={`fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transform
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            style={{ transition: 'opacity 1s ease, transform 1s ease' }}>
                <ArrowUp size={20} />
            </button>
        </>
    )
}

export default ScrollToTopButton