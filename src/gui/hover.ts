// import * as pixi from 'pixi.js';
// import * as camera from 'camera';
// import * as app from 'app';

// import * as input from 'input/world';

// let hover = new pixi.Graphics();

// app.hook('init', 'gui/hover', () => {
//     camera.addObject(hover, 100);

//     hover.beginFill(0xFFFFFF, 0.2);
//     hover.drawRect(0, 0, 1, 1);
//     hover.endFill();
// });

// app.hook('prerender', 'gui/hover', () => {
//     let pos = input.getMousePosition().apply(Math.floor);

//     hover.position = pos.toPoint();
// });