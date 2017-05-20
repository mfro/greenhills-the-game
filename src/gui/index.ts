import * as pixi from 'pixi.js';
import * as app from 'app';

import Vector from 'math/vector';

import './hover';
import './toolbar';

let container = new pixi.Container();

app.hook('init', 'gui', () => {
    app.stage.addChildAt(container, 1000);
});

export function addObject(obj: pixi.DisplayObject) {
    container.addChildAt(obj, 0);
}
