import * as pixi from 'pixi.js';

import * as app from 'app';
import * as camera from 'camera';

import * as blocks from 'world/blocks';
import * as foundations from 'world/foundations';

import './controls';
import Job from './job';

import { EventEmitter } from 'eventemitter3';

export const pending = new Array<Job>();

const events = new EventEmitter<{
    job: Job
}>();

let container = new pixi.Container();

export const on = events.on;
export const once = events.once;

export function addJob(job: Job) {
    pending.push(job);
    container.addChildAt(job.container, 0);

    events.emit('job', job);
}

export function addJobs(jobs: Job[]) {
    pending.push(...jobs);

    for (let job of jobs) {
        container.addChildAt(job.container, 0);

        events.emit('job', job);
    }
}

export function finish(job: Job) {
    if (job.material instanceof blocks.Material)
        blocks.setTile(job.position.x, job.position.y, job.material);

    else if (job.material instanceof foundations.Material)
        foundations.setTile(job.position.x, job.position.y, job.material);

    container.removeChild(job.container);
}

app.hook('init', 'construction', () => {
    camera.addObject(container, 50);
});