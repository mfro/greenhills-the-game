import * as pixi from 'pixi.js';

import * as app from 'app';
import * as mouse from 'input/mouse';
import * as camera from 'camera';
import * as pathing from './pathing';

import * as world from 'world';

import Vector from 'math/vector';
import Entity from './entity';

import Builder from './builder';
import Student from './student';

import { EventEmitter } from 'eventemitter3';

const events = new EventEmitter<{
    change: Vector;
}>();

let container = new pixi.Container();
export let allEntities = new Array<Entity>();

export const on = events.on;
export const once = events.once;

export function addEntity(entity: Entity) {
    container.addChildAt(entity.container, 0);
    allEntities.push(entity);
    
    events.emit('change', entity.position);
}

export function removeEntity(entity: Entity) {
    container.removeChild(entity.container);
    let index = allEntities.indexOf(entity);
    allEntities.splice(index, 1);
    
    entity.emit('removed');
    events.emit('change', entity.position);
}

app.hook('init', 'entities', () => {
    camera.addObject(container, 100);

    let entity1 = new Builder(new Vector(50.5, 50.5));
    addEntity(entity1);

    let entity2 = new Builder(new Vector(51.5, 50.5));
    addEntity(entity2);

    let entity3 = new Builder(new Vector(52.5, 50.5));
    addEntity(entity3);

    let entity4 = new Builder(new Vector(53.5, 50.5));
    addEntity(entity4);

    // let student1 = new Student(new Vector(50.5, 51.5));
    // addEntity(student1);

    // let student2 = new Student(new Vector(51.5, 51.5));
    // addEntity(student2);

    // let student3 = new Student(new Vector(52.5, 51.5));
    // addEntity(student3);

    // let student4 = new Student(new Vector(53.5, 51.5));
    // addEntity(student4);
});
app.hook('update', 'entities', dT => {
    let salary = 0;
    for (let entity of allEntities) {
        entity.update(dT);
        salary += entity.salary;
    }

    let delta = salary * dT / 10;
    world.setCash(world.cash - delta);
})