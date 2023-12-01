import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import logo from '../Frontend/logo.jpg'

function ImagesList() {
    const [images, setImages] = useState([]);
    const { username } = useParams();
    const location = useLocation();
    useEffect(() => {
        fetch(`http://localhost:8002/getimages/${username}`)
            .then(response => response.json())
            .then(data => setImages(data))
            .catch(error => console.error('Error:', error));
    }, [username, location]); 

    return (
        <div>
            <img src={logo} alt="Logo" className="App-logo" style={{maxWidth: '10%', maxHeight: '10%'}}></img>
            <h1>Hi {username}, Welcome to your Art Gallery!</h1>
            <div className="introduction-container">
                <h3>Tips:</h3>
                <p className="Introduction">You can click the image name to continue your work on this specific image!</p> 
            </div>
            <div className="Gallery">
                {images.map((image, index) => (
                    <div key={index} className="image-item">
                    <img src={`${image.imageData}`} alt={`Uploaded by ${image.username}`} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    <p>
                        Image: <Link to={`/home/${username}?imageName=${image.imageName}`}>{image.imageName}</Link>
                    </p>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default ImagesList;