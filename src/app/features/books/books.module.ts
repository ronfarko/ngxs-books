import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/* material */
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { BooksRoutingModule } from './books-routing.module';
import { BooksComponent } from './books.component';
import { BookSearchComponent } from '../../components/book-search/book-search.component';

@NgModule({
  declarations: [BooksComponent, BookSearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BooksRoutingModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class BooksModule {}
