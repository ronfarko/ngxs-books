import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngxs/store';
import * as actions from '../store/books.actions';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.store.dispatch(new actions.Loading.Show());
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.store.dispatch(new actions.Loading.Hide());
          }
        },
        () => {
          this.store.dispatch(new actions.Loading.Hide());
        }
      )
    );
  }
}
