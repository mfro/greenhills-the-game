import * as pixi from 'pixi.js';

import * as app from 'app';
import * as mouse from 'input/mouse';
import * as camera from 'camera';
import * as pathing from './pathing';

import * as world from 'world';

import Vector from 'math/vector';
import Entity from './entity';
import Builder from './builder';


let container = new pixi.Container();
let entities = new Array<Entity>();

export function addEntity(entity: Entity) {
    container.addChildAt(entity.container, 0);
    entities.push(entity);
}

export function removeEntity(entity: Entity) {
    container.removeChild(entity.container);
    let index = entities.indexOf(entity);
    entities.splice(index, 1);
}

export function update(pos: Vector) {
}

app.hook('init', 'entities', () => {
    camera.addObject(container, 2);

    let entity1 = new Builder(new Vector(50.5, 50.5));
    addEntity(entity1);

    let entity2 = new Builder(new Vector(51.5, 50.5));
    addEntity(entity2);

    let entity3 = new Builder(new Vector(52.5, 50.5));
    addEntity(entity3);

    let entity4 = new Builder(new Vector(53.5, 50.5));
    addEntity(entity4);
});

app.hook('update', 'entities', dT => {
    for (let entity of entities) {
        entity.update(dT);
    }
})