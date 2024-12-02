// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

const SCREEN_FACTOR = 30;
const SCREEN_WIDTH = Math.floor(16 * SCREEN_FACTOR);
const SCREEN_HEIGHT = Math.floor(9 * SCREEN_FACTOR);

window.onload = function () {
    const canvas = document.getElementById("canvas");
    if (canvas === null)
        throw new Error("No canvas is found.");
    canvas.width = 16 * SCREEN_FACTOR;
    canvas.height = 9 * SCREEN_FACTOR;
    const context = canvas.getContext("2d");
    if (context === null)
        throw new Error("2D context is not supported.");

    let imageData = new Uint8ClampedArray(canvas.width * canvas.height * 4);
    const draw = (f) => {
        ComputeFrame(imageData);
        let image = new ImageData(imageData, canvas.width);
        context.putImageData(image, 0, 0);
        window.requestAnimationFrame(draw);
    };

    window.requestAnimationFrame(draw);
};

function ComputeFrame(imagedata) {
    const center = imagedata.length / 2;
    for (let i = 0; i < imagedata.length; i += 4) {
        if (i > center) {
            imagedata[i] = 51;
            imagedata[i + 1] = 51;
            imagedata[i + 2] = 51;
            imagedata[i + 3] = 255;
        }
        else {
            imagedata[i] = 17;
            imagedata[i + 1] = 0;
            imagedata[i + 2] = 0;
            imagedata[i + 3] = 255;
        }
    }
}