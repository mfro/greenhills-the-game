import * as pixi from 'pixi.js';

import * as world from 'world';
import * as regions from 'regions';
import * as materials from 'world/materials';
import * as requirements from './requirements';

import Vector from 'math/vector';

class Region {
    public readonly id: string;
    public readonly requirements: Array<requirements.Base>

    public readonly tiles = new Array<Vector>();
    public readonly container = new pixi.Container();

    private _graphics = new pixi.Graphics();

    constructor(def: Region.Definition) {
        this.id = def.id;
        this.requirements = def.requirements;

        this.container.addChildAt(this._graphics, 0);

        world.on('change', this._draw, this);
    }

    private _draw() {
        let color: number;
        if (this.validate())
            color = 0x00FF00;
        else
            color = 0xFF0000;

        this._graphics.clear();
        this._graphics.beginFill(color, 0.2);

        for (let tile of this.tiles) {
            this._graphics.drawRect(tile.x, tile.y, 1, 1);
        }

        this._graphics.endFill();
    }

    validate() {
        for (let req of this.requirements) {
            if (!req.validate(this.tiles))
                return false;
        }

        return true;
    }

    addTile(...tiles: Vector[]) {
        for (let tile of tiles) {
            let old = regions.getRegion(tile);
            if (old != null) {
                old.removeTile(tile);
            }

            this.tiles.push(tile);
        }

        this._draw();
    }

    removeTile(tile: Vector) {
        let index = this.tiles.findIndex(t => Vector.equals(t, tile));
        if (index < 0) return;
        this.tiles.splice(index, 1);

        if (this.tiles.length == 0) {
            regions.removeRegion(this);
        } else {
            this._draw();
        }
    }
}

namespace Region {
    export interface Definition {
        id: string;
        name: string;

        constructor: new (def: Definition) => Region;
        requirements?: requirements.Base[];
    }
}

export default Region;
