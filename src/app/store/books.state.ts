import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Book, MyBook } from '../models/book.model';
import { BooksService } from '../services/books.service';
import * as actions from './books.actions';

export interface BooksStateModel {
  searchTerm: string;
  page: number;
  booksList: Book[];
  myBooks: MyBook[];
}

@State<BooksStateModel>({
  name: 'app',
  defaults: {
    searchTerm: '',
    page: 0,
    booksList: [],
    myBooks: [],
  },
})
@Injectable()
export class AppState {
  constructor(private booksSvc: BooksService) {}

  // ----------- Search action -----------
  @Action(actions.BooksList.Search)
  async searchBooks(
    ctx: StateContext<BooksStateModel>,
    action: actions.BooksList.Search
  ) {
    const books = await this.booksSvc.searchBooks(action.term, 0);
    ctx.patchState({
      searchTerm: action.term,
      page: 0,
      booksList: books,
    });
  }

  // ----------- LoadMore Action -----------
  @Action(actions.BooksList.LoadMore)
  async addMoreBooks(
    ctx: StateContext<BooksStateModel>,
    action: actions.BooksList.LoadMore
  ) {
    const state = ctx.getState();
    const page = state.page + 1;
    const books = await this.booksSvc.searchBooks(state.searchTerm, page);
    ctx.patchState({
      page: page,
      booksList: state.booksList.concat(books),
    });
  }

  // ----------- Add My Book -----------
  @Action(actions.MyBooks.Add)
  async addMyBook(
    ctx: StateContext<BooksStateModel>,
    action: actions.MyBooks.Add
  ) {
    const state = ctx.getState();

    // check if book already exists
    if (state.myBooks.findIndex((b) => b.id === action.book.id) < 0) {
      const myBook = {
        ...action.book,
        dateAdded: new Intl.DateTimeFormat('en-US').format(new Date()),
      };

      ctx.patchState({
        myBooks: [...state.myBooks, myBook],
      });

      this.booksSvc.showSnackbar(`Added: ${myBook.title}`);
    } else {
      this.booksSvc.showSnackbar('This book is alredy in the Reading List');
    }
  }

  // ----------- Remove My Book -----------
  @Action(actions.MyBooks.Remove)
  async removeMyBook(
    ctx: StateContext<BooksStateModel>,
    action: actions.MyBooks.Remove
  ) {
    const state = ctx.getState();
    const index = state.myBooks.findIndex((b) => b.id === action.bookId);
    if (index >= 0) {
      const myBooks = [...state.myBooks];
      const deletedBook = myBooks.splice(index, 1);
      ctx.patchState({
        myBooks: myBooks,
      });

      this.booksSvc.showSnackbar(`Removed: ${deletedBook[0]?.title}`);
    }
  }

  // ----------- selectors -----------
  @Selector()
  static booksList(state: BooksStateModel) {
    return state.booksList;
  }

  @Selector()
  static myBooks(state: BooksStateModel) {
    return state.myBooks;
  }

  @Selector()
  static myBooksCount(state: BooksStateModel) {
    return state.myBooks.length;
  }
}
