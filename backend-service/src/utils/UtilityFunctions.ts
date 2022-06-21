export function getKeyByValue(object: Map<string, any>, value: string): string[] {
    return Object.keys(object).filter(key => object.get(key) === value);
}
