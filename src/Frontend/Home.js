import React, { useState } from 'react';

//Main Page after login/signup


function Home() {
    const [image, setImage] = useState(null);

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
        fetch('http://localhost:8002/uploadimage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'username',
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

    // TODO: Change pallete to resizeble box
    return (
        <div className='MainPage'>
            <h1>Welcome to Home page</h1>
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
        </div>
    );
}

export default Home;

