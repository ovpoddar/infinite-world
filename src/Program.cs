using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.JavaScript;
using static System.Runtime.InteropServices.JavaScript.JSType;

return 0;
partial class ExportClasses
{
    const int MapWidth = 24;
    const int MapHeight = 24;

    static ReadOnlySpan<byte> WorldMap => [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,2,2,2,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1,
        1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,3,0,0,0,3,0,0,0,1,
        1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,4,0,0,0,0,5,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,4,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
    static double posX = 22, posY = 12;
    static double dirX = -1, dirY = 0;
    static double planeX = 0, planeY = 0.66;
    static KeyState keyState;
    static IntPtr data;


    [JSExport]
    public static void ProcessKey(string character)
    {
        double moveSpeed = 0.5;
        double rotSpeed = 0.3;


        if (character == "w" || character == "ArrowUp")
        {
            keyState = KeyState.Up;
            if (moveSpeed < 0) moveSpeed *= -1;
        }
        if (character == "s" || character == "ArrowDown")
        {
            keyState = KeyState.Down;
            if (moveSpeed > 0) moveSpeed *= -1;
        }
        if (character == "a" || character == "ArrowLeft")
        {
            keyState = KeyState.Left;
            if (rotSpeed < 0) rotSpeed *= -1;
        }
        if (character == "d" || character == "ArrowRight")
        {
            keyState = KeyState.Right;
            if (rotSpeed > 0) rotSpeed *= -1;
        }

        if ((keyState & (KeyState.Up | KeyState.Down)) != 0)
        {
            if (WorldMap[(int)(posX + dirX * moveSpeed) * MapHeight + (int)posY] == 0)
                posX += dirX * moveSpeed;
            if (WorldMap[(int)posX * MapHeight + (int)(posY + dirY * moveSpeed)] == 0)
                posY += dirY * moveSpeed;
        }
        if ((keyState & (KeyState.Right | KeyState.Left)) != 0)
        {
            double oldDirX = dirX;
            dirX = dirX * Math.Cos(rotSpeed) - dirY * Math.Sin(rotSpeed);
            dirY = oldDirX * Math.Sin(rotSpeed) + dirY * Math.Cos(rotSpeed);
            double oldPlaneX = planeX;
            planeX = planeX * Math.Cos(rotSpeed) - planeY * Math.Sin(rotSpeed);
            planeY = oldPlaneX * Math.Sin(rotSpeed) + planeY * Math.Cos(rotSpeed);
        }

    }

    [JSExport]
    public static unsafe IntPtr ComputeFrame(int width, int height)
    {
        if (data != IntPtr.Zero)
            Marshal.FreeHGlobal(data);
        data = Marshal.AllocHGlobal(sizeof(byte) * width * height * 4);

        var size = width * height / 2;
        new Span<Pixels>((void*)data, size).Fill(new Pixels { Red = 17, Blue = 0, Green = 0, Alpha = 255 });
        new Span<Pixels>((int*)data + size, size).Fill(new Pixels { Red = 51, Blue = 51, Green = 51, Alpha = 255 });

        for (int x = 0; x < width; x++)
        {
            double cameraX = 2 * x / (double)width - 1;
            double rayDirX = dirX + planeX * cameraX;
            double rayDirY = dirY + planeY * cameraX;
            int mapX = (int)posX;
            int mapY = (int)posY;
            double deltaDistX = (rayDirX == 0) ? 1e30 : Math.Abs(1 / rayDirX);
            double deltaDistY = (rayDirY == 0) ? 1e30 : Math.Abs(1 / rayDirY);
            int hit = 0;
            int side = 0;


            double sideDistX;
            int stepX;
            if (rayDirX < 0)
            {
                stepX = -1;
                sideDistX = (posX - mapX) * deltaDistX;
            }
            else
            {
                stepX = 1;
                sideDistX = (mapX + 1.0 - posX) * deltaDistX;
            }

            double sideDistY;
            int stepY;
            if (rayDirY < 0)
            {
                stepY = -1;
                sideDistY = (posY - mapY) * deltaDistY;
            }
            else
            {
                stepY = 1;
                sideDistY = (mapY + 1.0 - posY) * deltaDistY;
            }
            while (hit == 0)
            {
                if (sideDistX < sideDistY)
                {
                    sideDistX += deltaDistX;
                    mapX += stepX;
                    side = 0;
                }
                else
                {
                    sideDistY += deltaDistY;
                    mapY += stepY;
                    side = 1;
                }
                if (WorldMap[mapX * MapHeight + mapY] > 0) hit = 1;
            }

            double perpWallDist;
            if (side == 0) perpWallDist = (sideDistX - deltaDistX);
            else perpWallDist = (sideDistY - deltaDistY);

            int lineHeight = (int)(height / perpWallDist);
            int drawStart = -lineHeight / 2 + height / 2;
            if (drawStart < 0) drawStart = 0;
            int drawEnd = lineHeight / 2 + height / 2;
            if (drawEnd >= height) drawEnd = height - 1;

            var color = WorldMap[mapX * MapHeight + mapY] switch
            {
                1 => new Pixels() { Alpha = 255, Red = 255, Green = 0, Blue = 255 },
                2 => new Pixels() { Alpha = 255, Red = 255, Green = 255, Blue = 0 },
                3 => new Pixels() { Alpha = 255, Red = 255, Green = 0, Blue = 0 },
                4 => new Pixels() { Alpha = 255, Red = 255, Green = 255, Blue = 255 },
                _ => new Pixels() { Alpha = 255, Red = 255, Green = 255, Blue = 255 },
            };

            if (side == 1)
            {
                color.Alpha = 127;
                color.Red -= 22;
                color.Green -= 22;
                color.Blue -= 22;
            }
            for (int y = drawStart; y < drawEnd; y++)
                *(Pixels*)(data + (x + y * width) * 4) = color;

        }
        return data;
    }

    [JSExport]
    public static byte[] Minimap()
    {
        var result = WorldMap.ToArray();
        result[(int)(posX + posY * 24)] = 10;
        return result;
    }

    [JSExport]
    [return: JSMarshalAs<MemoryView>]
    public static unsafe Span<byte> GetMem()
    {
        return new Span<byte>((void*)data, 10);
    }
}


enum KeyState
{
    Left = 1,
    Up = 2,
    Right = 4,
    Down = 8,
}

[StructLayout(LayoutKind.Sequential, Pack = 0, Size = sizeof(byte) * 4)]
public struct Pixels
{
    public byte Red { get; set; }
    public byte Blue { get; set; }
    public byte Green { get; set; }
    public byte Alpha { get; set; }
}