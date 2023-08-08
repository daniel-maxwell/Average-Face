var imgs = [];
var avgImg;
var numOfImages = 30;
var currentImgIndex;
var avgPixels = [];

//////////////////////////////////////////////////////////
function preload() {
    for (let i = 0; i < numOfImages; i++) {
        fileName = "assets/" + i + ".jpg";
        imgs.push(loadImage(fileName));
    }
}
//////////////////////////////////////////////////////////
function setup() {
    createCanvas(imgs[0].width * 2, imgs[0].height);
    pixelDensity(1);
    avgImg = createGraphics(imgs[0].width, imgs[0].height);
    
    computeAverageImage(); // Compute the average image once in setup to improve performance
    
    // Store average pixel values
    avgImg.loadPixels();
    for (let i = 0; i < avgImg.pixels.length; i++) {
        avgPixels.push(avgImg.pixels[i]);
    }

    // Select a random image from the array
    currentImgIndex = Math.floor(random(numOfImages));
}

//////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgs[currentImgIndex], 0, 0);
    transitionImage();
    image(avgImg, imgs[0].width, 0);
}

//////////////////////////////////////////////////////////
function keyPressed() {
    // Select a random image from the array
    currentImgIndex = Math.floor(random(numOfImages));
}

//////////////////////////////////////////////////////////
// Compute the average image
function computeAverageImage() {
    for (let i = 0; i < numOfImages; i++) {
        imgs[i].loadPixels();
    }
    avgImg.loadPixels();

    for (let y = 0; y < imgs[0].height; y++) {
        for (let x = 0; x < imgs[0].width; x++) {

            // Get the index of the pixel
            let index = (x + y * imgs[0].width) * 4;

            let sumR = 0;
            let sumG = 0;
            let sumB = 0;
            // Sum the RGB values of each image
            for (let i = 0; i < numOfImages; i++) {
                sumR += imgs[i].pixels[index];
                sumG += imgs[i].pixels[index + 1];
                sumB += imgs[i].pixels[index + 2];
            }
            // Calculate the average RGB values
            avgImg.pixels[index] = sumR / numOfImages;
            avgImg.pixels[index + 1] = sumG / numOfImages;
            avgImg.pixels[index + 2] = sumB / numOfImages;
            avgImg.pixels[index + 3] = 255;
        }
    }
    avgImg.updatePixels();
}

//////////////////////////////////////////////////////////
function transitionImage() {
    imgs[currentImgIndex].loadPixels();
    avgImg.loadPixels();

    for (let y = 0; y < imgs[0].height; y++) {
        for (let x = 0; x < imgs[0].width; x++) {

            // Get the index of the pixel
            let index = (x + y * imgs[0].width) * 4;

            // Get the original and average RGB values
            const originalRGB = createVector(imgs[currentImgIndex].pixels[index], imgs[currentImgIndex].pixels[index + 1], imgs[currentImgIndex].pixels[index + 2]);
            
            // Get the average RGB values from the average image
            const avgRGB = createVector(avgPixels[index], avgPixels[index + 1], avgPixels[index + 2]);
            
            // Calculate the transition vector
            const transitionRGB = calcTransition(originalRGB, avgRGB);

            // Update the average image
            avgImg.pixels[index] = transitionRGB.x;
            avgImg.pixels[index + 1] = transitionRGB.y;
            avgImg.pixels[index + 2] = transitionRGB.z;
        }
    }
    avgImg.updatePixels();
}

//////////////////////////////////////////////////////////
// Calculate the transition vector
function calcTransition(originalVector, avgVector) {
    // Map the mouse position to a value between 0 and 1
    let t = map(mouseX, 0, width, 0, 1);

    // Constrain the value between 0 and 1
    t = constrain(t, 0, 1);

    // Calculate the transition vector
    let transitionVector = p5.Vector.lerp(originalVector, avgVector, t);

    return transitionVector;
}