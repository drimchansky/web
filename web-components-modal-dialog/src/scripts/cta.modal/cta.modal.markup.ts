const FOCUS_TRAP = `
<span
  aria-hidden='true'
  class='cta-modal__focus-trap'
  tabindex='0'
></span>
`

const markup = `

<slot name='button'></slot>

<div class='cta-modal__scroll' style='display:none'>
  ${FOCUS_TRAP}

  <div class='cta-modal__overlay'>
    <div
      aria-modal='true'
      class='cta-modal__dialog'
      role='dialog'
      tabindex='-1'
    >
      <button
        class='cta-modal__close'
        type='button'
      >&times;</button>

      <slot name='modal'></slot>
    </div>
  </div>

  ${FOCUS_TRAP}
</div>
`

export default markup
