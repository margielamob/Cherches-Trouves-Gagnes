/* eslint-disable @typescript-eslint/no-magic-numbers -- bmp data numbers range of 1 - 255 */

export const TEST_BMP_DATA = [
    {
        dimensions: { width: 2, height: 2 },
        data: [255, 1, 2, 3, 255, 1, 2, 3, 255, 1, 2, 3, 255, 1, 2, 3],
    },
    {
        dimensions: { width: 2, height: 2 },
        data: [255, 1, 2, 3, 255, 2, 3, 4, 255, 3, 4, 5, 255, 4, 5, 6],
    },

    {
        dimensions: { width: 2, height: 3 },
        data: [255, 1, 2, 3, 255, 2, 3, 4, 255, 3, 4, 5, 255, 4, 5, 6, 255, 5, 6, 7, 255, 6, 7, 8],
    },
];

export const EQUIVALENT_DATA = [
    [
        { isVisited: false, a: 255, r: 1, g: 2, b: 3 },
        { isVisited: false, a: 255, r: 1, g: 2, b: 3 },
    ],
    [
        { isVisited: false, a: 255, r: 1, g: 2, b: 3 },
        { isVisited: false, a: 255, r: 1, g: 2, b: 3 },
    ],
];

export const PIXEL_BUFFER_ARGB = [255, 1, 2, 3, 255, 1, 2, 3, 255, 1, 2, 3, 255, 1, 2, 3];
export const PIXEL_BUFFER_RGBA = [255, 1, 2, 3, 255, 1, 2, 3, 255, 1, 2, 3, 255, 1, 2, 3];
