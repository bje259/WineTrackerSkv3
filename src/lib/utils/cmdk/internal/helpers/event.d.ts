/**
 * A type alias for a general event listener function.
 *
 * @template E - The type of event to listen for
 * @param evt - The event object
 * @returns The return value of the event listener function
 */
export type GeneralEventListener<E = Event> = (evt: E) => unknown;
/**
 *  Overloaded function signatures for addEventListener
 */
export declare function addEventListener<E extends keyof HTMLElementEventMap>(target: Window, event: E, handler: (this: Window, ev: HTMLElementEventMap[E]) => unknown, options?: boolean | AddEventListenerOptions): VoidFunction;
export declare function addEventListener<E extends keyof HTMLElementEventMap>(target: Document, event: E, handler: (this: Document, ev: HTMLElementEventMap[E]) => unknown, options?: boolean | AddEventListenerOptions): VoidFunction;
export declare function addEventListener<E extends keyof HTMLElementEventMap>(target: EventTarget, event: E, handler: GeneralEventListener<HTMLElementEventMap[E]>, options?: boolean | AddEventListenerOptions): VoidFunction;
