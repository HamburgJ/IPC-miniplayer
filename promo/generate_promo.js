const { createCanvas } = require('canvas');
const fs = require('fs');

// Simplified color palette
const colors = {
    gradientStart: '#1976d2',  // Material Blue
    gradientEnd: '#0d47a1',    // Darker Blue
    accent: '#42a5f5',         // Light Blue
    highlight: 'rgba(255, 255, 255, 0.15)',
    text: '#ffffff',
    shadow: 'rgba(0, 0, 0, 0.3)'
};

// Helper function to create gradient
function createGradient(ctx, x, y, width, height) {
    const gradient = ctx.createLinearGradient(x, y, width, height);
    gradient.addColorStop(0, colors.gradientStart);
    gradient.addColorStop(1, colors.gradientEnd);
    return gradient;
}

// Function to draw decorative circle
function drawCircle(ctx, x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = colors.highlight;
    ctx.fill();
}

// Function to draw modern PiP window
function drawPiPWindow(ctx, x, y, scale = 1) {
    const width = 160 * scale;
    const height = 100 * scale;
    
    // Main window with camera feed
    ctx.fillStyle = colors.accent;
    ctx.shadowColor = colors.shadow;
    ctx.shadowBlur = 15 * scale;
    ctx.shadowOffsetX = 5 * scale;
    ctx.shadowOffsetY = 5 * scale;
    
    // Window frame
    ctx.fillRect(x, y, width, height);
    
    // PiP window
    const pipWidth = width * 0.4;
    const pipHeight = height * 0.5;
    ctx.fillStyle = colors.gradientEnd;
    ctx.fillRect(x + width - pipWidth - 10 * scale, 
                y + height - pipHeight - 10 * scale, 
                pipWidth, pipHeight);
    
    // Window controls
    ctx.fillStyle = colors.highlight;
    ctx.beginPath();
    [1, 2, 3].forEach(i => {
        ctx.arc(x + (15 * i) * scale, y + 15 * scale, 3 * scale, 0, Math.PI * 2);
    });
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

// Function to create the small promo tile (440x280)
function createSmallPromo() {
    const canvas = createCanvas(440, 280);
    const ctx = canvas.getContext('2d');

    // Background gradient
    ctx.fillStyle = createGradient(ctx, 0, 0, 440, 280);
    ctx.fillRect(0, 0, 440, 280);

    // Decorative circles
    drawCircle(ctx, 380, 60, 50);
    drawCircle(ctx, 40, 240, 30);

    // Modern PiP window
    drawPiPWindow(ctx, 50, 80, 0.9);

    // Add text with enhanced styling
    ctx.fillStyle = colors.text;
    ctx.shadowColor = colors.shadow;
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.font = 'bold 28px "Segoe UI", Arial';
    ctx.fillText('IPC Smart Life', 50, 50);
    
    ctx.font = '20px "Segoe UI", Arial';
    ctx.fillText('Mini-Player', 50, 220);
    
    ctx.font = '16px "Segoe UI", Arial';
    ctx.fillText('Picture-in-Picture Mode', 50, 250);

    return canvas;
}

// Function to create the large promo tile (1400x560)
function createLargePromo() {
    const canvas = createCanvas(1400, 560);
    const ctx = canvas.getContext('2d');

    // Background gradient
    ctx.fillStyle = createGradient(ctx, 0, 0, 1400, 560);
    ctx.fillRect(0, 0, 1400, 560);

    // Decorative circles
    drawCircle(ctx, 1200, 150, 120);
    drawCircle(ctx, 200, 450, 80);
    drawCircle(ctx, 1300, 400, 60);

    // Modern PiP window
    drawPiPWindow(ctx, 100, 160, 1.8);

    // Add text with enhanced styling
    ctx.fillStyle = colors.text;
    ctx.shadowColor = colors.shadow;
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    ctx.font = 'bold 56px "Segoe UI", Arial';
    ctx.fillText('IPC Smart Life Mini-Player', 100, 100);

    ctx.shadowBlur = 10;
    ctx.font = '36px "Segoe UI", Arial';
    ctx.fillText('Enhanced Viewing Experience', 100, 440);

    ctx.shadowBlur = 8;
    ctx.font = '28px "Segoe UI", Arial';
    ctx.fillText('Picture-in-Picture Mode for Your Camera Feeds', 100, 480);

    return canvas;
}

// Generate and save both images
const smallPromo = createSmallPromo();
const largePromo = createLargePromo();

fs.writeFileSync('promo/small_promo.png', smallPromo.toBuffer('image/png'));
fs.writeFileSync('promo/large_promo.png', largePromo.toBuffer('image/png'));

console.log('Enhanced promotional images generated successfully!'); 