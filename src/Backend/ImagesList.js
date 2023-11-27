import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ImagesList() {
    const [images, setImages] = useState([]);
    const { username } = useParams();
    useEffect(() => {
        fetch(`http://localhost:8003/getimages?username=${username}`)
            .then(response => response.json())
            .then(data => setImages(data))
            .catch(error => console.error('Error:', error));
    }, [username]); // 添加 username 作为依赖项

    return (
        <div>
            <h1>Images Gallery for {username} </h1>
            <div>
                {images.map((image, index) => (
                    // 确保 imageData 字段包含了完整的图片数据
                    <img key={index} src={`data:images/jpeg;base64,${image.imageData}`} alt={`Uploaded by ${image.username}`} />
                ))}
            </div>
        </div>
    );
}

export default ImagesList;