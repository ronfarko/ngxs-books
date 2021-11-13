import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Book, MyBook } from '../models/book.model';
import { BooksService } from '../services/books.service';
import * as actions from './books.actions';

export interface BooksStateModel {
  loadingCount: number;
  searchTerm: string;
  page: number;
  booksList: Book[];
  myBooks: MyBook[];
}

@State<BooksStateModel>({
  name: 'app',
  defaults: {
    loadingCount: 0,
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
  addMyBook(ctx: StateContext<BooksStateModel>, action: actions.MyBooks.Add) {
    const state = ctx.getState();
    const myBook = {
      ...action.book,
      dateAdded: new Intl.DateTimeFormat('en-US').format(new Date()),
    }; // mark book as Added
    const books = [...state.booksList];
    const index = books.findIndex((b) => b.id === action.book.id);
    books.splice(index, 1, {
      ...books[index],
      isAdded: true,
    });
    ctx.patchState({
      booksList: books,
      myBooks: [...state.myBooks, myBook],
    });
    this.booksSvc.showSnackbar(`Added: ${myBook.title}`);
  } // ----------- Remove My Book -----------

  @Action(actions.MyBooks.Remove)
  removeMyBook(
    ctx: StateContext<BooksStateModel>,
    action: actions.MyBooks.Remove
  ) {
    const state = ctx.getState();
    const index = state.myBooks.findIndex((b) => b.id === action.bookId);
    if (index >= 0) {
      // mark book as Not-Added
      const booksList = [...state.booksList];
      const booksIndex = booksList.findIndex((b) => b.id === action.bookId);
      booksList.splice(booksIndex, 1, {
        ...booksList[booksIndex],
        isAdded: false,
      });
      const myBooks = [...state.myBooks];
      const deletedBook = myBooks.splice(index, 1);
      ctx.patchState({
        booksList: booksList,
        myBooks: myBooks,
      });
      this.booksSvc.showSnackbar(`Removed: ${deletedBook[0]?.title}`);
    }
  }

  // ----------- Show Loding -----------
  @Action(actions.Loading.Show)
  showLoading(
    ctx: StateContext<BooksStateModel>,
    action: actions.Loading.Show
  ) {
    const state = ctx.getState();
    const newCount = state.loadingCount + 1;
    ctx.patchState({
      loadingCount: newCount,
    });
  }

  // ----------- Hide Loding -----------
  @Action(actions.Loading.Hide)
  hideLoading(
    ctx: StateContext<BooksStateModel>,
    action: actions.Loading.Hide
  ) {
    const state = ctx.getState();
    const newCount = state.loadingCount > 0 ? state.loadingCount - 1 : 0;
    ctx.patchState({
      loadingCount: newCount,
    });
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

  @Selector()
  static showLoading(state: BooksStateModel) {
    return state.loadingCount > 0;
  }
}
