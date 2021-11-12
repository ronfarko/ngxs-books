import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/books.state';

@Component({
  selector: 'app-book-count',
  templateUrl: './book-count.component.html',
  styleUrls: ['./book-count.component.scss'],
})
export class BookCountComponent {
  @Select(AppState.myBooksCount) count$!: Observable<number>;
}
