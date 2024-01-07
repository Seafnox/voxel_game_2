import { TransferPosition } from 'shared/constants/TransferPosition';
import { ComponentId } from '../constants/ComponentId';
import { Direction } from '../constants/Direction';
import { SerializableComponent, SerializableComponentData } from 'shared/components/SerializableComponent';

export interface InputComponentData extends SerializableComponentData {
  moveForward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  moveBackward: boolean;
  jump: boolean;

  primaryAction: boolean;
  secondaryAction: boolean;
  target: TransferPosition;
  targetSide: Direction;

  scrollDirection: number;
}

export class InputComponent extends SerializableComponent<InputComponentData> implements InputComponentData {
  static ID = ComponentId.Input;

  moveForward = false;
  moveLeft = false;
  moveRight = false;
  moveBackward = false;
  jump = false;

  primaryAction = false; // Left mouse button
  secondaryAction = false; // Right mouse button
  target: TransferPosition = [0, 0, 0]; // Where in space the action is performed.
  targetSide: Direction = Direction.None;

  scrollDirection: number = 0;
}
