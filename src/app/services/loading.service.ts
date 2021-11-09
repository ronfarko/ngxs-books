import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  showCountSubject = new BehaviorSubject<number>(0);

  get showLoading$(): Observable<boolean> {
    return this.showCountSubject.asObservable().pipe(map((count) => count > 0));
  }

  show(): void {
    this.showCountSubject.next(this.showCountSubject.value + 1);
  }

  hide(): void {
    const val = this.showCountSubject.value;
    this.showCountSubject.next(val > 0 ? val - 1 : 0);
  }
}
