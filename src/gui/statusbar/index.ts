import * as pixi from 'pixi.js';

import * as gui from 'gui';
import * as app from 'app';

import * as world from 'world';
import * as entities from 'world/entities';

import Student from 'world/entities/student';
import Teacher from 'world/entities/teacher';

import Vector from 'math/vector';
import Counter from './counter';

let bar = new pixi.Container();

let background = new pixi.Graphics();
bar.addChildAt(background, 0);

let bank = new pixi.Text();
bar.addChildAt(bank, 1);

let students = new Counter(new Vector(app.width / 3 + 100, 0), 'students');
bar.addChildAt(students.container, 1);

let teachers = new Counter(new Vector(app.width / 3 + 300, 0), 'teachers');
bar.addChildAt(teachers.container, 1);

app.hook('init', 'gui-statusbar', () => {
    gui.addObject(bar);

    bar.position.set(0, 0);

    background.beginFill(0xFFFFFF, 0.75);
    background.drawRect(0, 0, app.width, 48);
    background.endFill();
    
    bank.position.set(app.width * 0.3, 8);
});

app.hook('prerender', 'gui-statusbar', () => {
    bank.text = '$' + world.cash;
});

students.on('change', count => {
    let now = entities.allEntities.filter(s => s instanceof Student);

    while (now.length < count) {
        entities.addEntity(new Student(new Vector(50.5, 50.5)));
        
        now = entities.allEntities.filter(s => s instanceof Student)
    }

    while (now.length > count) {
        entities.removeEntity(now[0]);

        now = entities.allEntities.filter(s => s instanceof Student)
    }
});

teachers.on('change', count => {
    let now = entities.allEntities.filter(s => s instanceof Teacher);

    while (now.length < count) {
        entities.addEntity(new Teacher(new Vector(50.5, 50.5)));
        
        now = entities.allEntities.filter(s => s instanceof Teacher)
    }

    while (now.length > count) {
        entities.removeEntity(now[0]);

        now = entities.allEntities.filter(s => s instanceof Teacher)
    }
});