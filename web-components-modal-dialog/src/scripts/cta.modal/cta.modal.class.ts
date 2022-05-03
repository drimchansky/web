import constants from './cta.modal.constants'
import markup from './cta.modal.markup'
import style from './cta.modal.style'

const template = document.createElement('template')
template.innerHTML = [style, markup].join('').trim().replace(constants.SPACE_REGEX, constants.SPACE)

export default class CtaModal extends HTMLElement {

    protected readonly _buttonClose: HTMLElement
    protected readonly _heading: HTMLElement | null
    protected readonly _modal: HTMLElement
    protected readonly _modalOverlay: HTMLElement
    protected readonly _modalScroll: HTMLElement
    protected readonly _shadow: ShadowRoot
    protected readonly _slotForButton: HTMLElement | null
    protected readonly _slotForModal: HTMLElement | null

    protected _activeElement: HTMLElement | null = null;
    protected _focusTrapList: NodeListOf<HTMLElement>
    protected _isActive = false;
    protected _isAnimated = true;
    protected _isHideShow = false;
    protected _isStatic = false;
    protected _timerForHide: number | undefined
    protected _timerForShow: number | undefined

    constructor() {

        super()

        this._bind()

        this._shadow = this.attachShadow({ mode: 'closed' })

        this._shadow.appendChild(template.content.cloneNode(true))

        this._slotForButton = this.querySelector("[slot='button']")
        this._slotForModal = this.querySelector("[slot='modal']")

        this._heading = this.querySelector('h1, h2, h3, h4, h5, h6')

        this._buttonClose = this._shadow.querySelector('.cta-modal__close') as HTMLElement
        this._focusTrapList = this._shadow.querySelectorAll('.cta-modal__focus-trap')
        this._modal = this._shadow.querySelector('.cta-modal__dialog') as HTMLElement
        this._modalOverlay = this._shadow.querySelector('.cta-modal__overlay') as HTMLElement
        this._modalScroll = this._shadow.querySelector('.cta-modal__scroll') as HTMLElement

        if (!this._slotForModal) {
            window.console.error('Required [slot="modal"] not found inside cta-modal.')
        }

        this._setAnimationFlag()

        this._setCloseTitle()

        this._setModalLabel()

        this._setStaticFlag()

        this._setActiveFlag()
    }

    static get observedAttributes() {
        return [constants.ACTIVE, constants.ANIMATED, constants.CLOSE, constants.STATIC]
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {

        if (oldValue !== newValue) {

            if (name === constants.ACTIVE) {
                this._setActiveFlag()
            }

            if (name === constants.ANIMATED) {
                this._setAnimationFlag()
            }

            if (name === constants.CLOSE) {
                this._setCloseTitle()
            }

            if (name === constants.STATIC) {
                this._setStaticFlag()
            }
        }
    }

    connectedCallback() {
        this._addEvents()
    }

    disconnectedCallback() {
        this._removeEvents()
    }

    _bind() {

        const propertyNames = Object.getOwnPropertyNames(
            Object.getPrototypeOf(this)
        ) as (keyof CtaModal)[]

        propertyNames.forEach((name) => {
            if (typeof this[name] === 'function') {
                // @ts-expect-error bind
                this[name] = this[name].bind(this)
            }
        })
    }

    _addEvents() {

        this._removeEvents()

        document.addEventListener(constants.FOCUSIN, this._handleFocusIn)
        document.addEventListener(constants.KEYDOWN, this._handleKeyDown)

        this._buttonClose.addEventListener(constants.CLICK, this._handleClickToggle)
        this._modalOverlay.addEventListener(constants.CLICK, this._handleClickOverlay)

        if (this._slotForButton) {
            this._slotForButton.addEventListener(constants.CLICK, this._handleClickToggle)
            this._slotForButton.addEventListener(constants.KEYDOWN, this._handleClickToggle)
        }

        if (this._slotForModal) {
            this._slotForModal.addEventListener(constants.CLICK, this._handleClickToggle)
            this._slotForModal.addEventListener(constants.KEYDOWN, this._handleClickToggle)
        }
    }

    _removeEvents() {
        document.removeEventListener(constants.FOCUSIN, this._handleFocusIn)
        document.removeEventListener(constants.KEYDOWN, this._handleKeyDown)

        this._buttonClose.removeEventListener(constants.CLICK, this._handleClickToggle)
        this._modalOverlay.removeEventListener(constants.CLICK, this._handleClickOverlay)

        if (this._slotForButton) {
            this._slotForButton.removeEventListener(constants.CLICK, this._handleClickToggle)
            this._slotForButton.removeEventListener(constants.KEYDOWN, this._handleClickToggle)
        }

        if (this._slotForModal) {
            this._slotForModal.removeEventListener(constants.CLICK, this._handleClickToggle)
            this._slotForModal.removeEventListener(constants.KEYDOWN, this._handleClickToggle)
        }
    }

    _setAnimationFlag() {
        this._isAnimated = this.getAttribute(constants.ANIMATED) !== constants.FALSE
    }

    _setCloseTitle() {

        const title = this.getAttribute(constants.CLOSE) || constants.CLOSE_TITLE

        this._buttonClose.title = title
        this._buttonClose.setAttribute(constants.ARIA_LABEL, title)
    }

    _setModalLabel() {

        let label = constants.MODAL_LABEL_FALLBACK

        if (this._heading) {
            label = this._heading.textContent || label
            label = label.trim().replace(constants.SPACE_REGEX, constants.SPACE)
        }

        this._modal.setAttribute(constants.ARIA_LABEL, label)
    }

    _setActiveFlag() {

        const isActive = this.getAttribute(constants.ACTIVE) === constants.TRUE

        this._isActive = isActive

        this._toggleModalDisplay(() => {
            if (this._isActive) {
                this._focusModal()
            }
        })
    }

    _setStaticFlag() {
        this._isStatic = this.getAttribute(constants.STATIC) === constants.TRUE
    }

    _focusElement(element: HTMLElement) {
        window.requestAnimationFrame(() => {
            if (typeof element.focus === 'function') {
                element.focus()
            }
        })
    }

    _focusModal() {
        window.requestAnimationFrame(() => {
            this._modal.focus()
            this._modalScroll.scrollTo(0, 0)
        })
    }

    _isOutsideModal(element?: HTMLElement) {

        if (!this._isActive || !element) {
            return false
        }

        const hasElement = this.contains(element) || this._modal.contains(element)

        return !hasElement
    }

    _isMotionOkay() {

        const { matches } = window.matchMedia(constants.PREFERS_REDUCED_MOTION)

        return this._isAnimated && !matches
    }

    _toggleModalDisplay(callback: () => void) {
        // @ts-expect-error boolean
        this.setAttribute(constants.ACTIVE, this._isActive)

        const isModalVisible = this._modalScroll.style.display === constants.BLOCK
        const isMotionOkay = this._isMotionOkay()

        const delay = isMotionOkay ? constants.ANIMATION_DURATION : 0
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
        const activeElement = document.activeElement as HTMLElement

        if (this._isActive && activeElement) {
            this._activeElement = activeElement
        }

        if (this._isActive) {

            this._modalScroll.style.display = constants.BLOCK


            document.documentElement.style.overflow = constants.HIDDEN

            if (scrollbarWidth) {
                document.documentElement.style.paddingRight = `${scrollbarWidth}px`
            }

            if (isMotionOkay) {
                this._isHideShow = true
                this._modalScroll.setAttribute(constants.DATA_SHOW, constants.TRUE)
            }

            callback()

            this._timerForShow = window.setTimeout(() => {

                clearTimeout(this._timerForShow)

                this._isHideShow = false
                this._modalScroll.removeAttribute(constants.DATA_SHOW)

            }, delay)

        } else if (isModalVisible) {

            if (isMotionOkay) {
                this._isHideShow = true
                this._modalScroll.setAttribute(constants.DATA_HIDE, constants.TRUE)
            }

            callback()

            this._timerForHide = window.setTimeout(() => {

                clearTimeout(this._timerForHide)

                this._isHideShow = false
                this._modalScroll.removeAttribute(constants.DATA_HIDE)

                this._modalScroll.style.display = 'none'

                document.documentElement.style.overflow = ''
                document.documentElement.style.paddingRight = ''

            }, delay)
        }
    }

    _handleClickOverlay(event: MouseEvent) {

        if (this._isHideShow || this._isStatic) {
            return
        }

        const target = event.target as HTMLElement

        if (target.classList.contains('cta-modal__overlay')) {
            this._handleClickToggle()
        }
    }

    _handleClickToggle(event?: MouseEvent | KeyboardEvent) {

        let key = ''
        let target = null

        if (event) {
            if (event.target) {
                target = event.target as HTMLElement
            }

            if ((event as KeyboardEvent).key) {
                key = (event as KeyboardEvent).key
                key = key.toLowerCase()
            }
        }

        let button

        if (target) {

            if (target.classList.contains('cta-modal__close')) {
                button = target as HTMLButtonElement

            } else if (typeof target.closest === 'function') {
                button = target.closest('.cta-modal-toggle') as HTMLButtonElement
            }
        }

        const isValidEvent = event && typeof event.preventDefault === 'function'
        const isValidClick = button && isValidEvent && !key
        const isValidKey = button && isValidEvent && [constants.ENTER, constants.SPACE].includes(key)

        const isButtonDisabled = button && button.disabled
        const isButtonMissing = isValidEvent && !button
        const isWrongKeyEvent = key && !isValidKey

        if (isButtonDisabled || isButtonMissing || isWrongKeyEvent) {
            return
        }

        if (isValidKey || isValidClick) {
            event.preventDefault()
        }

        this._isActive = !this._isActive

        this._toggleModalDisplay(() => {

            if (this._isActive) {
                this._focusModal()
            } else if (this._activeElement) {
                this._focusElement(this._activeElement)
            }
        })
    }

    _handleFocusIn() {

        if (!this._isActive) return

        const activeElement = (
            this._shadow.activeElement ||
            document.activeElement
        ) as HTMLElement

        const isFocusTrap1 = activeElement === this._focusTrapList[0]
        const isFocusTrap2 = activeElement === this._focusTrapList[1]

        let focusListReal: HTMLElement[] = []

        if (this._slotForModal) {
            focusListReal = Array.from(
                this._slotForModal.querySelectorAll(constants.FOCUSABLE_SELECTORS)
            ) as HTMLElement[]
        }

        const focusListShadow = Array.from(
            this._modal.querySelectorAll(constants.FOCUSABLE_SELECTORS)
        ) as HTMLElement[]

        const focusListTotal = focusListShadow.concat(focusListReal)

        const focusItemFirst = focusListTotal[0]
        const focusItemLast = focusListTotal[focusListTotal.length - 1]

        if (isFocusTrap1 && focusItemLast) {
            this._focusElement(focusItemLast)

        } else if (isFocusTrap2 && focusItemFirst) {
            this._focusElement(focusItemFirst)

        } else if (this._isOutsideModal(activeElement)) {
            this._focusModal()
        }
    }

    _handleKeyDown({ key }: KeyboardEvent) {

        if (!this._isActive) return

        key = key.toLowerCase()

        if (key === constants.ESCAPE && !this._isHideShow && !this._isStatic) {
            this._handleClickToggle()
        }

        if (key === constants.TAB) {
            this._handleFocusIn()
        }
    }
}
