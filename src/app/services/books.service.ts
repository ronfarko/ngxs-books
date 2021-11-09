import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book, MyBook } from '../models/book.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private booksSubject = new BehaviorSubject<Book[]>([]);
  private myBooksSubject = new BehaviorSubject<MyBook[]>([]);

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  get myBooks$(): Observable<MyBook[]> {
    return this.myBooksSubject.asObservable();
  }

  get books$(): Observable<Book[]> {
    return this.booksSubject.asObservable();
  }

  async searchBooks(keyword: string): Promise<void> {
    await firstValueFrom(
      this.http
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=${keyword}&maxResults=20&startIndex=1`
        )
        .pipe(
          map((resp: any) => resp.items),
          map((items) =>
            items.map((item: any) => ({
              id: item.id,
              title: item.volumeInfo?.title,
              authors: item.volumeInfo?.authors || [],
              description: item.searchInfo?.textSnippet,
              publisher: item.volumeInfo?.publisher,
              publishedDate: item.volumeInfo?.publishedDate
                ? new Date(item.volumeInfo?.publishedDate).toISOString()
                : '',
              coverUrl: item.volumeInfo?.imageLinks?.thumbnail,
            }))
          ),
          tap((books) => {
            this.booksSubject.next(books);
          })
        )
    );
  }

  addMyBook(book: Book): void {
    const books = this.myBooksSubject.value;
    if (books.findIndex((b) => b.id === book.id) >= 0) {
      this.showSnackbar('Book is already in your list');
      return;
    }

    books.push({
      ...book,
      dateAdded: new Intl.DateTimeFormat('en-US').format(new Date()),
    });

    this.myBooksSubject.next(books);
    this.showSnackbar('Book is added');
  }

  removeMyBook(book: MyBook): void {
    const books = this.myBooksSubject.value;
    const index = books.indexOf(book);
    if (index >= 0) {
      books.splice(index, 1);
      this.myBooksSubject.next(books);
      this.showSnackbar('Book is removed');
    }
  }

  private showSnackbar(msg: string): void {
    this.snackBar.open(msg, '', {
      duration: 1000,
    });
  }
}
