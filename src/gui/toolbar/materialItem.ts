import * as pixi from 'pixi.js';

import * as materials from 'world/materials';
import * as construction from 'construction/controls';

import Vector from 'math/vector';

import ToolbarItem from './item';

function getRatio(material: materials.Base) {
    if (material instanceof materials.Object)
        return material.height / material.width;
    
    return 1;
}

class MaterialToolbarItem extends ToolbarItem {
    public readonly material: materials.Base;

    private _background = new pixi.Graphics();
    private _sprite: pixi.Sprite;
    private _text: pixi.Text;

    constructor(material: materials.Base) {
        super();

        this.material = material;

        this.container.addChildAt(this._background, 0);

        this._sprite = new pixi.Sprite(this.material.thumbnail);
        this._sprite.width = 32 * getRatio(material);
        this._sprite.height = 32;
        this._sprite.position.set(8);

        this.container.addChildAt(this._sprite, 1);

        this._text = new pixi.Text(material.name);
        this._text.style.fontSize = 16;
        this._text.position.set(this._sprite.position.x * 3 + this._sprite.width, 15);

        this.container.addChildAt(this._text, 1);

        this.update();
    }

    public update() {
        this._background.clear();

        if (this.material == construction.material) {
            this._background.beginFill(0x0000EE, 0.5);
            this._background.drawRect(0, 0, this._sprite.width + 16, this._sprite.height + 16);
            this._background.endFill();
        }
    }

    public click() {
        construction.setMaterial(this.material);

        this.emit('update');
    }
}

export default MaterialToolbarItem;