import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { merge, Observable } from 'rxjs';
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
    const dialog = this.dialog.open<EditTodoComponent, string, string>(
      EditTodoComponent,
      { data: todoName }
    );

    return merge(dialog.afterClosed()).pipe(filter((name) => !!name));
  }
}
