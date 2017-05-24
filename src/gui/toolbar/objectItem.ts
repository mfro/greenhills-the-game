// import * as pixi from 'pixi.js';

// import * as app from 'app';

// import * as materials from 'world/materials';
// import * as construction from 'construction/controls';

// import Vector from 'math/vector';
// import GameObject from 'world/objects/object';

// import ToolbarItem from './item';

// class ObjectToolbarItem<T extends GameObject> extends ToolbarItem {
//     public readonly index: number;
//     public readonly material: materials.Object;

//     private _background = new pixi.Graphics();
//     private _sprite: pixi.Sprite;

//     constructor(materials: materials.Object, index: number) {
//         super();

//         this.index = index;
//         this.type = type;

//         this.container.addChildAt(this._background, 0);
//         this.container.position.set(index * 60, 0);

//         this._sprite = new pixi.Sprite(this.material.thumbnail);
//         this._sprite.width = 32;
//         this._sprite.height = 32;
//         this._sprite.position.set(14);

//         this.container.addChildAt(this._sprite, 1);

//         this.update();
//     }

//     public contains(pos: Vector) {
//         return pos.x >= this.index * 60 && pos.x < (this.index + 1) * 60 && pos.y > app.height - 60;
//     }

//     public update() {
//         this._background.clear();

//         if (this.material == construction.material) {
//             this._background.beginFill(0x0000EE, 0.5);
//             this._background.drawRect(6, 6, 48, 48);
//             this._background.endFill();
//         }
//     }

//     public click() {
//         construction.setMaterial(this.material);

//         this.emit('update');
//     }
// }

// export default ObjectToolbarItem;