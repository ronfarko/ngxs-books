import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Actions, ofAction, State, StateContext } from '@ngxs/store';

export class Navigate {
  static readonly type = '[router] navigate';
  constructor(public payload: string) {}
}

@State<string>({
  name: 'router',
  defaults: '',
})
export class RouterState {
  constructor(private router: Router) {}

  @Action(Navigate)
  async navigate(ctx: StateContext<string>, action: Navigate) {
    const path = action.payload;
    await this.router.navigate([path]);
    ctx.setState(path);
  }
}

@Injectable()
export class RouteHandler {
  constructor(private router: Router, private action$: Actions) {
    this.action$
      .pipe(ofAction(Navigate))
      .subscribe(({ payload }) => this.router.navigate([payload]));
  }
}
