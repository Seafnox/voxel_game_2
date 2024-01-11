import { ComponentId } from '../constants/ComponentId';
import { AbstractComponent, AbstractComponentData } from './AbstractComponent';

export interface OnGroundComponentData extends AbstractComponentData {
  canJump: boolean;
}

export class OnGroundComponent extends AbstractComponent<OnGroundComponentData> implements OnGroundComponentData {
  static ID = ComponentId.OnGround;

  canJump: boolean = true;
}
