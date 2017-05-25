import * as pixi from 'pixi.js';

import * as materials from 'world/materials';
import * as construction from 'construction/controls';
import * as regions from 'regions/controls';

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

    private _name: pixi.Text;
    private _price: pixi.Text;

    constructor(material: materials.Base) {
        super();

        this.material = material;

        this.container.addChildAt(this._background, 0);

        this._sprite = new pixi.Sprite(this.material.thumbnail);
        this._sprite.width = 32 * getRatio(material);
        this._sprite.height = 32;
        this._sprite.position.set(8);

        this.container.addChildAt(this._sprite, 1);

        this._name = new pixi.Text(material.name);
        this._name.style.fontSize = 16;
        this._name.position.set(24 + this._sprite.width, 15);

        this.container.addChildAt(this._name, 1);

        this._price = new pixi.Text('$' + material.cost);
        this._price.style.fontSize = 16;
        this._price.position.set(ToolbarItem.width - this._price.width - 8, 15);

        this.container.addChildAt(this._price, 1);

        this.update();
    }

    public update() {
        this._background.clear();

        if (this.material == construction.material) {
            this._background.beginFill(0x0000EE, 0.25);
            this._background.drawRect(0, 0, ToolbarItem.width, ToolbarItem.height);
            this._background.endFill();
        }
    }

    public click() {
        construction.setMaterial(this.material);
        regions.setType(null);

        this.emit('update');
    }
}

export default MaterialToolbarItem;