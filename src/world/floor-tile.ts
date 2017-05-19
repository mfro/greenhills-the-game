import * as pixi from 'pixi.js';
import Vector from 'math/vector';

import FloorMaterial from './floor-material';

class FloorTile {
    public readonly material: FloorMaterial;
    public readonly position: Vector;

    public readonly sprite: pixi.Sprite;

    constructor(material: FloorMaterial, pos: Vector) {
        this.material = material;
        this.position = pos;

        let length = material.textures.length;
        let index = Math.floor(Math.random() * length);
    
        this.sprite = new pixi.Sprite(material.textures[index]);
        this.sprite.position = this.position.toPoint();
        this.sprite.width = 1;
        this.sprite.height = 1;
    }
}

export default FloorTile;