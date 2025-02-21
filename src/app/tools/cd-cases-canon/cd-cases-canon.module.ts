import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CDCasesTreeComponent } from './components/tree/cd-cases-tree.component';
import { PhysicsService } from './services/physics.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CDCasesTreeComponent
  ],
  exports: [
    CDCasesTreeComponent
  ],
  providers: [
    PhysicsService
  ]
})
export class CDCasesCanonModule { } 