import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollHelperService } from './scroll-helper.service';

/**
 * Provides all shared services for the application
 * 【✓】
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ScrollHelperService
  ],
  exports: []
})
export class ServicesModule { } 