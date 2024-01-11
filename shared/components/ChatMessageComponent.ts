import { ComponentId } from '../constants/ComponentId';
import { SerializableComponent, SerializableComponentData } from './SerializableComponent';

export interface ChatMessageComponentData extends SerializableComponentData {
  from: string;
  text: string;
}

export class ChatMessageComponent extends SerializableComponent<ChatMessageComponentData> implements ChatMessageComponentData {
  static ID = ComponentId.ChatMessage;

  from = '';
  text = '';
}
