import * as pixi from 'pixi.js';

import * as texture from 'texture';
import * as foundations from 'world/foundations';

import Vector from 'math/vector';
import Material from './material';
import GameObject from 'world/objects/object';

class ObjectMaterial extends Material {
    public readonly type: GameObject.Constructor;

    public readonly width: number;
    public readonly height: number;

    private _textures: Array<pixi.Texture>;

    constructor(def: ObjectMaterial.Definition) {
        super(def);

        this.type = def.type;
        
        this.width = def.width;
        this.height = def.height;

        texture.load(def.texture, atlas => {
            let tile = atlas.width / (def.width + def.height) / 2;

            this._textures = [
                new pixi.Rectangle(0, 0, def.width * tile, def.height * tile),
                new pixi.Rectangle(def.width * tile, 0, def.width * tile, def.height * tile),
                new pixi.Rectangle(def.width * tile * 2, 0, def.height * tile, def.width * tile),
                new pixi.Rectangle(def.width * tile * 2 + def.height * tile, 0, def.height * tile, def.width * tile),
            ].map(r => new pixi.Texture(atlas.baseTexture, r));

            this.thumbnail = this._textures[3];
        });
    }

    public isPlaceable(pos: Vector, dir?: Vector) {
        let floor = foundations.getTile(pos.x, pos.y);

        let w: number, h: number;
        if (dir == Vector.up || dir == Vector.down)
            w = this.width, h = this.height;
        
        else
            w = this.height, h = this.width;

        return true;
    }

    public getTexture(dir: Vector) {
        if (dir == Vector.up)
            return this._textures[0];
        
        if (dir == Vector.down)
            return this._textures[1];

        if (dir == Vector.left)
            return this._textures[2];

        return this._textures[3];
    }
}

namespace ObjectMaterial {
    export interface Definition extends Material.Definition {
        type: GameObject.Constructor;

        width: number;
        height: number;

        texture: string;
    }
}

export default ObjectMaterial;