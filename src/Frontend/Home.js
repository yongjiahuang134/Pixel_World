import React, { useState } from 'react';

//Main Page after login/signup


function Home() {
    const [image, setImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
        }

        reader.readAsDataURL(file);
    }

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'download.png';
        link.click();
    }

    // TODO: Change pallete to resizeble box
    return (
        <div className='MainPage'>
            <h1>Welcome to Home page</h1>
            <input type='file' accept='image/*' id='fileUpload' onChange={handleImageUpload} style={{display: 'none'}} />
            <label htmlFor='fileUpload' style={{cursor: 'pointer'}}>Upload Image</label>
            {image && <div style={{width: '500px', height: '500px'}}>
                <img src={image} alt='Uploaded for editing' style={{maxWidth: '100%', maxHeight: '100%'}} />
            </div>}
            {image && <button onClick={handleDownload}>Download Image</button>}
            
        </div>
    );
}

export default Home;

