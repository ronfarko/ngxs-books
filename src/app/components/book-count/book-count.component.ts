import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MyBook } from 'src/app/models/book.model';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-book-count',
  templateUrl: './book-count.component.html',
  styleUrls: ['./book-count.component.scss'],
})
export class BookCountComponent implements OnInit {
  myBooks$: Observable<MyBook[]> = of([]);

  constructor(private booksSvc: BooksService) {}

  ngOnInit(): void {
    this.myBooks$ = this.booksSvc.myBooks$;
  }
}
