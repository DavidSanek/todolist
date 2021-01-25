import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'modal-confirmation',
  templateUrl: './confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationComponent {}
