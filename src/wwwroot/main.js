// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

const SCREEN_FACTOR = 30;
const SCREEN_WIDTH = Math.floor(16 * SCREEN_FACTOR);
const SCREEN_HEIGHT = Math.floor(9 * SCREEN_FACTOR);


const WORLDMAP = [
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 7, 7, 7, 7, 7, 7, 7, 7,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 7,
    4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7,
    4, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7,
    4, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 7,
    4, 0, 4, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 0, 7, 7, 7, 7, 7,
    4, 0, 5, 0, 0, 0, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 7, 0, 0, 0, 7, 7, 7, 1,
    4, 0, 6, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 7, 0, 0, 0, 0, 0, 0, 8,
    4, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 1,
    4, 0, 8, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 7, 0, 0, 0, 0, 0, 0, 8,
    4, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 7, 0, 0, 0, 7, 7, 7, 1,
    4, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 1,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
    6, 6, 6, 6, 6, 6, 0, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 6, 0, 6, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 0, 6, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 2, 0, 0, 5, 0, 0, 2, 0, 0, 0, 2,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 0, 6, 2, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2,
    4, 0, 6, 0, 6, 0, 0, 0, 0, 4, 6, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 2,
    4, 0, 0, 5, 0, 0, 0, 0, 0, 4, 6, 0, 6, 2, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2,
    4, 0, 6, 0, 6, 0, 0, 0, 0, 4, 6, 0, 6, 2, 0, 0, 5, 0, 0, 2, 0, 0, 0, 2,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 0, 6, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2,
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3
];
const MAPWIDTH = 24;
const MAPHEIGHT = 24;

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
    let internalClock = new Date();
    const draw = (f) => {
        ComputeFrame(imageData, canvas.height, canvas.width, internalClock.getTime());
        let image = new ImageData(imageData, canvas.width);
        context.putImageData(image, 0, 0);
        window.requestAnimationFrame(draw);
    };

    window.requestAnimationFrame(draw);
};


let posX = 22, posY = 12;  //x and y start position
let dirX = -1, dirY = 0; //initial direction vector
let planeX = 0, planeY = 0.66; //the 2d raycaster version of camera plane
let time = 0; //time of current frame
let oldTime = 0; //time of previous frame
let keyState = 1;

function ComputeFrame(imagedata, height, width, tick) {
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
    for (let x = 0; x < width; x++) {
        //calculate ray position and direction
        let cameraX = 2 * x / width - 1; //x-coordinate in camera space
        let rayDirX = dirX + planeX * cameraX;
        let rayDirY = dirY + planeY * cameraX;
        //which box of the map we're in
        let mapX = posX;
        let mapY = posY;

        //length of ray from current position to next x or y-side
        let sideDistX;
        let sideDistY;

        //length of ray from one x or y-side to next x or y-side
        //these are derived as:
        //deltaDistX = sqrt(1 + (rayDirY * rayDirY) / (rayDirX * rayDirX))
        //deltaDistY = sqrt(1 + (rayDirX * rayDirX) / (rayDirY * rayDirY))
        //which can be simplified to abs(|rayDir| / rayDirX) and abs(|rayDir| / rayDirY)
        //where |rayDir| is the length of the vector (rayDirX, rayDirY). Its length,
        //unlike (dirX, dirY) is not 1, however this does not matter, only the
        //ratio between deltaDistX and deltaDistY matters, due to the way the DDA
        //stepping further below works. So the values can be computed as below.
        // Division through zero is prevented, even though technically that's not
        // needed in C++ with IEEE 754 floating point values.
        let deltaDistX = (rayDirX == 0) ? 1e30 : Math.abs(1 / rayDirX);
        let deltaDistY = (rayDirY == 0) ? 1e30 : Math.abs(1 / rayDirY);

        let perpWallDist;

        //what direction to step in x or y-direction (either +1 or -1)
        let stepX;
        let stepY;

        let hit = 0; //was there a wall hit?
        let side = 0; //was a NS or a EW wall hit?
        //calculate step and initial sideDist
        if (rayDirX < 0) {
            stepX = -1;
            sideDistX = (posX - mapX) * deltaDistX;
        }
        else {
            stepX = 1;
            sideDistX = (mapX + 1.0 - posX) * deltaDistX;
        }
        if (rayDirY < 0) {
            stepY = -1;
            sideDistY = (posY - mapY) * deltaDistY;
        }
        else {
            stepY = 1;
            sideDistY = (mapY + 1.0 - posY) * deltaDistY;
        }
        //perform DDA
        while (hit == 0) {
            //jump to next map square, either in x-direction, or in y-direction
            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0;
            }
            else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1;
            }
            //Check if ray has hit a wall
            if (WORLDMAP[mapX * MAPHEIGHT + mapY] > 0) hit = 1;
        }
        //Calculate distance projected on camera direction. This is the shortest distance from the point where the wall is
        //hit to the camera plane. Euclidean to center camera point would give fisheye effect!
        //This can be computed as (mapX - posX + (1 - stepX) / 2) / rayDirX for side == 0, or same formula with Y
        //for size == 1, but can be simplified to the code below thanks to how sideDist and deltaDist are computed:
        //because they were left scaled to |rayDir|. sideDist is the entire length of the ray above after the multiple
        //steps, but we subtract deltaDist once because one step more into the wall was taken above.
        if (side == 0) perpWallDist = (sideDistX - deltaDistX);
        else perpWallDist = (sideDistY - deltaDistY);

        //Calculate height of line to draw on screen
        let lineHeight = Math.round(height / perpWallDist);

        //calculate lowest and highest pixel to fill in current stripe
        let drawStart = -lineHeight / 2 + height / 2;
        if (drawStart < 0) drawStart = 0;
        let drawEnd = lineHeight / 2 + height / 2;
        if (drawEnd >= height) drawEnd = height - 1;

        //choose wall color
        //let color = WORLDMAP[mapX * MapHeight + mapY] switch
        //    {
        //    1 => 0xFF,
        //    2 => 0xFF00,
        //    3 => 0xFF0000,
        //    4 => 0xFFFFFF,
        //    _ => 0xFFFF00,
        //};

        //    if (side == 1)
        //    color &= ~0x808080;

        let worldMapPixel = WORLDMAP[mapX * MAPHEIGHT + mapY];
        //draw the pixels of the stripe as a vertical line
        for (let y = drawStart; y < drawEnd; y++) {
            let posation = (x + y * width);
            if (worldMapPixel == 1) {
                imagedata[posation] = 255;
                imagedata[posation + 1] = 0;
                imagedata[posation + 2] = 0;
                imagedata[posation + 3] = 255;
            }
            else if (worldMapPixel == 2) {
                imagedata[posation] = 255;
                imagedata[posation + 1] = 0;
                imagedata[posation + 2] = 255;
                imagedata[posation + 3] = 255;
            }
            else if (worldMapPixel == 3) {
                imagedata[posation] = 255;
                imagedata[posation + 1] = 0;
                imagedata[posation + 2] = 0;
                imagedata[posation + 3] = 255;
            }
            else if (worldMapPixel == 4) {
                imagedata[posation] = 255;
                imagedata[posation + 1] = 255;
                imagedata[posation + 2] = 255;
                imagedata[posation + 3] = 255;
            }
            else {
                imagedata[posation] = 255;
                imagedata[posation + 1] = 255;
                imagedata[posation + 2] = 0;
                imagedata[posation + 3] = 255;
            }
        }

        let frameTime = (tick - time) / 1000.0; //frameTime is the time this frame has taken, in seconds

        //speed modifiers
        let moveSpeed = frameTime * 5.0; //the constant value is in squares/second
        let rotSpeed = frameTime * 3.0; //the constant value is in radians/second

        //move forward or backwards if no wall
        if ((keyState & (1 | 8)) != 0) {
            if ((keyState & 8) != 0)
                moveSpeed = -moveSpeed;
            if (WORLDMAP[Math.round(posX + dirX * moveSpeed) * MAPHEIGHT + Math.round(posY)] == 0) posX += dirX * moveSpeed;
            if (WORLDMAP[Math.round(posX * MAPHEIGHT) + Math.round(posY + dirY * moveSpeed)] == 0) posY += dirY * moveSpeed;
        }
        ////rotate to the right or left
        if ((keyState & (4 | 1)) != 0) {
            if ((keyState & 4) != 0)
                rotSpeed = -rotSpeed;
            //both camera direction and camera plane must be rotated
            let oldDirX = dirX;
            dirX = dirX * Math.cos(rotSpeed) - dirY * Math.sin(rotSpeed);
            dirY = oldDirX * Math.sin(rotSpeed) + dirY * Math.cos(rotSpeed);
            let oldPlaneX = planeX;
            planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed);
            planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed);
        }

        time = tick;
    }
}