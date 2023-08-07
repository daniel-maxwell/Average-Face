var imgs = [];
var avgImg;
var numOfImages = 30;
var currentImgIndex;

//////////////////////////////////////////////////////////
function preload() { // preload() runs once

    numOfImages = 30;
    for (let i = 0; i < numOfImages; i++) {
        fileName = "assets/" + i + ".jpg";
        imgs.push(loadImage(fileName));
        console.log(fileName);
    }
}
//////////////////////////////////////////////////////////
function setup() {
    createCanvas(imgs[0].width * 2, imgs[0].height);
    pixelDensity(1);
    avgImg = createGraphics(imgs[0].width, imgs[0].height);

    // Select a random image from the array
    currentImgIndex = Math.floor(random(numOfImages));
}
//////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgs[currentImgIndex], 0, 0);

    for (let i = 0; i < numOfImages; i++) {
        imgs[i].loadPixels();
        
    }
    avgImg.loadPixels();

    // update all pixels in avgImg to red 
    for (let y = 0; y < imgs[0].height; y++) {
        for (let x = 0; x < imgs[0].width; x++) {     
            let index = (x + y * imgs[0].width) * 4; // Convert the x, y position to a pixel index
            avgImg.pixels[index + 3] = 255; // Alpha (transparency) channel
            sumR = 0;
            sumG = 0;
            sumB = 0;
            for (let i = 0; i < numOfImages; i++) {
                sumR += imgs[i].pixels[index];
                sumG += imgs[i].pixels[index + 1];
                sumB += imgs[i].pixels[index + 2];
            }
            avgImg.pixels[index] = sumR / numOfImages;
            avgImg.pixels[index + 1] = sumG / numOfImages;
            avgImg.pixels[index + 2] = sumB / numOfImages;
        }
    }
    avgImg.updatePixels();
    image(avgImg, imgs[0].width, 0);
    noLoop();
}

//////////////////////////////////////////////////////////
function keyPressed() {
    // Select a new random image whenever a key is pressed
    currentImgIndex = Math.floor(random(numOfImages));
    loop();  // Restart the draw loop to show the new image
}
