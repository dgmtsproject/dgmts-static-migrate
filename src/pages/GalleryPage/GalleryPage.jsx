import { useState } from 'react';
import './GalleryPage.css';

const images = import.meta.glob('/src/assets/gallery/*.{png,jpg,jpeg,svg}');

const imagePaths = Object.keys(images).map(path => {
    const url = new URL(path, import.meta.url).href;
    return {
        src: url,
        alt: path.split('/').pop()
    };
});

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState(null);

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