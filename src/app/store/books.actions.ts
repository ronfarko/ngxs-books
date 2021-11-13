import { Book } from '../models/book.model';

export namespace BooksList {
  export class Search {
    static readonly type = '[Book Search] Load Books';
    constructor(public term: string) {}
  }

  export class LoadMore {
    static readonly type = '[Book Search] Add Books';
  }
}

export namespace MyBooks {
  export class Add {
    static readonly type = '[Book Search] Add My Book';
    constructor(public book: Book) {}
  }

  export class Remove {
    static readonly type = '[My Books] Remove My Book';
    constructor(public bookId: string) {}
  }
}

export namespace Loading {
  export class Show {
    static readonly type = '[Book Search] Show Loading';
  }

  export class Hide {
    static readonly type = '[Book Search] Hide Loading';
  }
}
