import * as pixi from 'pixi.js';

import * as gui from 'gui';
import * as app from 'app';
import * as mouse from 'input/mouse';

import * as regions from 'regions';
import * as materials from 'world/materials';
import * as construction from 'construction/controls';

import Vector from 'math/vector';

import ToolbarMenu from './menu';
import ToolbarItem from './item';


import RegionToolbarItem from './regionItem';
import MaterialToolbarItem from './materialItem';

let toolbar = new pixi.Container();

let background = new pixi.Graphics();

toolbar.addChildAt(background, 0);

let contents = Array<ToolbarItem>();

app.hook('init', 'gui-toolbar', () => {
    gui.addObject(toolbar);

    toolbar.position.set(0, app.height - 48);

    background.beginFill(0xFFFFFF, 0.75);
    background.drawRect(0, 0, app.width, 48);
    background.endFill();

    let floors = new ToolbarMenu('Floors', 0);
    floors.addItem(new MaterialToolbarItem(materials.DIRT));
    floors.addItem(new MaterialToolbarItem(materials.GRASS));
    floors.addItem(new MaterialToolbarItem(materials.CONCRETE_FLOOR));
    floors.addItem(new MaterialToolbarItem(materials.BRICK_FLOOR));
    floors.addItem(new MaterialToolbarItem(materials.WOOD_FLOOR));
    floors.addItem(new MaterialToolbarItem(materials.CARPET));

    let walls = new ToolbarMenu('Walls', 1);
    walls.addItem(new MaterialToolbarItem(materials.CINDERBLOCK_WALL));
    walls.addItem(new MaterialToolbarItem(materials.BRICK_WALL));
    walls.addItem(new MaterialToolbarItem(materials.AIR));

    let objects = new ToolbarMenu('Objects', 2);
    objects.addItem(new MaterialToolbarItem(materials.TOILET));
    objects.addItem(new MaterialToolbarItem(materials.DESK));
    objects.addItem(new MaterialToolbarItem(materials.CHAIR));

    objects.addItem(new MaterialToolbarItem(materials.WOOD_TABLE));
    objects.addItem(new MaterialToolbarItem(materials.LUNCH_TABLE));
    objects.addItem(new MaterialToolbarItem(materials.COMPUTER_TABLE));

    objects.addItem(new MaterialToolbarItem(materials.LOCKERS));
    objects.addItem(new MaterialToolbarItem(materials.BOOKSHELF));
    objects.addItem(new MaterialToolbarItem(materials.SINK));
    
    objects.addItem(new MaterialToolbarItem(materials.BULLDOZER));

    let rooms = new ToolbarMenu('Rooms', 3);
    rooms.addItem(new RegionToolbarItem(regions.CLASSROOM));

    toolbar.addChildAt(floors.container, 1);
    toolbar.addChildAt(walls.container, 1);
    toolbar.addChildAt(objects.container, 1);
    toolbar.addChildAt(rooms.container, 1);
});

mouse.on('down', 1, e => {
    if (e.handled) return;

    e.handled = e.position.y >= app.height - 48;
});

function addItem(item: ToolbarItem) {
    contents.push(item);
    toolbar.addChildAt(item.container, 1);
    item.on('update', update);
}

function update() {
    for (let item of contents) {
        item.update();
    }
}
