import * as pixi from 'pixi.js';
import * as camera from 'camera';
import * as app from 'app';

import * as input from 'input/world';

app.hook('init', 'create-world', () => {
    let hover = new pixi.Graphics();

    camera.addObject(hover, 100);

    hover.beginFill(0xFFFFFF, 0.2);
    hover.drawRect(0, 0, 1, 1);
    hover.endFill();

    app.renderer.on('prerender', () => {
        let pos = input.getMousePosition().apply(Math.floor);

        hover.position = pos.toPoint();
    });
});