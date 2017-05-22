import * as pixi from 'pixi.js';
import * as camera from 'camera';

import * as world from 'world';
import * as blocks from 'world/blocks'

import Vector from 'math/vector';
import Array2D from 'math/array2d';

const unitVectors = [
    new Vector(0, 1),
    new Vector(1, 0),
    new Vector(0, -1),
    new Vector(-1, 0),
];

export function debug(path: Vector[]) {
    let graphics = new pixi.Graphics();

    graphics.lineStyle(1 / 32, 0xFF0000, 0.8);

    graphics.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
        graphics.lineTo(path[i].x, path[i].y);
    }

    camera.addObject(graphics, 1000);

    setTimeout(() => {
        camera.removeObject(graphics);
    }, 5000);
}

function debug_astar(grid: Array2D<AStartNode>) {
    let graphics = new pixi.Graphics();

    camera.addObject(graphics, 1000);

    setTimeout(() => camera.removeObject(graphics), 2000);

    let maxF: AStartNode = null;

    for (let x = 0; x < grid.xSize; x++) {
        for (let y = 0; y < grid.ySize; y++) {
            let node = grid.get(x, y);
            if (!node) continue;

            if (!maxF || node.f > maxF.f)
                maxF = node;
        }
    }

    for (let x = 0; x < grid.xSize; x++) {
        for (let y = 0; y < grid.ySize; y++) {
            let node = grid.get(x, y);
            if (!node) continue;

            graphics.beginFill(0x0000FF, node.f / maxF.f);
            graphics.drawRect(x, y, 1, 1);
            graphics.endFill();
        }
    }
}

interface AStartNode {
    f: number;
    g: number;
    point: Vector;
    parent: Vector;
}

function costEstimate(start: Vector, end: Vector) {
    let diff = end.add(start.scale(-1));

    return diff.length;
}

function hitTest(start: Vector, end: Vector) {
    let min = new Vector(Math.min(start.x, end.x), Math.min(start.y, end.y));
    let max = new Vector(Math.max(start.x, end.x), Math.max(start.y, end.y));

    min = min.apply(Math.floor);
    max = max.apply(Math.floor);

    for (let x = min.x; x <= max.x; x++) {
        for (let y = min.y; y <= max.y; y++) {
            let block = blocks.getTile(x, y);
            if (!block.material.isSolid) continue;

            let top = intersect(new Vector(x, y), new Vector(x + 1, y), start, end);
            if (top) return true;

            let left = intersect(new Vector(x, y), new Vector(x, y + 1), start, end);
            if (left) return true;

            let right = intersect(new Vector(x + 1, y), new Vector(x + 1, y + 1), start, end);
            if (right) return true;

            let bottom = intersect(new Vector(x, y + 1), new Vector(x + 1, y + 1), start, end);
            if (bottom) return true;
        }
    }

    return false;
}

function intersect(start1: Vector, end1: Vector, start2: Vector, end2: Vector) {
    let s1 = end1.add(start1.scale(-1));
    let s2 = end2.add(start2.scale(-1));

    let s = (-s1.y * (start1.x - start2.x) + s1.x * (start1.y - start2.y)) / (-s2.x * s1.y + s1.x * s2.y);
    let t = (+s2.x * (start1.y - start2.y) - s2.y * (start1.x - start2.x)) / (-s2.x * s1.y + s1.x * s2.y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        return new Vector(
            start1.x + t * s1.x,
            start1.y + t * s1.y
        );
    }

    return null;
}

export function smooth(path: Vector[], radius: number) {
    let index = 0;

    for (let startI = 0; startI < path.length; startI++) {
        let start = path[startI];
        let endI = startI;

        for (let i = path.length - 1; i > startI; i--) {
            let end = path[i];
            if (hitTest(start, end))
                continue;

            let diff = end.add(start.scale(-1));
            let a = Vector.polar(diff.direction + Math.PI / 2, radius);
            let b = Vector.polar(diff.direction - Math.PI / 2, radius);

            if (hitTest(start.add(a), end.add(a)))
                continue;

            if (hitTest(start.add(b), end.add(b)))
                continue;

            endI = i;
            break;
        }

        if (endI == startI)
            continue;

        path.splice(startI + 1, endI - startI - 1);
    }
}

export function astar(start: Vector, end: Vector) {
    let rawStart = start;
    let rawEnd = end;

    start = start.apply(Math.floor);
    end = end.apply(Math.floor);

    let openList = [start];

    let openSet = new Set<number>();
    let closedSet = new Set<number>();

    let grid = new Array2D<AStartNode>(world.size.x, world.size.y);

    grid.set(start, {
        f: costEstimate(start, end),
        g: 0,
        point: start,
        parent: null
    });

    while (openList.length > 0) {
        let lowInd = 0;
        let lowNode = grid.get(openList[0]);

        for (let i = 1; i < openList.length; i++) {
            let node = grid.get(openList[i]);
            if (node.f < lowNode.f) {
                lowNode = node;
                lowInd = i;
            }
        }

        let current = openList.splice(lowInd, 1)[0];

        if (current.equals(end)) {
            let path = [current.add(0.5, 0.5)];
            let node = grid.get(current);

            while (node.parent != null) {
                current = node.parent;
                path.unshift(current.add(0.5, 0.5));
                node = grid.get(current);
            }

            path[0] = rawStart;
            path[path.length - 1] = rawEnd;

            return path;
        }

        closedSet.add(current.x * world.size.x + current.y);

        let node = grid.get(current);

        for (let unit of unitVectors) {
            let neighbor = current.add(unit);

            if (neighbor.x < 0 || neighbor.x >= world.size.x ||
                neighbor.y < 0 || neighbor.y >= world.size.y)
                continue;

            let block = blocks.getTile(neighbor.x, neighbor.y);
            if (block.material.isSolid && !neighbor.equals(end))
                continue;

            let u = neighbor.x * world.size.x + neighbor.y;

            if (closedSet.has(u))
                continue;

            let gScore = grid.get(current).g + 1;
            let node = grid.get(neighbor);

            if (!openSet.has(u))
                openSet.add(u), openList.push(neighbor);
            else if (node && node.g > gScore)
                continue;

            grid.set(neighbor, node = {
                f: costEstimate(start, neighbor) + costEstimate(neighbor, end),
                g: gScore,
                point: neighbor,
                parent: current,
            });
        }
    }

    return null;
}

export function gridLocked(from: Vector, to: Vector) {
    if (to.equals(from))
        return [];

    if (to.x < 0 || to.x >= world.size.x ||
        to.y < 0 || to.y >= world.size.y)
        return null;

    let block = blocks.getTile(to.x, to.y);
    if (block.material.isSolid)
        return null;

    let checked = new Set<number>();
    let points = unitVectors.map(a => ({
        from: null,
        step: a,
        total: from.add(a)
    }));

    while (points.length > 0) {
        let p = points.shift();

        if (p.total.equals(to)) {
            let path = [];
            while (p) {
                path.unshift(p.total);
                p = p.from;
            }
            return path;
        }

        if (p.total.x < 0 || p.total.x >= world.size.x ||
            p.total.y < 0 || p.total.y >= world.size.y)
            continue;

        let u = p.total.x * world.size.x + p.total.y;
        if (checked.has(u))
            continue;

        checked.add(u);

        let block = blocks.getTile(p.total.x, p.total.y);
        if (block.material.isSolid)
            continue;

        for (let step of unitVectors) {
            points.push({
                from: p,
                step: step,
                total: p.total.add(step)
            });
        }
    }

    return null;
}