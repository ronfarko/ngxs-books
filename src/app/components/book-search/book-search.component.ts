import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Book } from 'src/app/models/book.model';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent {
  searchForm = this.fb.group({
    term: '',
  });

  books$: Observable<Book[]> = of([]);

  constructor(private readonly fb: FormBuilder, private bookSvc: BooksService) {
    this.books$ = this.bookSvc.books$;
  }

  searchBooks(): void {
    const term = this.searchForm.value.term;
    console.log(term);
    if (term) {
      this.bookSvc.searchBooks(term);
    }
  }

  formatDate(date: void | string): string {
    return date ? new Intl.DateTimeFormat('en-US').format(new Date(date)) : '';
  }

  addBook(book: Book): void {
    this.bookSvc.addMyBook(book);
  }
}
