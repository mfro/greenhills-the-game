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

    public get isValid() { return this._isValid; }

    private _isValid = false;

    private _graphics = new pixi.Graphics();

    constructor(def: Region.Definition) {
        this.id = def.id;
        this.requirements = def.requirements;

        this.container.addChildAt(this._graphics, 0);

        world.on('change', this._draw, this);
    }

    private _getEdges() {
        let has = (t: Vector, o: Vector) => this.tiles.find(v => v.equals(t.add(o))) != null;

        let edges = new Array<{ a: Vector, b: Vector }>();
        for (let tile of this.tiles) {
            for (let unit of Vector.units)
                if (!has(tile, unit))
                    edges.push({ a: tile, b: unit });
            // if (!has(tile, Vector.up))
            //     edges.push({ a: tile, b: tile.add(1, 0) });

            // if (!has(tile, Vector.left))
            //     edges.push({ a: tile, b: tile.add(0, 1) });

            // if (!has(tile, Vector.down))
            //     edges.push({ a: tile.add(0, 1), b: tile.add(1, 1) });

            // if (!has(tile, Vector.right))
            // edges.push({ a: tile.add(1, 0), b: tile.add(1, 1) });
        }

        return edges;
    }

    private _draw() {
        let color: number;
        if (this.isValid)
            color = 0x00FF00;
        else
            color = 0xFF0000;

        this._graphics.clear();

        this._graphics.lineStyle(4 / 33, color, 0.5);
        for (let edge of this._getEdges()) {
            if (edge.b == Vector.up) {
                this._graphics.moveTo(edge.a.x, edge.a.y + 2 / 33);
                this._graphics.lineTo(edge.a.x + 1, edge.a.y + 2 / 33);
            }

            else if (edge.b == Vector.left) {
                this._graphics.moveTo(edge.a.x + 2 / 33, edge.a.y);
                this._graphics.lineTo(edge.a.x + 2 / 33, edge.a.y + 1);
            }

            else if (edge.b == Vector.down) {
                this._graphics.moveTo(edge.a.x, edge.a.y + 1 - 2 / 33);
                this._graphics.lineTo(edge.a.x + 1, edge.a.y + 1 - 2 / 33);
            }

            else if (edge.b == Vector.right) {
                this._graphics.moveTo(edge.a.x + 1 - 2 / 33, edge.a.y);
                this._graphics.lineTo(edge.a.x + 1 - 2 / 33, edge.a.y + 1);
            }
        }
    }

    protected update() {
        this._isValid = this.validate();

        this._draw();
    }

    protected validate() {
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

        this.update();
        world.change();
    }

    removeTile(tile: Vector) {
        let index = this.tiles.findIndex(t => Vector.equals(t, tile));
        if (index < 0) return;
        this.tiles.splice(index, 1);

        if (this.tiles.length == 0) {
            regions.removeRegion(this);
        } else {
            this.update();
            world.change();
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
