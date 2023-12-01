import React, { useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';

//Main Page after login/signup

function Home() {

    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const { username } = useParams();
    const [processedColors, setProcessedColors] = useState(null);

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
        .then(response => {
            if (response.status === 200) {
                // If the response status is 200 (OK), log success
                console.log('Success:', response);
            } else if (response.status === 400) {
                // If the response status is 400 (Bad Request), handle the error
                return response.json();
            } else {
                // Handle other response statuses here if needed
                throw new Error('Unexpected error');
            }
        })
        .then(data => {
            // Handle the data in case of a 400 response
            if (data) {
                console.error('Error:', data.message);
                // Display an alert to change to another name
                alert(`Error: ${data.message}. Please choose another name.`);
            }
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
    
    const navigate = useNavigate();

    const handleCloudButtonClick = () => {
        navigate(`/images/${username}`);
    };

    function classifyColors(colors, maxColors) {
        const colorArray = Array.from(colors).map(colorStr => {
            const match = colorStr.match(/\d+/g);
            return match ? match.map(Number) : [0, 0, 0];
        });
        const centers = colorArray.slice(0, maxColors);
        let assignments = new Array(colorArray.length).fill(0);
    
        let changed = true;
        while (changed) {
            changed = false;
            for (let i = 0; i < colorArray.length; i++) {
                let minDist = Infinity;
                let closest = 0;
                for (let j = 0; j < centers.length; j++) {
                    const dist = euclideanDistance(colorArray[i], centers[j]);
                    if (dist < minDist) {
                        minDist = dist;
                        closest = j;
                    }
                }
                if (assignments[i] !== closest) {
                    assignments[i] = closest;
                    changed = true;
                }
            }
            if (changed) {
                for (let i = 0; i < centers.length; i++) {
                    let sum = [0, 0, 0];
                    let count = 0;
                    for (let j = 0; j < colorArray.length; j++) {
                        if (assignments[j] === i) {
                            sum[0] += colorArray[j][0];
                            sum[1] += colorArray[j][1];
                            sum[2] += colorArray[j][2];
                            count++;
                        }
                    }
                    if (count > 0) {
                        centers[i] = sum.map(v => Math.round(v / count));
                    }
                }
            }
        }
        return centers.map(c => `rgb(${c[0]}, ${c[1]}, ${c[2]})`);
    }
    function euclideanDistance(color1, color2) {
        return Math.sqrt(
            Math.pow(color1[0] - color2[0], 2) +
            Math.pow(color1[1] - color2[1], 2) +
            Math.pow(color1[2] - color2[2], 2)
        );
    }
    
    const handleProcessImage = () => {
        const img = new Image();
        img.src = image;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
    
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            const colorSet = new Set();
    
            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                
                const colorStr = `rgb(${r}, ${g}, ${b})`;
                colorSet.add(colorStr);
            }
            
            const colorList = Array.from(colorSet);
            const classifiedColors = classifyColors(colorList, 300);
            setProcessedColors(classifiedColors);
        };
    };

    // TODO: Change pallete to resizeble box
    return (
        <div className='MainPage'>
            <h1>Welcome to Home page {username}</h1>
            <input type='file' accept='image/*' id='fileUpload' onChange={handleImageUpload} style={{display: 'none'}} />
            <label htmlFor='fileUpload' style={{cursor: 'pointer'}}>Upload Image</label>
            <button class="button" onClick={handleCloudButtonClick}>Cloud</button>
            {image && (
                <div style={{width: '500px', height: '500px'}}>
                    <img src={image} alt='Uploaded' style={{maxWidth: '100%', maxHeight: '100%'}} />
                </div>
            )}
            {image && <button class="button" onClick={handleDownload}>Download Image</button>}
            {image && <button class="button" onClick={handlePixelate}>Pixelate Image</button>}
            {image && <button class="button" onClick={handleProcessImage}>Process Image</button>}
            {image && <button class="button" onClick={uploadImageToServer}>Save Image to Server</button>}
            {image && <input type="text" id="imageName" name="imageName" placeholder="Type image name here" value={imageName} onChange={handleImageName}></input>}
            {image && <button class="button" onClick={() => window.location.href=`/images/${username}`}>View Images</button>}
            {processedColors && (
                <div>
                    <h2>Extracted Colors</h2>
                    <ul>
                        {Object.entries(processedColors).map(([color, id]) => (
                            <li key={id} style={{color: color}}>
                                {color} (ID: {id})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Home;

