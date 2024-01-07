import { ComponentId } from '../constants/ComponentId';
import { SerializableComponent, SerializableComponentData } from 'shared/components/SerializableComponent';

export interface PlayerComponentData extends SerializableComponentData {
  name: string;
}

export class PlayerComponent extends SerializableComponent<PlayerComponentData> implements PlayerComponentData {
  static ID = ComponentId.Player;

  name: string = '';
}
