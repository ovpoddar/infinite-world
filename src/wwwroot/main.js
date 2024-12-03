// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

import { dotnet } from './_framework/dotnet.js';
const FACTOR = Math.floor(window.innerWidth / 640);
const SCREEN_WIDTH = 640 * FACTOR;
const SCREEN_HEIGHT = 480 * FACTOR;
const { getAssemblyExports, getConfig } = await dotnet
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

window.addEventListener("keyup", (e) => {
    e.preventDefault();
    exports.ExportClasses.ProcessKey(e.key);
})

const draw = (f) => {
    let imageData = new Uint8ClampedArray(exports.ExportClasses.ComputeFrame(canvas.width, canvas.height))
    let image = new ImageData(imageData, canvas.width);
    context.putImageData(image, 0, 0);
    window.requestAnimationFrame(draw);
};

window.requestAnimationFrame(draw);
