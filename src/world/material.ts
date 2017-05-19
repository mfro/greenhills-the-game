import * as pixi from 'pixi.js';

let rsrc = require.context('../../resources', true, /\.png$/);

interface Material {
    id: string;

    textures: Array<pixi.Texture>;
}

let canvas = document.createElement('canvas');
canvas.width = 1;
canvas.height = 1;
let context = canvas.getContext('2d');
context.fillStyle = 'red';
context.fillRect(0, 0, 10, 10);

namespace Material {
    export interface Definition {
        id: string;
        texture: string;
    }

    export function define(def: Definition): Material {
        let sprite = rsrc('./' + def.texture);

        let material = {
            id: def.id,
            textures: Array<pixi.Texture>()
        };

        pixi.loader.add(sprite);
        pixi.loader.on('complete', () => {
            let atlas = pixi.loader.resources[sprite].texture;
            let list = [];

            for (let x = 0; x < atlas.width; x += 64) {
                for (let y = 0; y < atlas.height; y += 64) {
                    list.push(new pixi.Texture(atlas.baseTexture, new pixi.Rectangle(x, y, 64, 64)));
                }
            }

            material.textures = list;
        });

        return <Material>material;
    }
}

export default Material;