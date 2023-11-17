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

    return (
        <div className='MainPage'>
            <h1>Welcome to Home page</h1>
            <input type='file' accept='image/*' id='fileUpload' onChange={handleImageUpload} style={{display: 'none'}} />
            <label htmlFor='fileUpload' style={{cursor: 'pointer'}}>Upload Image</label>
            {image && <img src={image} alt='Uploaded for editing' />}
        </div>
    );
}

export default Home;
