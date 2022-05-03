const FOCUSABLE_SELECTORS = [
    'a[href]:not([tabindex^="-"])',
    'area[href]:not([tabindex^="-"])',
    'input:not([type="hidden"]):not([type="radio"]):not([disabled]):not([tabindex^="-"])',
    'input[type="radio"]:not([disabled]):not([tabindex^="-"]):checked',
    'select:not([disabled]):not([tabindex^="-"])',
    'textarea:not([disabled]):not([tabindex^="-"])',
    'button:not([disabled]):not([tabindex^="-"])',
    'iframe:not([tabindex^="-"])',
    'audio[controls]:not([tabindex^="-"])',
    'video[controls]:not([tabindex^="-"])',
    '[contenteditable]:not([tabindex^="-"])',
    '[tabindex]:not([tabindex^="-"])',
]

function isVisible(element: HTMLElement): boolean {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
}

const getFocusableChildren = (root) => {
    const elements = [...root.querySelectorAll(FOCUSABLE_SELECTORS.join(','))]

    return elements.filter(isVisible)
}

const trapTabKey = (node: Node, event: KeyboardEvent) => {

    const focusableChildren = getFocusableChildren(node)
    const focusedItemIndex = focusableChildren.indexOf(document.activeElement)
    const lastIndex = focusableChildren.length - 1
    const withShift = event.shiftKey

    if (withShift && focusedItemIndex === 0) {

        focusableChildren[lastIndex].focus()
        event.preventDefault()

    } else if (!withShift && focusedItemIndex === lastIndex) {

        focusableChildren[0].focus()
        event.preventDefault()
    }
}


export { getFocusableChildren, trapTabKey }
