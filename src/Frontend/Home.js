import React, { useState, useEffect } from 'react';
import { useParams , useNavigate, useLocation } from 'react-router-dom';
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
    const [blendColor, setBlendColor] = useState({ r: 255, g: 255, b: 255 }); // j
    const [innerRadius, setInnerRadius] = useState(150); //j
    const [innerScale, setInnerScale] = useState(10); //j
    const [outerScale, setOuterScale] = useState(20); //j
    const location = useLocation();
    const navigate = useNavigate();
    const [canClick, setCanClick] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const imageName = queryParams.get('imageName');

        if (imageName) {
            fetch(`http://localhost:8003/getImageData/${username}?imageName=${imageName}`)
                .then(response => response.json())
                .then(data => {
                    setImage(data.imageData.imageData);
                })
                .catch(error => console.error('Error:', error));
        }
    }, [location, username]);
    
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
                setPixelImage(null);
                setTransformationApplied(false);
            };
        });
    };

    const uploadImageToServer = () => {
        if ( (transformationApplied ? pixelImage : image) && imageName){
            fetch('http://localhost:8002/uploadimage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                imageName: imageName,
                image: (transformationApplied ? pixelImage : image),
            }),
        })
        .then(response => {
            if (response.status === 200) {
                console.log('Success:', response);
                alert(`Image ${imageName} was successfully uploaded to the server! You can view it in the Gallery.`);
            } else if (response.status === 400) {
                return response.json();
            } else {
                throw new Error('Unexpected error');
            }
        })
        .then(data => {
            if (data) {
                console.error('Error:', data.message);
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

    const handleImageName = (event) => {
        setImageName(event.target.value);
    }
    

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
    /*
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
    };*/
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
        setCanClick(false);
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
        setCanClick(true);
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
        setCanClick(true);
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
        img.src = transformationApplied ? pixelImage : image;
        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            circleBasedPixelization(ctx, img, innerRadius, innerScale, outerScale);
            const pixelatedDataUrl = canvas.toDataURL();
            setPixelImage(pixelatedDataUrl);
            setTransformationApplied(true);
        };
        img.onerror = () => {
            console.error("Error loading image for circular pixelation");
        };
        setCanClick(true);
    };

    function circleBasedPixelization(ctx, img, innerRadius, innerScale, outerScale) {
        const width = img.width;
        const height = img.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radiusSquared = innerRadius * innerRadius;
    
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
    
        function isInsideCircle(x, y) {
            const dx = x - centerX;
            const dy = y - centerY;
            return dx * dx + dy * dy <= radiusSquared;
        }
    
        function applyPixelization(startX, startY, scale) {
            let sums = [0, 0, 0];
            let count = 0;
    
            for (let i = 0; i < scale; i++) {
                for (let j = 0; j < scale; j++) {
                    const x = startX + i;
                    const y = startY + j;
                    if (x < width && y < height) {
                        const index = (y * width + x) * 4;
                        sums[0] += data[index];
                        sums[1] += data[index + 1];
                        sums[2] += data[index + 2];
                        count++;
                    }
                }
            }
    
            if (count > 0) {
                const avg = sums.map(s => s / count);
                for (let i = 0; i < scale; i++) {
                    for (let j = 0; j < scale; j++) {
                        const x = startX + i;
                        const y = startY + j;
                        if (x < width && y < height) {
                            const index = (y * width + x) * 4;
                            data[index] = avg[0];
                            data[index + 1] = avg[1];
                            data[index + 2] = avg[2];
                        }
                    }
                }
            }
        }
    
        for (let x = 0; x < width; x += outerScale) {
            for (let y = 0; y < height; y += outerScale) {
                if (!isInsideCircle(x + outerScale / 2, y + outerScale / 2)) {
                    applyPixelization(x, y, outerScale);
                }
            }
        }
    
        for (let x = 0; x < width; x += innerScale) {
            for (let y = 0; y < height; y += innerScale) {
                if (isInsideCircle(x + innerScale / 2, y + innerScale / 2)) {
                    applyPixelization(x, y, innerScale);
                }
            }
        }
    
        for (let x = 0; x < width; x += innerScale) {
            for (let y = 0; y < height; y += innerScale) {
                const inside = isInsideCircle(x, y);
                const rightEdge = isInsideCircle(x + innerScale, y) !== inside;
                const bottomEdge = isInsideCircle(x, y + innerScale) !== inside;
    
                if (rightEdge || bottomEdge) {
                    applyPixelization(x, y, innerScale);
                }
            }
        }
    
        ctx.putImageData(imageData, 0, 0);
    }
    

// 2

const handleColorPixelization = () => {
    const img = new Image();
    img.src = transformationApplied ? pixelImage : image;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        
        // Convert color state to array [r, g, b]
        const colorArray = [blendColor.r, blendColor.g, blendColor.b];
        colorPixelization(ctx, img, blockSize, colorArray);
        
        const pixelatedDataUrl = canvas.toDataURL();
        setPixelImage(pixelatedDataUrl);
        setTransformationApplied(true);
    };
    img.onerror = () => {
        console.error("Error loading image for color pixelation");
    };
    setCanClick(true);
};

function colorPixelization(ctx, img, scale, color) {
    const width = img.width;
    const height = img.height;
    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const factor = 1; // Assuming factor is globally defined elsewhere in your code

    for (let i = 0; i < width; i += scale) {
        for (let j = 0; j < height; j += scale) {
            let sums = [0, 0, 0];
            let count = 0;

            // Collect pixel data within the block
            for (let x = i; x < i + scale && x < width; x++) {
                for (let y = j; y < j + scale && y < height; y++) {
                    let index = (y * width + x) * 4;
                    sums[0] += data[index];     // R
                    sums[1] += data[index + 1]; // G
                    sums[2] += data[index + 2]; // B
                    count++;
                }
            }

            // Calculate average color and apply the blend with specified color
            if (count > 0) {
                let avgColor = sums.map((s, k) => {
                    let avgComponent = s / count;
                    avgComponent = avgComponent + (color[k] - avgComponent) / 4;
                    return Math.min(Math.round(avgComponent * factor), 255);
                });

                // Apply the average blended color to the block
                for (let x = i; x < i + scale && x < width; x++) {
                    for (let y = j; y < j + scale && y < height; y++) {
                        let index = (y * width + x) * 4;
                        data[index] = avgColor[0];     // R
                        data[index + 1] = avgColor[1]; // G
                        data[index + 2] = avgColor[2]; // B
                    }
                }
            }
        }
    }

    // Put the modified image data back on the canvas
    ctx.putImageData(imageData, 0, 0);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex({ r, g, b }) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

//3
const handleNavigate = () => {
    navigate('/script', { state: { image: pixelImage, data: blockSize } });
  };
    
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
        
    return (
        <div className='MainPage'>
            <img src={logo} alt="Logo" className="App-logo-small" style={{maxWidth: '10%', maxHeight: '10%'}}></img>
            <h1>Hi {username}, Welcome to our Pixel World!</h1>
            <div className="introduction-container">
                <h3>Tips:</h3>
                <p className="Introduction">Let's begin your artwork. First, select an image to upload using the upload button.</p> 
                <p className="Introduction">After you upload the image, you have a few options on how to pixelize your image. If you don't want the current changes, you can always click "Discard Changes" to go back to the original image that you uploaded. Lastly, remember to save your artwork to the server with a unique image name so you can view it in the Gallery!</p>
                <p className="Introduction">1. You can pixelize your image selecting a blocksize.</p>
                <p className="Introduction">2. You can apply black and white effect.</p> 
                <p className="Introduction">3. Apply a color filter of your choice</p>
                <p className="Introduction">4. And even choose to create a circlular focusing effect in the center of the image.</p>
                <p className="Introduction">After pixelizing your image, you can click 'Paint by Number' to enter a coloring game!</p>
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

                    {(image || pixelImage) && <button title="Click to pixelate the image" className="feature-button" onClick={handlePixelate}>Pixelate Image</button>}
                    {(image || pixelImage) && <button title="Click to make this image black and white" className="feature-button" onClick={handlePixelateBW}>Black & White</button>}
                    {(image || pixelImage) && <button title="Select color in Color button and render this image" className="feature-button" onClick={handleColorPixelization}>Color</button>}
                    {(image || pixelImage) && <button title="Click to circle pixelate the image" className="feature-button" onClick={handleCircleBasedPixelization}>Circular</button>}
                    {(image || pixelImage) && <button title="Click to enter coloring game" className="feature-button" onClick={handleNavigate} disabled={!canClick}>Paint by Number</button>}
                </div>
                {(image || pixelImage) && (
                    <div className="control-panel">
                        <div className="slider-container">
                            <label htmlFor="innerRadiusSlider">Radius (0 - 300): {innerRadius}</label>
                            <input 
                            id="innerRadiusSlider"
                            type="range" 
                            min="0" 
                            max="300" 
                            value={innerRadius} 
                            onChange={(e) => setInnerRadius(Number(e.target.value))}
                            />
                            </div>
                        <div className="slider-container">
                            <label htmlFor="innerScaleSlider">Inner Scale (1 - 100): {innerScale}</label>
                            <input 
                            id="innerScaleSlider"
                            type="range" 
                            min="1" 
                            max="100" 
                            value={innerScale} 
                            onChange={(e) => setInnerScale(Number(e.target.value))}
                            />
                        </div>
                        <div className="slider-container">
                            <label htmlFor="outerScaleSlider">Outer Scale (1 - 200): {outerScale}</label>
                            <input 
                            id="outerScaleSlider"
                            type="range" 
                            min="1" 
                            max="200" 
                            value={outerScale} 
                            onChange={(e) => setOuterScale(Number(e.target.value))}
                            />
                        </div>
                        <div className="slider-container">
                            <label htmlFor="blockSizeSlider">Block Size (1 - 100): {blockSize}</label>
                            <input 
                                id="blockSizeSlider"
                                type="range" 
                                min="1" 
                                max="100" 
                                value={blockSize} 
                                onChange={(e) => setBlockSize(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            {(image || pixelImage) && (
                                <label title="Choose a color to blend with" className="feature-button">
                                    Blend Color: 
                                    <input 
                                    type="color" 
                                    onChange={(e) => setBlendColor(hexToRgb(e.target.value))} 
                                    value={rgbToHex(blendColor)}
                                    className="selected-color-display"
                                    style={{ 
                                        width: '20px', 
                                        height: '20px',
                                        marginLeft: '10px', 
                                        backgroundColor: rgbToHex(blendColor),}}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                    )}
            </div>

            {(image || pixelImage) && <button class="feature-button" onClick={handleDownload}>Download Image</button>}
            
            {(image || pixelImage) && <button class="feature-button" onClick={uploadImageToServer}>Save Image to Server</button>}
            {(image || pixelImage) && <button class="feature-button" onClick={DiscardChange}>Discard Changes</button>}
            {(image || pixelImage) && <input type="text" id="imageName" name="imageName" placeholder="Type image name here" value={imageName} onChange={handleImageName}></input>}
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

