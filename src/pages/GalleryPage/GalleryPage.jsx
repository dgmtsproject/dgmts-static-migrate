import { useState } from 'react';
import './GalleryPage.css';

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState(null);

    // Generate image paths using a loop
    const imagePaths = [];
    for (let i = 35; i <= 111; i++) {
        imagePaths.push({
            src: `/gallery/photo-${i}.jpg`,
            alt: `Photo ${i}`
        });
    }

    const openModal = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="gallery-page">
            <section className="gallery-hero">
                <div className="container">
                    <h1 className="gallery-title">Our Gallery</h1>
                    <p className="gallery-subtitle">A collection of moments and projects that define us.</p>
                </div>
            </section>
            <section className="gallery-grid-section">
                <div className="container">
                    <div className="gallery-grid">
                        {imagePaths.map((image, index) => (
                            <div key={index} className="gallery-item" onClick={() => openModal(image)}>
                                <img src={image.src} alt={image.alt} loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {selectedImage && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-modal" onClick={closeModal}>&times;</span>
                        <img src={selectedImage.src} alt={selectedImage.alt} />
                    </div>
                </div>
            )}
        </div>
    );
}