import * as THREE from 'three'

export function generateRosePoints(factor: number = 1.8) {
    const xLo = 0, xHi = 1, xCount = 20
    const thetaLo = -2 * Math.PI, thetaHi = 15 * Math.PI, thetaCount = 2000

    const vertex = []
    const radius = []

    for (let x = xLo; x <= xHi; x += (xHi - xLo) / xCount) {
        for (let theta = thetaLo; theta <= thetaHi; theta += (thetaHi - thetaLo) / thetaCount) {
            const phi = (Math.PI / 2) * Math.exp(-theta / (8 * Math.PI))
            const X_raw = 1 - (1 / 2) * (Math.pow((5 / 4) * Math.pow(1 - ((3.6 * theta) % (2 * Math.PI)) / Math.PI, 2) - 1 / 4, 2))
            const y = 1.95653 * Math.pow(x, 2) * Math.pow(1.27689 * x - 1, 2) * Math.sin(phi)
            let r = X_raw * (x * Math.sin(phi) + y * Math.cos(phi))

            if (r > 0) {
                const scaledR = r * factor
                const scaledX = X_raw * factor
                radius.push(scaledR)

                vertex.push(
                    scaledR * Math.sin(theta),
                    scaledX * (x * Math.cos(phi) - y * Math.sin(phi)),
                    scaledR * Math.cos(theta)
                )
            }
        }
    }

    const colorsArr = []
    const rLo = Math.min(...radius)
    const rHi = Math.max(...radius)

    for (let i = 0; i < radius.length; i++) {
        const ratio = (radius[i] - rLo) / (rHi - rLo)
        const color = new THREE.Color()
        color.setRGB(
            0.13 + (1.0 - 0.13) * ratio,
            0.01,
            0.13
        )
        colorsArr.push(color.r, color.g, color.b)
    }

    return {
        positions: new Float32Array(vertex),
        colors: new Float32Array(colorsArr)
    }
}
