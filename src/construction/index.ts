import * as pixi from 'pixi.js';

import * as app from 'app';
import * as camera from 'camera';

import * as world from 'world';
import * as materials from 'world/materials';
import * as blocks from 'world/blocks';
import * as objects from 'world/objects';
import * as foundations from 'world/foundations';

import './controls';
import * as jobs from './job';

import Vector from 'math/vector';
import { EventEmitter } from 'eventemitter3';

export const active = new Array<jobs.Base>();

const events = new EventEmitter<{
    job: jobs.Base
}>();

let container = new pixi.Container();

export const on = events.on;
export const once = events.once;

// export function addJob(job: jobs.Base) {
//     active.push(job);
//     container.addChildAt(job.container, 0);

//     events.emit('job', job);
//     job.on('state', () => events.emit('job', job));
// }

export function addJobs(jobs: jobs.Base[], pay: boolean) {
    active.push(...jobs);

    for (let job of jobs) {
        if (pay) {
            if (job.material.cost > world.cash) return;

            world.setCash(world.cash - job.material.cost);
        }

        container.addChildAt(job.container, 0);

        events.emit('job', job);
        job.on('state', () => events.emit('job', job));
    }
}

export function getJob(tile: Vector) {
    for (let job of active) {
        if (tile.x >= job.position.x && tile.x < job.position.x + job.size.x &&
            tile.y >= job.position.y && tile.y < job.position.y + job.size.y) {
            return job;
        }
    }

    return null;
}

export function cancel(job: jobs.Base) {
    job.state = jobs.State.CANCELLED;

    remove(job);
}

export function finish(job: jobs.Base) {
    job.state = jobs.State.COMPLETED;
    job.finish();

    remove(job);
}

function remove(job: jobs.Base) {
    container.removeChild(job.container);

    let index = active.indexOf(job);
    if (index >= 0) active.splice(index, 1);
}

app.hook('init', 'construction', () => {
    camera.addObject(container, 50);
});