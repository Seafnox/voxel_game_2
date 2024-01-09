import { AbstractComponent, AbstractComponentData } from './AbstractComponent';

// Used when serializing component to avoid "dirty" flag being serialized. It is only needed locally at runtime.
const componentReplacer = (key: string, value: any) => {
    if (key === 'dirtyFields') return undefined;
    return value;
};

export interface SerializableComponentData extends AbstractComponentData {}

// TODO change constructor, add setter, getter, initial asset
export class SerializableComponent<T extends SerializableComponentData = SerializableComponentData> extends AbstractComponent<T> {
    serialize(): string {
        return JSON.stringify(this, componentReplacer);
    }

    getJSON(): T {
        return JSON.parse(this.serialize());
    }
}
