import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ModalService } from '../../modal/services';
import { ITodo } from '../models';
import { TodosService } from '../services';

@Component({
  selector: 'todos-item',
  templateUrl: './todos-item.component.html',
  styleUrls: ['./todos-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-50px)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateX(0px)', opacity: 1 }))
      ])
    ])
  ]
})
export class TodosItemComponent {
  @Input() public todo: ITodo;

  constructor(
    private todosService: TodosService,
    private snackBar: MatSnackBar,
    private modalService: ModalService,
    private cd: ChangeDetectorRef
  ) {}

  onCompletedChange(completed: boolean): void {
    this.todo.completed = completed;
    this.todosService
      .updateTodo$(this.todo)
      .pipe(
        catchError(() => {
          this.snackBar.open('Could not update the completed status');
          return EMPTY;
        })
      )
      .subscribe();
  }

  onDelete(): void {
    this.modalService
      .openConfirmation$()
      .pipe(
        switchMap(() => this.todosService.deleteTodo$(this.todo.id)),
        catchError(() => {
          this.snackBar.open('Could not delete the todo');
          return EMPTY;
        })
      )
      .subscribe();
  }

  onEdit(): void {
    this.modalService
      .openEditTodo$(this.todo.name)
      .pipe(
        tap((name) => {
          this.todo.name = name;
          this.cd.markForCheck();
        }),
        switchMap(() => this.todosService.updateTodo$(this.todo)),
        catchError(() => {
          this.snackBar.open('Could not update the name');
          return EMPTY;
        })
      )
      .subscribe();
  }
}
