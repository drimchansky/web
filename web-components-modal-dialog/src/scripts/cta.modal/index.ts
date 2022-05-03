import CtaModal from './cta.modal.class'

if ('customElements' in window) {

    window.addEventListener('DOMContentLoaded', () => {
        window.customElements.define('cta-modal', CtaModal)
    })
}
