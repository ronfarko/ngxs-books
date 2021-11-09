import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MyBook } from 'src/app/models/book.model';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
})
export class MyBooksComponent implements OnInit {
  myBooks$: Observable<MyBook[]> = of([]);

  constructor(private booksSvc: BooksService) {}

  ngOnInit(): void {
    this.myBooks$ = this.booksSvc.myBooks$;
  }

  removeFromReadingList(book: MyBook): void {
    this.booksSvc.removeMyBook(book);
  }
}
