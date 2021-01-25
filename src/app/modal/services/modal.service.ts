import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfirmationComponent, EditTodoComponent } from '../components';
import { ModalModule } from '../modal.module';

@Injectable({
  providedIn: ModalModule
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  openConfirmation$(): Observable<boolean> {
    return this.dialog
      .open(ConfirmationComponent)
      .afterClosed()
      .pipe(filter((confirmed) => !!confirmed));
  }

  openEditTodo$(todoName: string): Observable<string> {
    return this.dialog
      .open(EditTodoComponent, { data: todoName })
      .afterClosed()
      .pipe(filter((name) => name !== null));
  }
}
