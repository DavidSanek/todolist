import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
    return this.http.delete<void>(`/api/todos/${id}`);
  }

  public updateTodo$(todo: ITodo): Observable<void> {
    return this.http.put<void>(`/api/todos/${todo.id}`, todo);
  }

  public addTodo$(todo: ITodo): Observable<void> {
    return this.http.post<void>(`/api/todos`, todo);
  }

  public reloadTodos$(): Observable<ITodo[]> {
    return this.getTodos$().pipe(tap((todos) => this.todos$.next(todos)));
  }
}
