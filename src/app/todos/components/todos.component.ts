import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, throwError } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EStatus } from '../../core/enums';
import { EFilter } from '../enums';
import { ITodo } from '../models';
import { TodosService } from '../services';

@Component({
  selector: 'todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosComponent implements OnInit, OnDestroy {
  public EStatus = EStatus;
  public EFilter = EFilter;

  public selectedFilter: EFilter = EFilter.All;
  public status: EStatus;
  public todos: ITodo[] = [];

  public newTodoValue: string;

  private destroy$ = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    public todosService: TodosService,
    private snackBar: MatSnackBar
  ) {}

  public get filteredTodos(): ITodo[] {
    if (this.selectedFilter === EFilter.All) {
      return this.todos;
    }

    return this.todos.filter(
      (todo) => todo.completed === (this.selectedFilter === EFilter.Completed)
    );
  }

  ngOnInit(): void {
    this.loadTodos();
    this.initTodosSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTodos(): void {
    this.status = EStatus.Loading;
    this.cd.markForCheck();

    this.todosService.getTodos$().subscribe(
      (todos) => {
        this.status = EStatus.Success;
        this.todosService.todos$.next(todos);
      },
      () => {
        this.status = EStatus.Error;
      },
      () => {
        this.cd.markForCheck();
      }
    );
  }

  initTodosSubscription(): void {
    this.todosService.todos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((todos) => {
        this.todos = todos;
        this.cd.markForCheck();
      });
  }

  onAddTodo(): void {
    const newTodo: ITodo = {
      completed: false,
      name: this.newTodoValue,
      createdAt: Date.now()
    };

    this.todosService
      .addTodo$(newTodo)
      .pipe(
        catchError((e) => {
          this.snackBar.open('Could not add the todo. Please try again later.');
          return throwError(e);
        }),
        tap(() => {
          this.newTodoValue = '';
          this.cd.markForCheck();
        }),
        switchMap(() => this.todosService.reloadTodos$())
      )
      .subscribe();
  }

  trackById(_: number, todo: ITodo): string {
    return todo.id;
  }
}
