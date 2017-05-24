import * as pixi from 'pixi.js';

import * as gui from 'gui';
import * as app from 'app';
import * as mouse from 'input/mouse';

import Vector from 'math/vector';

import ToolbarItem from './item';
import MaterialToolbarItem from './materialItem';

function contains(x: number, y: number, x1: number, y1: number, w: number, h: number): boolean

function contains(p: Vector, x1: number, y1: number, w: number, h: number): boolean
function contains(x: number, y: number, p1: Vector, w: number, h: number): boolean
function contains(x: number, y: number, x1: number, y1: number, size: Vector): boolean

function contains(p: Vector, p1: Vector, w: number, h: number): boolean
function contains(p: Vector, x1: number, y1: number, size: Vector): boolean
function contains(x: number, y: number, p1: Vector, size: Vector): boolean

function contains(p: Vector, p1: Vector, size: Vector): boolean

function contains(...args: any[]) {
    let index = 0;
    let values = Array<number>();

    for (let i = 0; i < 6;) {
        if (args[index] instanceof Vector) {
            values[i++] = args[index].x;
            values[i++] = args[index++].y;
        } else {
            values[i++] = args[index++];
            values[i++] = args[index++];
        }
    }

    return values[0] >= values[2] && values[0] < values[2] + values[4] &&
        values[1] >= values[3] && values[1] < values[3] + values[5];
}

class ToolbarMenu {
    public readonly label: string;
    public readonly contents: ToolbarItem[];
    public readonly container = new pixi.Container();

    public readonly index: number;

    private readonly _popup = new pixi.Container();
    private readonly _button = new pixi.Container();

    private _open: boolean;

    private _position: Vector;
    private _size: Vector;
    private _background = new pixi.Graphics();

    constructor(label: string, index: number) {
        this.label = label;
        this.index = index;
        this.contents = [];

        this.container.addChildAt(this._popup, 1);
        this.container.addChildAt(this._button, 0);

        this._popup.addChildAt(this._background, 0);

        let text = new pixi.Text(label);
        text.style.fontSize = 16;
        text.position.set(16, 15);

        this._button.addChildAt(text, 1);

        app.hook('prerender', 'toolbarmenu:' + index, () => this._update());

        mouse.on('down', 0, e => this._onMouseDown(e));
    }

    private _onMouseDown(e: mouse.MouseButtonEvent) {
        if (e.handled) return;

        let inPopup = contains(mouse.position, this._position, this._size);
        let inButton = contains(mouse.position, this._position.x, app.height - 48, ToolbarItem.width, 48);

        if (inButton) {
            this._open = true;
            this._draw();

            e.handled = true;
        } else if (this._open && inPopup) {
            let rel = e.position.add(this._position.scale(-1));
            let index = Math.floor(rel.y / ToolbarItem.height);

            this.contents[index].click();
            
            this._open = false;
            this._draw();

            e.handled = true;
        }
    }

    private _update() {
        if (!this._open) return;

        let inPopup = contains(mouse.position, this._position, this._size);
        let inButton = contains(mouse.position, this._position.x, app.height - 48, ToolbarItem.width, 48);

        if (!inPopup && !inButton) {
            this._open = false;
            this._draw();
        }
    }

    private _draw() {
        for (let i = 0; i < this.contents.length; i++) {
            let item = this.contents[i];
            item.position = new Vector(0, i * ToolbarItem.height);
            item.update();
        }

        this._position = new Vector(
            this.index * ToolbarItem.width,
            app.height - 48 - ToolbarItem.height * this.contents.length
        );

        this._popup.position = new Vector(this._position.x, -ToolbarItem.height * this.contents.length).toPoint();
        this._button.position = new Vector(this._position.x, 0).toPoint();

        this._size = new Vector(ToolbarItem.width, this.contents.length * ToolbarItem.height);

        this._background.clear();
        this._background.beginFill(0xFFFFFF, 0.75);
        this._background.drawRect(0, 0, this._size.x, this._size.y);
        this._background.endFill();

        this._popup.alpha = this._open ? 1 : 0;
    }

    public addItem(item: ToolbarItem) {
        this.contents.push(item);

        this._popup.addChildAt(item.container, 1);

        this._draw();
    }
}

export default ToolbarMenu;