import { ComponentId } from '../constants/ComponentId';
import { SerializableComponent, SerializableComponentData } from './SerializableComponent';

export class CurrentPlayerComponent extends SerializableComponent<SerializableComponentData> {
  static ID = ComponentId.CurrentPlayer;
}
