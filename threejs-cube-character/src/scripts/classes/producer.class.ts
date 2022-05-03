import * as THREE from 'three'

import { IFigure } from '../types/interfaces'
import { TSizes } from '../types/types'

export default class Producer {

    #canvas: Element

    protected _figures: IFigure[] = []
    protected _renderer: THREE.WebGLRenderer
    protected _camera: THREE.PerspectiveCamera
    protected _sizes: TSizes
    protected _scene: THREE.Scene

    constructor(canvas: Element, sizes: TSizes) {
        this.#canvas = canvas
        this._sizes = sizes
    }

    public create(): void {

        this._initScene()
        this._createRenderer()
        this._createLight()
        this._initEvents()

        this._render()

    }

    public addFigure(figure: IFigure): void {

        figure.create(this._scene)
        this._figures.push(figure)

        this._render()
    }

    public animateFigures(): void {

        if (this._figures && this._figures.length) {
            this._figures.map(e => e.animate())
            this._render()
        }

    }

    protected _initScene(): this {

        this._scene = new THREE.Scene()

        this._camera = new THREE.PerspectiveCamera(75, this._sizes.width / this._sizes.height, 0.1, 1000)
        this._camera.position.z = 7
        this._camera.position.x = 1

        this._scene.add(this._camera)

        return this
    }

    protected _createRenderer(): this {

        this._renderer = new THREE.WebGLRenderer({ canvas: this.#canvas })

        this._renderer.setSize(window.innerWidth, window.innerHeight)
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this._renderer.render(this._scene, this._camera)

        return this
    }

    protected _createLight(): this {

        const lightDirectional = new THREE.DirectionalLight(0xffffff, 1)
        this._scene.add(lightDirectional)

        lightDirectional.position.set(5, 5, 5)

        const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.2)
        this._scene.add(lightAmbient)

        return this
    }

    protected _initEvents(): this {

        this._sizes.width = window.innerWidth
        this._sizes.height = window.innerHeight

        this._camera.aspect = this._sizes.width / this._sizes.height
        this._camera.updateProjectionMatrix()

        return this
    }

    protected _render() {
        this._renderer.setSize(this._sizes.width, this._sizes.height)
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this._renderer.render(this._scene, this._camera)
    }

}
