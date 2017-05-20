import * as pixi from 'pixi.js';

import * as gui from 'gui';
import * as mouse from 'input/mouse';
import * as lifecycle from 'lifecycle';

import * as construction from 'construction/controls';

import Vector from 'math/vector';
import Material from 'world/material';

let toolbar = new pixi.Container();

let background = new pixi.Graphics();

toolbar.addChildAt(background, 0);

let contents = Array<ToolbarItem>();

lifecycle.hook('init', 'gui-toolbar', app => {
    gui.addObject(toolbar);

    toolbar.position.set(0, app.view.height - 60);

    background.beginFill(0xFFFFFF, 0.75);
    background.drawRect(0, 0, app.view.width, 60);
    background.endFill();

    let index = 0;
    for (let material of Material.allMaterials) {
        if (!material.isPlaceable) continue;

        let item = new MaterialToolbarItem(material, index++);
        contents.push(item);

        toolbar.addChildAt(item.container, 1);
    }
});

mouse.on('down', 0, e => {
    if (e.handled) return;

    e.handled = e.position.y >= lifecycle.app.view.height - 60;

    for (let item of contents) {
        if (item.contains(e.position)) {
            item.click();
        }
    }
});

function update() {
    for (let item of contents) {
        item.update();
    }
}

abstract class ToolbarItem {
    public abstract click(): void;
    public abstract update(): void;
    public abstract contains(pos: Vector): boolean;
}

class MaterialToolbarItem extends ToolbarItem {
    public readonly index: number;
    public readonly material: Material;
    public readonly container = new pixi.Container();

    private _background = new pixi.Graphics();
    private _sprite: pixi.Sprite;

    constructor(material: Material, index: number) {
        super();

        this.index = index;

        this.material = material;

        this.container.addChildAt(this._background, 0);
        this.container.position.set(index * 60, 0);

        this._sprite = new pixi.Sprite(this.material.thumbnail);
        this._sprite.width = 32;
        this._sprite.height = 32;
        this._sprite.position.set(14);

        this.container.addChildAt(this._sprite, 1);

        this.update();
    }

    public contains(pos: Vector) {
        return pos.x >= this.index * 60 && pos.x < (this.index + 1) * 60 && pos.y > lifecycle.app.view.height - 60;
    }

    public update() {
        if (this.material == construction.material) {
            this._background.beginFill(0x0000EE, 0.5);
            this._background.drawRect(6, 6, 48, 48);
            this._background.endFill();
        } else {
            this._background.clear();
        }
    }

    public click() {
        construction.setMaterial(this.material);
        update();
    }
}