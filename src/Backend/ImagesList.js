import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ImagesList() {
    const [images, setImages] = useState([]);
    const { username } = useParams();
    useEffect(() => {
        fetch('http://localhost:8003/getimages')
            .then(response => response.json())
            .then(data => setImages(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>Images Gallery for {username} </h1>
            <div>
                {images.map((image, index) => (
                    <img key={index} src={`data:image/jpeg;base64,${image.imageData}`} alt={`Uploaded by ${image.username}`} />
                ))}
            </div>
        </div>
    );
}

export default ImagesList;