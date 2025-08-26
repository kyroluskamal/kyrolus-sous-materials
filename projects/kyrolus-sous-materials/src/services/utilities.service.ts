import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  generateUniqueId(prefix: string = 'id'): string {
    return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
  }
}
