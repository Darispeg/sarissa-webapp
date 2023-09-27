import { Injectable } from '@angular/core';
import { LinkGantt } from '../models/gantt-link.types';

@Injectable()
export class GanttLinkService {
    get(): Promise<LinkGantt[]> {
        return Promise.resolve([
            { id: 1, source: 0, target: 0, type: '0' }
        ]);
    }
}