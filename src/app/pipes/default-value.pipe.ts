import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultValue',
  standalone: true
})
export class DefaultValuePipe implements PipeTransform {
  transform<T>(value: T | null, defaultValue: T): T {
    return value ?? defaultValue;
  }
} 