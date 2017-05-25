import * as pixi from 'pixi.js';

import * as regions from 'regions';
import * as building from 'construction/controls';
import * as construction from 'regions/controls';

import Vector from 'math/vector';

import ToolbarItem from './item';

class MaterialToolbarItem extends ToolbarItem {
    public readonly type: regions.Base.Definition;

    private _background = new pixi.Graphics();
    private _text: pixi.Text;

    constructor(type: regions.Base.Definition) {
        super();

        this.type = type;

        this.container.addChildAt(this._background, 0);

        this._text = new pixi.Text(type.name);
        this._text.style.fontSize = 16;
        this._text.position.set(8, 15);

        this.container.addChildAt(this._text, 1);

        this.update();
    }

    public update() {
        this._background.clear();

        if (this.type == construction.type) {
            this._background.beginFill(0x0000EE, 0.25);
            this._background.drawRect(0, 0, ToolbarItem.width, ToolbarItem.height);
            this._background.endFill();
        }
    }

    public click() {
        construction.setType(this.type);
        building.setMaterial(null);

        this.emit('update');
    }
}

export default MaterialToolbarItem;