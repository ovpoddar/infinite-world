// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

import {dotnet} from './_framework/dotnet.js';

const FACTOR = Math.floor(window.innerWidth / 640);
const SCREEN_WIDTH = 640 * FACTOR;
const SCREEN_HEIGHT = 480 * FACTOR;
const {getAssemblyExports, getConfig, localHeapViewI8} = await dotnet
    .create();
const config = getConfig();
const exports = await getAssemblyExports(config.mainAssemblyName);
const canvas = document.getElementById("canvas");
if (canvas === null)
    throw new Error("No canvas is found.");
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

const context = canvas.getContext("2d");
if (context === null)
    throw new Error("2D context is not supported.");

let shouldDraw = true;

window.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.key === " ") {
        drawMinimap(exports.ExportClasses.Minimap(), context, SCREEN_WIDTH, SCREEN_HEIGHT)
        shouldDraw = !shouldDraw;
        return;
    }
    if (shouldDraw) {
        exports.ExportClasses.ProcessKey(e.key);
    }
})


const draw = (f) => {
    if (!shouldDraw) {
        window.requestAnimationFrame(draw);
        return;
    }
    const bufferPointer = exports.ExportClasses.ComputeFrame(SCREEN_WIDTH, SCREEN_HEIGHT);
    let imageData = new Uint8ClampedArray(localHeapViewI8().buffer,
        bufferPointer,
        SCREEN_WIDTH * SCREEN_HEIGHT * 4)
    let image = new ImageData(imageData, SCREEN_WIDTH);
    context.putImageData(image, 0, 0);
    window.requestAnimationFrame(draw);
};

window.requestAnimationFrame(draw);


function drawMinimap(map, context, width, height) {
    width = width - 40;
    height = height - 40;
    const boxWidth = (width / 24) - 10;
    const boxHeight = (height / 24) - 10;

    context.fillStyle = "red";
    context.fillRect(20, 20, width, height);

    for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
        let posation = y * 24 + x;
        switch (map[posation]) {
            case 10:
                context.fillStyle = "white";
                break;
            case 1:
            case 2:
            case 3:
            case 4:
                context.fillStyle = "green";
                break;
            default:
                context.fillStyle = "black";
                break;

        }
        context.fillRect((x * (boxWidth + 10) + 20), (y * (boxHeight + 10) + 20), boxWidth, boxHeight);
    }
}