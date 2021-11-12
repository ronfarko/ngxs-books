import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Book } from 'src/app/models/book.model';
import { AppState } from 'src/app/store/books.state';
import * as actions from '../../store/books.actions';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent {
  searchForm = this.fb.group({
    term: '',
  });

  @Select(AppState.booksList) books$!: Observable<Book[]>;

  constructor(private store: Store, private readonly fb: FormBuilder) {}

  searchBooks(): void {
    const term = this.searchForm.value.term;
    if (term) {
      this.store.dispatch(new actions.BooksList.Search(term));
    }
  }

  formatDate(date: void | string): string {
    return date ? new Intl.DateTimeFormat('en-US').format(new Date(date)) : '';
  }

  addBook(book: Book): void {
    this.store.dispatch(new actions.MyBooks.Add(book));
  }

  loadNextPage(): void {
    this.store.dispatch(new actions.BooksList.LoadMore());
  }
}
