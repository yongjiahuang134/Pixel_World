import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

//Main Page after login/signup


function Home() {
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const { username } = useParams();

    // const handleImageUpload = (event) => {
    //     const file = event.target.files[0];
    //     const reader = new FileReader();

    //     reader.onloadend = () => {
    //         setImage(reader.result);
    //     }

    //     reader.readAsDataURL(file);
    // }

    const compressImage = (file, maxWidth, maxHeight, callback) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }

                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(callback, 'image/jpeg', 0.7);
            };
        };
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        compressImage(file, 1024, 1024, blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                setImage(reader.result);
            };
        });
    };

    const uploadImageToServer = () => {
        if (image && imageName){
            fetch('http://localhost:8002/uploadimage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                imageName: imageName,
                image: image,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        } else {
            alert("You need to enter Image name!");      
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'download.png';
        link.click();
    }

    const handlePixelate = () => {
        // Call the external function here and pass the image to it
        // pixelateImage(image);
        return;
    }

    const handleImageName = (event) => {
        setImageName(event.target.value);
    }

    // TODO: Change pallete to resizeble box
    return (
        <div className='MainPage'>
            <h1>Welcome to Home page {username}</h1>
            <input type='file' accept='image/*' id='fileUpload' onChange={handleImageUpload} style={{display: 'none'}} />
            <label htmlFor='fileUpload' style={{cursor: 'pointer'}}>Upload Image</label>
            {image && (
                <div style={{width: '500px', height: '500px'}}>
                    <img src={image} alt='Uploaded' style={{maxWidth: '100%', maxHeight: '100%'}} />
                </div>
            )}
            {image && <button onClick={handleDownload}>Download Image</button>}
            {image && <button onClick={handlePixelate}>Pixelate Image</button>}
            {image && <button onClick={uploadImageToServer}>Save Image to Server</button>}
            {image && <input type="text" id="imageName" name="imageName" placeholder="Type image name here" value={imageName} onChange={handleImageName}></input>}
            {image && <button onClick={() => window.location.href='/images'}>View Images</button>}
        </div>
    );
}

export default Home;

