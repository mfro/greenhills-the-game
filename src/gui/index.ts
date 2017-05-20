import * as pixi from 'pixi.js';
import * as lifecycle from 'lifecycle';

import Vector from 'math/vector';

import './toolbar';

let container = new pixi.Container();

lifecycle.hook('init', 'gui', app => {
    app.stage.addChildAt(container, 1000);
});

export function addObject(obj: pixi.DisplayObject) {
    container.addChildAt(obj, 0);
}
