import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book, MyBook } from '../models/book.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private myBooks: MyBook[] = [];

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  async searchBooks(keyword: string): Promise<Book[]> {
    const resp: any = await firstValueFrom(
      this.http.get(`https://www.googleapis.com/books/v1/volumes?q=${keyword}`)
    );

    return resp.items.map((item: any) => {
      return {
        id: item.id,
        title: item.volumeInfo?.title,
        authors: item.volumeInfo?.authors || [],
        description: item.searchInfo?.textSnippet,
        publisher: item.volumeInfo?.publisher,
        publishedDate: item.volumeInfo?.publishedDate
          ? new Date(item.volumeInfo?.publishedDate).toISOString()
          : '',
        coverUrl: item.volumeInfo?.imageLinks?.thumbnail,
      };
    });
  }

  getMyBooks(): MyBook[] {
    return this.myBooks;
  }

  getMyBooksCount(): number {
    return this.myBooks.length;
  }

  addMyBook(book: Book): void {
    if (this.myBooks.findIndex((b) => b.id === book.id) >= 0) {
      this.showSnackbar('Book is already in your list');
      return;
    }

    this.myBooks.push({
      ...book,
      dateAdded: new Intl.DateTimeFormat('en-US').format(new Date()),
    });
    this.showSnackbar('Book is added');
  }

  removeMyBook(book: MyBook): void {
    const index = this.myBooks.indexOf(book);
    if (index >= 0) {
      this.myBooks.splice(index, 1);
      this.showSnackbar('Book is removed');
    }
  }

  private showSnackbar(msg: string): void {
    this.snackBar.open(msg, '', {
      duration: 1000,
    });
  }
}
