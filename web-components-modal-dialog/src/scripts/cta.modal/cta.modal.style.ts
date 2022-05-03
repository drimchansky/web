import constants from './cta.modal.constants'

const style = `
<style>
  *,
  *:after,
  *:before {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  @media ${constants.PREFERS_REDUCED_MOTION} {
    *,
    *:after,
    *:before {
      animation: none !important;
      transition: none !important;
    }
  }

  @keyframes SHOW-OVERLAY {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes SHOW-DIALOG {
    0% {
      transform: scale(0.95);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes HIDE-OVERLAY {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes HIDE-DIALOG {
    0% {
      transform: scale(1);
    }

    100% {
      transform: scale(0.95);
    }
  }

  .cta-modal__focus-trap {
    opacity: 0;
    overflow: hidden;

    width: 0;
    height: 0;

    position: fixed;
    top: 0;
    left: 0;
  }

  .cta-modal__scroll {
    overflow-x: hidden;
    overflow-y: auto;

    width: 100%;
    height: 100%;

    z-index: var(--cta-modal-overlay-z-index, 100000);
    position: fixed;
    top: 0;
    left: 0;
  }

  .cta-modal__overlay {
    background-color: var(--cta-modal-overlay-background-color, rgba(0, 0, 0, 0.5));
    display: flex;
    align-items: center;
    justify-content: center;

    padding-top: var(--cta-modal-overlay-padding-top, 20px);
    padding-left: var(--cta-modal-overlay-padding-left, 20px);
    padding-right: var(--cta-modal-overlay-padding-right, 20px);
    padding-bottom: var(--cta-modal-overlay-padding-bottom, 20px);

    width: 100%;
    min-height: 100%;
  }

  .cta-modal__dialog {
    background-color: var(--cta-modal-dialog-background-color, #fff);
    border-radius: var(--cta-modal-dialog-border-radius, 5px);
    box-shadow: var(--cta-modal-dialog-box-shadow, 0 2px 5px 0 rgba(0, 0, 0, 0.5));

    padding-top: var(--cta-modal-dialog-padding-top, 20px);
    padding-left: var(--cta-modal-dialog-padding-left, 20px);
    padding-right: var(--cta-modal-dialog-padding-right, 20px);
    padding-bottom: var(--cta-modal-dialog-padding-bottom, 20px);

    width: var(--cta-modal-dialog-width, 500px);
    max-width: 100%;

    position: relative;
  }

  [${constants.DATA_SHOW}='true'] .cta-modal__overlay {
    animation-duration: ${constants.ANIMATION_DURATION}ms;
    animation-name: SHOW-OVERLAY;
  }

  [${constants.DATA_SHOW}='true'] .cta-modal__dialog {
    animation-duration: ${constants.ANIMATION_DURATION}ms;
    animation-name: SHOW-DIALOG;
  }

  [${constants.DATA_HIDE}='true'] .cta-modal__overlay {
    animation-duration: ${constants.ANIMATION_DURATION}ms;
    animation-name: HIDE-OVERLAY;
    opacity: 0;
  }

  [${constants.DATA_HIDE}='true'] .cta-modal__dialog {
    animation-duration: ${constants.ANIMATION_DURATION}ms;
    animation-name: HIDE-DIALOG;
    transform: scale(0.95);
  }

  .cta-modal__close {
    appearance: none;
    touch-action: none;
    user-select: none;

    border: 0;
    padding: 0;

    color: var(--cta-modal-close-color, #fff);
    background-color: var(--cta-modal-close-background-color, #000);
    border-radius: var(--cta-modal-close-border-radius, 50%);
    box-shadow: var(--cta-modal-close-box-shadow, 0 0 0 1px #fff);
    display: var(--cta-modal-close-display, block);

    cursor: pointer;
    font-family: var(--cta-modal-close-font-family, 'Arial', sans-serif);
    font-size: var(--cta-modal-close-font-size, 23px);
    text-align: center;

    line-height: var(--cta-modal-close-line-height, 26px);
    width: var(--cta-modal-close-width, 26px);

    transform: translate(40%, -40%);
    position: absolute;
    top: 0;
    right: 0;
  }

  .cta-modal__close:hover {
    color: var(--cta-modal-close-color-hover, #000);
    background-color: var(--cta-modal-close-background-color-hover, #fff);
    box-shadow: var(--cta-modal-close-box-shadow-hover, 0 0 0 1px #000);
  }

  @supports selector(:focus-visible) {
    .cta-modal__close:focus-visible {
      color: var(--cta-modal-close-color-hover, #000);
      background-color: var(--cta-modal-close-background-color-hover, #fff);
      box-shadow: var(--cta-modal-close-box-shadow-hover, 0 0 0 1px #000);
    }
  }

  @supports not selector(:focus-visible) {
    .cta-modal__close:focus {
      color: var(--cta-modal-close-color-hover, #000);
      background-color: var(--cta-modal-close-background-color-hover, #fff);
      box-shadow: var(--cta-modal-close-box-shadow-hover, 0 0 0 1px #000);
    }
  }
</style>
`
export default style
