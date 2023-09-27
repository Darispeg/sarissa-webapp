import { Injectable } from '@angular/core';
import { TaskGantt } from '../models/gantt-task.types';
import { TasksService } from '../../tasks/tasks.service';
import { TaskInfo } from 'app/modules/project/projects.types';

@Injectable()
export class GanttTaskService {

    tasksGantt : TaskGantt[] = [];

    constructor(private _taskService: TasksService){}

    get(): Promise<TaskGantt[]>{        
        this._taskService.tasks$
            .subscribe((tasksList : TaskInfo[]) => {
                this.tasksGantt = [];
                
                tasksList.forEach(task => {
                    this.tasksGantt.push(
                        {
                            id : task.id,
                            text : task.title,
                            start_date : new Date(task.start_date),
                            duration : this.calculateDays(task.start_date, task.task_completion.target_completion),
                            progress : (task.progress / 100),
                            parent : task.parent != null ? task.parent : ''
                        }
                    )
                });
            })
        
        return Promise.resolve(this.tasksGantt);
    }

    private calculateDays(start, finish) : number {
        const finish_date = new Date(finish);
        const start_date = new Date(start);

        const diference = finish_date.getTime() - new Date(start_date).getTime();

        const days = Math.floor(diference / (1000 * 60 * 60 * 24));
        return days;
    }
}