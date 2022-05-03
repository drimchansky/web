const constants = {

    ANIMATION_DURATION: 250,

    CLOSE_TITLE: 'Close',

    ARIA_LABEL: 'aria-label',
    DATA_HIDE: 'data-cta-modal-hide',
    DATA_SHOW: 'data-cta-modal-show',

    ENTER: 'enter',
    ESCAPE: 'escape',
    FALSE: 'false',
    FOCUSIN: 'focusin',
    HIDDEN: 'hidden',
    KEYDOWN: 'keydown',
    MODAL_LABEL_FALLBACK: 'modal',
    PREFERS_REDUCED_MOTION: '(prefers-reduced-motion: reduce)',

    SPACE: ' ',
    SPACE_REGEX: /\s+/g,

    ACTIVE: 'active',
    ANIMATED: 'animated',
    BLOCK: 'block',
    CLICK: 'click',
    CLOSE: 'close',
    STATIC: 'static',
    TAB: 'tab',
    TEMPLATE: 'template',
    TRUE: 'true',

    FOCUSABLE_SELECTORS: [
        '[contenteditable]',
        '[tabindex="0"]:not([disabled])',
        'a[href]',
        'audio[controls]',
        'button:not([disabled])',
        'iframe',
        "input:not([disabled]):not([type='hidden'])",
        'select:not([disabled])',
        'summary',
        'textarea:not([disabled])',
        'video[controls]',
    ].join(',')
}

export default constants



