import * as pixi from 'pixi.js';

import Material from './material';

interface FloorMaterial extends Material {
    indoor: boolean;
}

namespace FloorMaterial {
    interface Definition extends Material.Definition {
        indoor?: boolean;
    }

    function define(arg: Definition): FloorMaterial {
        return Object.assign(Material.define(arg), {
            indoor: arg.indoor || false,
        });
    }

    export const DIRT = define({
        id: 'DIRT',
        texture: 'floors/dirt.png'
    });
    
    export const GRASS = define({
        id: 'GRASS',
        texture: 'floors/grass.png'
    });

    export const CONCRETE = define({
        id: 'CONCRETE',
        texture: 'floors/concrete.png',
        indoor: true,
    });
}

export default FloorMaterial;