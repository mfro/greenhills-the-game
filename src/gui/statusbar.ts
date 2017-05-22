import * as pixi from 'pixi.js';

import * as gui from 'gui';
import * as app from 'app';
import * as mouse from 'input/mouse';

let container = new pixi.Container();

let background = new pixi.Graphics();

container.addChildAt(background, 0);


// app.hook('init', 'gui-toolbar', () => {
//     gui.addObject(toolbar);

//     toolbar.position.set(0, app.height - 60);

//     background.beginFill(0xFFFFFF, 0.75);
//     background.drawRect(0, 0, app.width, 60);
//     background.endFill();

//     let index = 0;
//     for (let material of Material.allMaterials) {
//         if (!material.isPlaceable) continue;

//         let item = new MaterialToolbarItem(material, index++);
//         contents.push(item);

//         toolbar.addChildAt(item.container, 1);
//     }
// });