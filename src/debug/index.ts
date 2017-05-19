import * as pixi from 'pixi.js';
import * as lifecycle from 'lifecycle';

import * as input from 'input/world';
import * as world from 'world';

lifecycle.hook('init', 'debug-1', app => {
    // app.stage;
});