import { SerializableComponent, SerializableComponentData } from '@block/shared/components/serializableComponent';
import { ComponentId } from '@block/shared/constants/ComponentId';

export class PickableComponent extends SerializableComponent<SerializableComponentData> {
  static ID = ComponentId.Pickable;
}
