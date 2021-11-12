import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MyBook } from 'src/app/models/book.model';
import { AppState } from 'src/app/store/books.state';
import * as actions from '../../store/books.actions';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
})
export class MyBooksComponent {
  @Select(AppState.myBooks) myBooks$!: Observable<MyBook[]>;

  constructor(private store: Store) {}

  removeFromReadingList(book: MyBook): void {
    this.store.dispatch(new actions.MyBooks.Remove(book.id));
  }
}
