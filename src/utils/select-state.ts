import { ContextConsumer } from '@lit/context';
import { ReactiveController, ReactiveElement } from 'lit';
import { Actor, Subscribable } from 'xstate';
import { appContext, AppMachine } from '../state/app.machine';
import { SelectorController } from 'xstate-lit';

const defaultCompare = (a: any, b: any) => a === b;

type AppService = Actor<AppMachine>;
export class SelectState<
  T,
  TEmitted = AppService extends Subscribable<infer Emitted> ? Emitted : never,
> implements ReactiveController
{
  private serviceContext: ContextConsumer<typeof appContext, ReactiveElement>;
  private selectorController?: SelectorController<AppService, T, TEmitted>;
  private host: ReactiveElement;

  private selector: (emitted: TEmitted) => T;
  compare: (a: T, b: T) => boolean = defaultCompare; // is current value same as old value?

  constructor(
    host: ReactiveElement,
    selector: (emitted: TEmitted) => T,
    compare: (a: T, b: T) => boolean = defaultCompare,
  ) {
    (this.host = host).addController(this);
    this.serviceContext = new ContextConsumer(this.host, {
      context: appContext,
      subscribe: true,
    });
    this.selector = selector;
    this.compare = compare;
  }

  hostConnected() {
    // has hostConnected already been called?
    if (this.selectorController) {
      this.hostDisconnected();
    }
    this.serviceContext.hostConnected();
    this.selectorController = new SelectorController(
      this.host,
      this.serviceContext.value!.service,
      this.selector,
      this.compare,
    );
  }

  hostDisconnected() {
    this.serviceContext?.hostDisconnected();
    this.selectorController?.hostDisconnected();
  }

  get value() {
    return this.selectorController?.value;
  }
}

export function connectState<
  T,
  TEmitted = Actor<AppMachine> extends Subscribable<infer Emitted>
    ? Emitted
    : never,
>(
  host: ReactiveElement,
  selector: (emitted: TEmitted) => T,
  compare: (a: T, b: T) => boolean = defaultCompare,
) {
  return new SelectState(host, selector, compare);
}

export const compareArrays = (a: unknown[], b: unknown[]) =>
  a.length === b.length && a.every((value, idx) => value === b[idx]);

export const compareObjects = (obj1: Object, obj2: Object) =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  (Object.keys(obj1) as (keyof typeof obj1)[]).every((key) => {
    return (
      Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key]
    );
  });
