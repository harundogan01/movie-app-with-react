const SkeletonCard = () => {
    return (
        <>
            <div className="animate-pulse rounded-lg bg-white shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300">
                    <div className="p-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-300 rounded w-1/2" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SkeletonCard