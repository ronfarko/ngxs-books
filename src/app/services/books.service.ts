import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(
    private store: Store,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  async searchBooks(keyword: string, page = 0): Promise<Book[]> {
    return firstValueFrom(
      this.http
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=${keyword}&maxResults=20&startIndex=${
            page * 20
          }`
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
          )
        )
    );
  }

  showSnackbar(msg: string): void {
    this.snackBar.open(msg, '', {
      duration: 2000,
    });
  }
}
