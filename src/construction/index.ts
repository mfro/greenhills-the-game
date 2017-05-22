import * as blocks from 'world/blocks';
import * as foundations from 'world/foundations';

import './controls';
import Job from './job';

import { EventEmitter } from 'eventemitter3';

export const pending = new Array<Job>();

const events = new EventEmitter<{
    job: Job
}>();

export const on = events.on;
export const once = events.once;

export function addJob(job: Job) {
    pending.push(job);

    events.emit('job', job);
}

export function addJobs(jobs: Job[]) {
    pending.push(...jobs);

    for (let job of jobs) {
        events.emit('job', job);
    }
}

export function finish(job: Job) {
    switch (job.type) {
        case Job.Type.Block:
            blocks.setTile(job.position.x, job.position.y, job.material as blocks.Material);
            break;

        case Job.Type.Foundation:
            foundations.setTile(job.position.x, job.position.y, job.material as foundations.Material);
            break;
    }
}
