import * as pixi from 'pixi.js';
import * as app from 'app';

import * as mouse from 'input/mouse';
import * as keyboard from 'input/keyboard';

import * as world from 'world';

import Spring from 'math/spring';
import Vector from 'math/vector';

let container = new pixi.Container();

let scale: Spring.Number;
let position: Spring.Vector;

export function addObject<T extends pixi.DisplayObject>(o: T, index: number) {
    return container.addChildAt(o, index);
}

export function removeObject(o: pixi.DisplayObject) {
    container.removeChild(o);
}

export function transform(point: Vector) {
    let center = new Vector(app.width, app.height).scale(0.5);

    point = point.add(center.scale(-1));
    point = point.scale(1 / scale.value);
    point = point.add(position.value);

    return point;
}

app.hook('init', 'camera', a => {
    scale = new Spring.Number(32);
    position = new Spring.Vector(world.size.scale(0.5));

    app.stage.addChildAt(container, 0);
});

mouse.on('scroll', 0, delta => {
    let ratio = delta > 0 ? 0.5 : 2;
    scale.target += -8 * Math.sign(delta);

    scale.target = Math.min(scale.target, 64);
    scale.target = Math.max(scale.target, 8);
});

app.hook('prerender', 'camera', () => {
    scale.update();
    position.update();

    let delta = { x: 0, y: 0 };
    let ratio = 12 / scale.value;

    if (keyboard.isPressed(keyboard.UP_ARROW) || keyboard.isPressed(keyboard.W))
        delta.y = -ratio;
    else if (keyboard.isPressed(keyboard.DOWN_ARROW) || keyboard.isPressed(keyboard.S))
        delta.y = ratio;

    if (keyboard.isPressed(keyboard.LEFT_ARROW) || keyboard.isPressed(keyboard.A))
        delta.x = -ratio;
    else if (keyboard.isPressed(keyboard.RIGHT_ARROW) || keyboard.isPressed(keyboard.D))
        delta.x = ratio;

    position.target = position.target.add(delta.x, delta.y);

    let center = new Vector(app.width, app.height).scale(0.5);
    let offset = position.value.scale(-scale.value).add(center);

    container.scale.set(scale.value);
    container.position = offset.toPoint();
});