const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function trimImage(inputPath, outputPath) {
    // Load the image
    const image = await loadImage(inputPath);
    
    // Create canvas with original dimensions
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    // Draw image to analyze pixels
    ctx.drawImage(image, 0, 0);
    
    // Get pixel data from left and right edges
    const leftEdge = ctx.getImageData(0, 0, 1, image.height).data;
    const rightEdge = ctx.getImageData(image.width - 1, 0, 1, image.height).data;
    
    // Calculate average brightness of each edge
    const getBrightness = (data) => {
        let total = 0;
        for (let i = 0; i < data.length; i += 4) {
            // Calculate luminance
            total += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        }
        return total / (data.length / 4);
    };
    
    const leftBrightness = getBrightness(leftEdge);
    const rightBrightness = getBrightness(rightEdge);
    
    console.log('Left edge brightness:', leftBrightness);
    console.log('Right edge brightness:', rightBrightness);
    
    // Create new canvas with correct dimensions
    const newCanvas = createCanvas(1280, 800);
    const newCtx = newCanvas.getContext('2d');
    
    // Draw image with appropriate offset
    if (leftBrightness < rightBrightness) {
        // Left edge is darker, remove it
        newCtx.drawImage(image, 1, 0, 1280, 800, 0, 0, 1280, 800);
        console.log('Removed darker left edge');
    } else {
        // Right edge is darker, remove it
        newCtx.drawImage(image, 0, 0, 1280, 800, 0, 0, 1280, 800);
        console.log('Removed darker right edge');
    }
    
    // Save the result
    const buffer = newCanvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync(outputPath, buffer);
    console.log(`Saved trimmed image to ${outputPath}`);
}

// Process the image
trimImage('screenshot.jpg', 'screenshot_trimmed.jpg')
    .catch(console.error); 