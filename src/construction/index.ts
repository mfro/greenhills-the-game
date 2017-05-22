import * as blocks from 'world/blocks';
import * as foundations from 'world/foundations';

import './controls';
import Job from './job';

export const pending = new Array<Job>();

export function addJob(job: Job) {
    pending.push(job);
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