import * as pixi from 'pixi.js';
import * as lifecycle from './lifecycle';

import './util/math';
import './util/container';

import './html';

import './gui';
import './world';

import './debug';

import './construction';

let app = new pixi.Application(window.innerWidth, window.innerHeight);

window.addEventListener('load', () => {
    app.renderer.backgroundColor = 0xFFFFFF;

    app.view.addEventListener('contextmenu', e => e.preventDefault());
    
    document.body.appendChild(app.view);
});

pixi.loader.load(() => {
    lifecycle.emit('init', app);
});