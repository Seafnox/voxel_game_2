import { ComponentId } from '@block/shared/constants/ComponentId';
import { Direction } from '@block/shared/constants/Direction';
import { TransferPosition } from '@block/shared/constants/TransferPosition';
import { MeshComponent } from './MeshComponent';

export class PlayerSelectionComponent extends MeshComponent {
  static ID = ComponentId.PlayerSelection;

  target: TransferPosition = [0, 0, 0];
  targetSide = Direction.None;
  targetValid = false;
}
