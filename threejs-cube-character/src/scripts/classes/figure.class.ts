import * as THREE from 'three'

import { random } from '../functions/random'
import { IFigure } from '../types/interfaces'
import { TFigureParams } from '../types/types'

export default class Figure implements IFigure {

    protected _scene: THREE.Scene
    protected _params: TFigureParams
    protected _group: THREE.Group

    protected _head: THREE.Mesh
    protected _body: THREE.Mesh
    protected _arms: THREE.Group[] = []

    protected _headHue: number
    protected _bodyHue: number

    protected _headMaterial: THREE.MeshLambertMaterial
    protected _bodyMaterial: THREE.MeshLambertMaterial

    constructor(params: TFigureParams) {

        this._params = params

        this._headHue = random(0, 360)
        this._bodyHue = random(0, 360)

        this._headMaterial = new THREE.MeshLambertMaterial({ color: `hsl(${this._headHue}, 30%, 50%)` })
        this._bodyMaterial = new THREE.MeshLambertMaterial({ color: `hsl(${this._bodyHue}, 85%, 50%)` })
    }

    /** */
    create(scene: THREE.Scene): void {

        this._scene = scene

        this._group = new THREE.Group()

        const { x, y, z, rx, ry } = this._params
        this._group.position.set(x, y, z)
        this._group.rotation.set(rx, ry, 0)

        this._scene.add(this._group)

        this._createBody()
        this._createHead()
        this._createArms()
        this._createEyes()
        this._createLegs(new THREE.MeshLambertMaterial({ color: 0xffffff }))
    }

    animate(): void {
        this._group.rotation.y = this._params.ry
        this._group.position.y = this._params.y
        this._arms.forEach((arm, index) => {
            const m = index % 2 === 0 ? 1 : -1
            arm.rotation.z = this._params.armRotation * m
        })
    }

    /** */
    public _createBody(): void {

        const geometry = new THREE.BoxGeometry(1, 1.5, 1)
        const body = new THREE.Mesh(geometry, this._bodyMaterial)

        this._group.add(body)
        this._body = body
    }

    public _createHead() {

        const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4)
        const head = new THREE.Mesh(geometry, this._headMaterial)
        head.position.y = 1.65

        this._group.add(head)
        this._head = head
    }

    _createArms() {

        const height = 0.85

        for (let i = 0; i < 2; i++) {

            const armGroup = new THREE.Group()
            const geometry = new THREE.BoxGeometry(0.25, height, 0.25)
            const arm = new THREE.Mesh(geometry, this._headMaterial)
            const m = i % 2 === 0 ? 1 : -1

            armGroup.add(arm)
            this._body.add(armGroup)

            arm.position.y = height * -0.5

            armGroup.position.x = m * 0.8
            armGroup.position.y = 0.6
            armGroup.rotation.z = Math.PI / 5 * 30

            this._arms.push(armGroup)
        }
    }

    _createEyes() {

        const eyes = new THREE.Group()
        const geometry = new THREE.SphereGeometry(0.15, 12, 8)
        const material = new THREE.MeshLambertMaterial({ color: 0x44445c })

        for (let i = 0; i < 2; i++) {

            const eye = new THREE.Mesh(geometry, material)
            const m = i % 2 === 0 ? 1 : -1
            eyes.add(eye)
            eye.position.x = 0.36 * m
        }

        eyes.position.z = 0.7

        this._head.add(eyes)
    }

    _createLegs(material: THREE.MeshLambertMaterial) {

        const legs = new THREE.Group()
        const geometry = new THREE.BoxGeometry(0.25, 0.4, 0.25)

        for (let i = 0; i < 2; i++) {
            const leg = new THREE.Mesh(geometry, material)
            const m = i % 2 === 0 ? 1 : -1

            legs.add(leg)
            leg.position.x = m * 0.22
        }

        this._group.add(legs)
        legs.position.y = -1.15

        this._body.add(legs)
    }

}
