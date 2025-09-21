"use client"
import { useCallback, useEffect, useState } from 'react'
import "./style.scss"


const FullScreen = ({ open, close, images, initialIdx = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIdx)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (open) {
            setCurrentIndex(initialIdx)
            setLoading(true)
        }
    }, [open, initialIdx])

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setLoading(true)
    }, [images.length])

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setLoading(true);
    }, [images.length]);

    const goToSlide = useCallback((index) => {
        setCurrentIndex(index);
        setLoading(true);
    }, []);

    useEffect(() => {

        const handleKey = (e) => {
            if (!open) return

            switch (e.key) {
                case "Escape":
                    close()
                    break
                case "ArrowLeft":
                    handlePrev()
                    break
                case "ArrowRight":
                    handleNext()
                    break
                default:
                    break;
            }
        }

        document.addEventListener('keydown', handleKey);

        if (open) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = 'unset';
        };
    }, [open, close, handleNext, handlePrev])

    const handleImageLoad = () => {
        setLoading(false)

    }

    if (!open || !images || images.length === 0) return null

    const currentImage = images[currentIndex]



    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
            onClick={close}
        >
            {/* Close button */}
            <button
                onClick={close}
                className="absolute top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-full"
                aria-label="Close fullscreen slider"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Main image container */}
            <div
                className="relative flex items-center justify-center w-full h-full px-16"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Loading spinner */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                )}

                {/* Current Image */}
                <img
                    src={currentImage?.src}
                    alt=""
                    className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'
                        }`}
                    style={{ maxHeight: '85vh', maxWidth: '85vw' }}
                    onLoad={handleImageLoad}
                    onError={handleImageLoad}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        {/* Previous button */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-3 hover:bg-white hover:bg-opacity-10 rounded-full"
                            aria-label="Previous image"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15,18 9,12 15,6"></polyline>
                            </svg>
                        </button>

                        {/* Next button */}
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-3 hover:bg-white hover:bg-opacity-10 rounded-full"
                            aria-label="Next image"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9,18 15,12 9,6"></polyline>
                            </svg>
                        </button>
                    </>
                )}
            </div>

        

            {/* Thumbnail strip (for multiple images) */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 p-2 rounded-lg max-w-full overflow-x-auto">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${index === currentIndex
                                    ? 'border-white shadow-lg'
                                    : 'border-transparent hover:border-gray-400'
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        >
                            <img
                                src={image.thumbnail || image.src}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FullScreen
