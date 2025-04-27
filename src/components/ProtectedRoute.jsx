import { Navigate } from 'react-router-dom'
import useAuth from '@/firebase/useAuth'

const ProtectedRoute = ({ children }) => {
    const user = useAuth()

    if (user === null) return <Navigate to="/login" replace />

    return children
}

export default ProtectedRoute