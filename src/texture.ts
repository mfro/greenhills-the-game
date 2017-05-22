import * as pixi from 'pixi.js';

let resources = require.context('../resources', true, /\.png$/);

export const placeholder = solid('red');

export const transparent = solid('transparent');

export function load(path: string, callback: (tex: pixi.Texture) => void) {
    let sprite = resources('./' + path);

    pixi.loader.add(sprite);
    pixi.loader.on('complete', () => {
        let texture = pixi.loader.resources[sprite].texture;

        callback(texture);
    });
}

function solid(color: string) {
    let canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    let context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, 10, 10);

    return pixi.Texture.fromCanvas(canvas);
}