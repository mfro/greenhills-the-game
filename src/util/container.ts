import * as pixi from 'pixi.js';

interface MyDisplayObject {
    zOrder: number;
}

pixi.Container.prototype.addChild = function () {
    throw new Error('Muse specify z-index');
};

let oldAddChildAt = pixi.Container.prototype.addChildAt;
pixi.Container.prototype.addChildAt = function <T extends pixi.DisplayObject>(this: pixi.Container, child: T & MyDisplayObject, zOrder: number) {
    child.zOrder = zOrder;

    let i = 0;
    for (; i < this.children.length; i++) {
        let other = this.children[i] as pixi.DisplayObject & MyDisplayObject;

        if (other.zOrder > zOrder) break;
    }

    return oldAddChildAt.call(this, child, i);
}