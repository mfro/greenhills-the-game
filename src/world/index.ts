import * as pixi from 'pixi.js';
import * as camera from 'camera';
import * as lifecycle from 'lifecycle';

import * as input from 'input/world';

import Vector from 'math/vector';

import * as blocks from './blocks'
import * as foundations from './foundations';

export const size = new Vector(100, 100);

export function update(pos: Vector) {
    for (let x = Math.max(0, pos.x - 1); x < Math.min(size.x, pos.x + 2); x++) {
        for (let y = Math.max(0, pos.y - 1); y < Math.min(size.y, pos.y + 2); y++) {

            let v = new Vector(x, y);
            blocks.update(v);
            foundations.update(v);
        }
    }
}

lifecycle.hook('init', 'create-world', app => {
    let hover = new pixi.Graphics();

    camera.addObject(hover, 100);

    hover.beginFill(0xFF0000, 0.2);
    hover.drawRect(0, 0, 1, 1);
    hover.endFill();

    app.renderer.on('prerender', () => {
        let pos = input.getMousePosition().apply(Math.floor);

        hover.position = pos.toPoint();
    });
});