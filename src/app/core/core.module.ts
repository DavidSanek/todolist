import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './components';

@NgModule({
  imports: [CommonModule, MatButtonModule, RouterModule],
  declarations: [MenuComponent],
  exports: [MenuComponent],
})
export class CoreModule {}
