export const random = (min: number, max: number, float = false): number => {
    const value = Math.random() * (max - min) + min
    return float ? value : Math.floor(value)
}
