import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'modal-edit-todo',
  templateUrl: './edit-todo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTodoComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public todoName: string) {}
}
