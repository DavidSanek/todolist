import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { ITodo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  public todos$ = new BehaviorSubject<ITodo[]>([]);

  constructor(private http: HttpClient) {}

  public getTodos$(): Observable<ITodo[]> {
    return this.http
      .get<ITodo[]>('/api/todos')
      .pipe(
        map((todos) =>
          todos.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        )
      );
  }

  public deleteTodo$(id: string): Observable<void> {
    return this.todos$.pipe(take(1)).pipe(
      tap((todos) => this.todos$.next(todos.filter((t) => t.id !== id))),
      switchMap(() => this.http.delete<void>(`/api/todos/${id}`))
    );
  }

  public updateTodo$(todo: ITodo): Observable<void> {
    return this.todos$.pipe(take(1)).pipe(
      tap((todos) => {
        const i = todos.findIndex((t) => t === todo);
        todos[i] = todo;
        this.todos$.next(todos);
      }),
      switchMap(() => this.http.put<void>(`/api/todos/${todo.id}`, todo))
    );
  }

  public addTodo$(todo: ITodo): Observable<void> {
    return this.http.post<void>(`/api/todos`, todo);
  }

  public reloadTodos$(): Observable<ITodo[]> {
    return this.getTodos$().pipe(tap((todos) => this.todos$.next(todos)));
  }
}
