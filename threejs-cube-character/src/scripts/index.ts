import gsap from 'gsap'

import Producer from './classes/producer.class'
import Figure from './classes/figure.class'
import { TSizes } from './types/types'

const sizes: TSizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const producer = new Producer(document.querySelector('#scene'), sizes)
producer.create()

const animateProps = { x: 0, y: 0, z: 1, rx: 0.5, ry: 0.8, armRotation: 1 }
const figure = new Figure(animateProps)

producer.addFigure(figure)

gsap.set(animateProps, {
    y: -1.5
})

gsap.to(animateProps, {
    ry: Math.PI * 2,
    repeat: -1,
    duration: 20
})

gsap.to(animateProps, {
    y: 0,
    armRotation: Math.PI,
    repeat: -1,
    yoyo: true,
    duration: 0.5
})

gsap.ticker.add(() => {
    producer.animateFigures()
})
