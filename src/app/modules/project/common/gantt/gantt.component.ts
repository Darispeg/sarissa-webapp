import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { gantt } from 'dhtmlx-gantt';
import { GanttLinkService } from './services/gantt-link.service';
import { GanttTaskService } from './services/gantt-task.service';
import { CommonsComponent } from '../common.component';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'gantt',
    styleUrls: ['./gantt.component.css'],
    providers: [GanttTaskService, GanttLinkService],
    templateUrl : './gantt.component.html',
})

export class GanttComponent implements OnInit {
    
    @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;

    constructor(
        private _commonsComponent: CommonsComponent,
        private taskService: GanttTaskService, 
        private linkService: GanttLinkService) { }

    ngOnInit() {
        gantt.config.date_format = '%Y-%m-%d %H:%i';


        gantt.init(this.ganttContainer.nativeElement);


        Promise.all([this.taskService.get(), this.linkService.get()])
            .then(([data, links]) => {
                gantt.parse({ data, links });
            });
    }

    toggleDrawer(): void
    {
        this._commonsComponent.matDrawer.toggle();
    }
}