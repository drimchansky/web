import { getFocusableChildren, trapTabKey } from './functions'

type TCallbackAsync<T = void> = (...args: Array<any>) => Promise<T>
type TEventType = 'show' | 'hide'
type TEvents = { [key in TEventType]: TCallbackAsync[] }

export default class Dialog {

    protected _element: HTMLElement
    protected _previouslyFocused: HTMLElement
    protected _isShown: boolean = false
    protected _events: TEvents = { show: [], hide: [] }

    public show: () => Promise<void>
    public hide: () => Promise<void>

    constructor(element: HTMLElement) {

        this._element = element

        this._element.setAttribute('hidden', 'true') // hidden by default
        this._element.setAttribute('role', 'dialog') //  mark it as a dialog for assistive technologies
        this._element.setAttribute('aria-modal', 'true') // make the rest of the page inert when open

        this.show = this._show.bind(this)
        this.hide = this._hide.bind(this)

        const closers = [...this._element.querySelectorAll('[data-dialog-hide]')]
        closers.forEach(closer => closer.addEventListener('click', this.hide))
    }

    public on(type: TEventType, fn: TCallbackAsync): void {
        this._events[type].push(fn)
    }

    public off(type: TEventType, fn: TCallbackAsync): void {
        const index = this._events[type].indexOf(fn)
        if (index > -1) this._events[type].splice(index, 1)
    }

    public destroy(): void {

        const closers = [...this._element.querySelectorAll('[data-dialog-hide]')]
        closers.forEach(closer => closer.removeEventListener('click', this.hide))

        this._events.show.forEach(event => this.off('show', event))
        this._events.hide.forEach(event => this.off('hide', event))
    }

    protected async _show(): Promise<void> {

        this._previouslyFocused = document.activeElement as HTMLElement

        this._isShown = true
        this._element.removeAttribute('hidden')

        document.addEventListener('keydown', this._handleKeyDown.bind(this))
        document.body.addEventListener('focus', this._maintainFocus.bind(this), true)

        this._moveFocusIn()

        await Promise.all(this._events.show.map(event => event()))
    }

    protected async _hide(): Promise<void> {

        this._isShown = false
        this._element.setAttribute('hidden', 'true')

        document.removeEventListener('keydown', this._handleKeyDown.bind(this))
        document.body.removeEventListener('focus', this._maintainFocus.bind(this), true)

        if (this._previouslyFocused && this._previouslyFocused.focus) {
            this._previouslyFocused.focus()
        }

        await Promise.all(this._events.hide.map(event => event()))
    }

    protected _handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') this.hide()
        else if (event.key === 'Tab') trapTabKey(this._element, event)
    }

    protected _maintainFocus(event: FocusEvent): void {
        const target = event.target as HTMLElement
        const isInDialog = target.closest('[aria-modal="true"]')
        if (!isInDialog) this._moveFocusIn()
    }

    protected _moveFocusIn(): void {
        const target = this._element.querySelector('[autofocus]') || getFocusableChildren(this._element)[0]
        target?.focus()
    }
}
