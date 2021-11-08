import { Component, OnInit } from '@angular/core';
import { MyBook } from 'src/app/models/book.model';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
})
export class MyBooksComponent implements OnInit {
  myBooks: MyBook[] = [];

  constructor(private booksSvc: BooksService) {}

  ngOnInit(): void {
    this.myBooks = this.booksSvc.getMyBooks();
  }

  removeFromReadingList(book: MyBook): void {
    this.booksSvc.removeMyBook(book);
  }
}
