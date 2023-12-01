import React, { useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import logo from './logo.jpg'

//Main Page after login/signup

function Home() {

    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const { username } = useParams();
    const [processedColors, setProcessedColors] = useState(null);
    const [blockSize, setBlockSize] = useState(30);
    const [pixelImage, setPixelImage] = useState(null);
    const [transformationApplied, setTransformationApplied] = useState(false);

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

    // const handlePixelate = () => {
    //     // Call the external function here and pass the image to it
    //     // pixelateImage(image);


    //     return;
    // }

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
    const pixelateImage = (ctx, img, blockSize) => {
        for (let x = 0; x < img.width; x += blockSize) {
            for (let y = 0; y < img.height; y += blockSize) {
                const averageColor = calculateAverageColor(ctx, x, y, blockSize, img.width, img.height);
                ctx.fillStyle = `rgba(${averageColor.r},${averageColor.g},${averageColor.b},${averageColor.a})`;
                ctx.fillRect(x, y, blockSize, blockSize);
            }
        }
    };
    
    const calculateAverageColor = (ctx, startX, startY, blockSize, width, height) => {
        let total = { r: 0, g: 0, b: 0, a: 0 };
        let count = 0;
    
        for (let x = 0; x < blockSize; x++) {
            for (let y = 0; y < blockSize; y++) {
                if ((startX + x < width) && (startY + y < height)) {
                    const imageData = ctx.getImageData(startX + x, startY + y, 1, 1).data;
                    total.r += imageData[0];
                    total.g += imageData[1];
                    total.b += imageData[2];
                    total.a += imageData[3];
                    count++;
                }
            }
        }
    
        // Ensure at least one pixel was counted to avoid division by zero
        count = count === 0 ? 1 : count;
    
        return {
            r: Math.round(total.r / count),
            g: Math.round(total.g / count),
            b: Math.round(total.b / count),
            a: Math.round(total.a / count)
        };
    };
    
    const DiscardChange = () => {
        setPixelImage(null);
        setTransformationApplied(false);
    }
    
    const handlePixelate = () => {
        const img1 = new Image();
        img1.src = image;
        if (image && blockSize > 0 && blockSize < img1.naturalWidth && blockSize < img1.naturalHeight) {
            const img = new Image();
            if (transformationApplied){
                img.src = pixelImage;
            }
            else{
                img.src = image;
            }
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
                
                pixelateImage(ctx, img, blockSize);
    
                const pixelatedDataUrl = canvas.toDataURL();
                setPixelImage(pixelatedDataUrl);
                setTransformationApplied(true);
            };
            img.onerror = () => {
                console.error("Error loading image for pixelation");
            };
        } else {
            alert("Block size must be a positive number.");
        }
    };

    // pixelate image with black and white: R, G, B --> average for each pixel
    const handlePixelateBW = () => {
        const img1 = new Image();
        img1.src = image;
        if (image && blockSize > 0 && blockSize < img1.naturalWidth && blockSize < img1.naturalHeight) {
            const img = new Image();
            if (transformationApplied){
                img.src = pixelImage;
            }
            else{
                img.src = image;
            }
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
                
                pixelateImageBW(ctx, img, 1);
    
                const pixelatedDataUrl = canvas.toDataURL();
                setPixelImage(pixelatedDataUrl);
                setTransformationApplied(true);
            };
            img.onerror = () => {
                console.error("Error loading image for pixelation");
            };
        } else {
            alert("Block size must be a positive number.");
        }
    };
    const pixelateImageBW = (ctx, img, blockSize) => {
        for (let x = 0; x < img.width; x += blockSize) {
            for (let y = 0; y < img.height; y += blockSize) {
                const averageColor = calculateAverageColorBW(ctx, x, y, blockSize, img.width, img.height);
                ctx.fillStyle = `rgba(${averageColor.r},${averageColor.g},${averageColor.b},${averageColor.a})`;
                ctx.fillRect(x, y, blockSize, blockSize);
            }
        }
    };

    // 1
const handleCircleBasedPixelization = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      circleBasedPixelization(ctx, img, 300, 30, 70); // Example values for innerRadius, innerScale, and outerScale
      const pixelatedDataUrl = canvas.toDataURL();
      setImage(pixelatedDataUrl);
    };
    img.onerror = () => {
      console.error("Error loading image for pixelation");
    };
  };

  function isInsideCircle(x, y, centerX, centerY, radius) {
    return (x - centerX) ** 2 + (y - centerY) ** 2 <= radius ** 2;
}

function circleBasedPixelization(ctx, img, innerRadius, innerScale, outerScale) {
    const width = img.width;
    const height = img.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusSquared = innerRadius * innerRadius;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Function to check if a point is within the inner circle
    function isInsideCircle(x, y) {
        const dx = x - centerX;
        const dy = y - centerY;
        return dx * dx + dy * dy <= radiusSquared;
    }

    // Function to apply pixelization
    function applyPixelization(startX, startY, endX, endY, scale) {
        for (let x = startX; x < endX; x += scale) {
            for (let y = startY; y < endY; y += scale) {
                let sums = [0, 0, 0];
                let count = 0;

                // Collect pixel data within the block
                for (let i = 0; i < scale; i++) {
                    for (let j = 0; j < scale; j++) {
                        if (x + i < width && y + j < height) {
                            const index = ((y + j) * width + (x + i)) * 4;
                            sums[0] += data[index];     // R
                            sums[1] += data[index + 1]; // G
                            sums[2] += data[index + 2]; // B
                            count++;
                        }
                    }
                }

                // Calculate and apply the average color to the block
                if (count > 0) {
                    const avg = sums.map(s => s / count);
                    for (let i = 0; i < scale; i++) {
                        for (let j = 0; j < scale; j++) {
                            if (x + i < width && y + j < height) {
                                const index = ((y + j) * width + (x + i)) * 4;
                                data[index] = avg[0];     // R
                                data[index + 1] = avg[1]; // G
                                data[index + 2] = avg[2]; // B
                            }
                        }
                    }
                }
            }
        }
    }

    // Apply pixelization to the inner circle first
    applyPixelization(0, 0, width, height, innerScale);

    // Apply pixelization to the area outside the inner circle
    for (let x = 0; x < width; x += outerScale) {
        for (let y = 0; y < height; y += outerScale) {
            // Check if the current block overlaps with the inner circle
            const overlapsInner = isInsideCircle(x, y) || isInsideCircle(x + outerScale, y) ||
                                  isInsideCircle(x, y + outerScale) || isInsideCircle(x + outerScale, y + outerScale);
            if (!overlapsInner) {
                applyPixelization(x, y, x + outerScale, y + outerScale, outerScale);
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}


// 2
    
    const calculateAverageColorBW = (ctx, startX, startY, blockSize, width, height) => {
        let total = { r: 0, g: 0, b: 0, a: 0 };
        let count = 0;
    
        for (let x = 0; x < blockSize; x++) {
            for (let y = 0; y < blockSize; y++) {
                if ((startX + x < width) && (startY + y < height)) {
                    const imageData = ctx.getImageData(startX + x, startY + y, 1, 1).data;
                    total.r += imageData[0];
                    total.g += imageData[1];
                    total.b += imageData[2];
                    total.a += imageData[3];
                    count++;
                }
            }
        }

        let average = 0;
        
        average = total.r + total.g + total.b;
        average /= 3;
        average = Math.round(average);
        total.r = average; total.b = average; total.g = average;

        count = count === 0 ? 1 : count;
    
        return {
            r: Math.round(total.r / count),
            g: Math.round(total.g / count),
            b: Math.round(total.b / count),
            a: Math.round(total.a / count)
        };
      
    };
        
    // TODO: Change pallete to resizeble box
    return (
        <div className='MainPage'>
            <img src={logo} alt="Logo" className="App-logo" style={{maxWidth: '10%', maxHeight: '10%'}}></img>
            <h1>Hi {username}, Welcome to our Pixel World!</h1>
            <div className="introduction-container">
                <p className="Introduction">Let's begin your artwork. First, select an image to upload using the upload button.</p> 
                <p className="Introduction">After you upload the image, you have a few options on how to pixelize your image. If you don't want the current changes, you can always click "Discard Changes" to go back to the original image that you uploaded. Lastly, remember to save your artwork to the server with a unique image name so you can view it in the Gallery!</p>
                <p className="Introduction">Enjoy your time here!</p>
            </div>
            
            <label htmlFor="fileUpload" className="feature-button">
                Upload Image
                <input type="file" accept="image/*" id="fileUpload" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
            <button class="feature-button" onClick={handleCloudButtonClick}>Gallery</button>
            <div className="image-container">
                <div className="imageWrap">
                    {(image || pixelImage) && (
                        <div style={{width: '500px', height: '500px'}}>
                            <img className="uploaded-image" src={transformationApplied ? pixelImage : image} alt='Uploaded' style={{maxWidth: '100%', maxHeight: '100%'}} />
                        </div>
                    )}
                </div>
        
                <div className="feature-buttons">

                    {(image || pixelImage) && <button className="feature-button" onClick={handlePixelate}>Pixelate Image</button>}
                    {(image || pixelImage) && <button className="feature-button" onClick={handlePixelateBW}>Black & White</button>}
                    {(image || pixelImage) && <button className="feature-button" onClick={handleCircleBasedPixelization}>Circular</button>}
                    {(image || pixelImage) && <button className="feature-button" onClick={handleProcessImage}>Process Image</button>}
                </div>
            </div>

            {(image || pixelImage) && <button class="feature-button" onClick={handleDownload}>Download Image</button>}
            {(image || pixelImage) && <input 
                    type="number" 
                    value={blockSize}
                    onChange={(e) => setBlockSize(Number(e.target.value))}
                    placeholder="Enter block size"
            />}
            {(image || pixelImage) && <button class="feature-button" onClick={uploadImageToServer}>Save Image to Server</button>}
            {(image || pixelImage) && <button class="feature-button" onClick={DiscardChange}>Discard Changes</button>}
            {(image || pixelImage) && <input type="text" id="imageName" name="imageName" placeholder="Type image name here" value={imageName} onChange={handleImageName}></input>}
            {(image || pixelImage) && <button class="feature-button" onClick={() => window.location.href=`/images/${username}`}>View Images</button>}
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

