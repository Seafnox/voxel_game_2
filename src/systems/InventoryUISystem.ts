import { BlockComponent } from '@block/shared/components/blockComponent';
import { InventoryComponent } from '@block/shared/components/inventoryComponent';
import { BlockId } from '@block/shared/constants/BlockId';
import { ComponentId } from '@block/shared/constants/ComponentId';
import { EntityManager } from '@block/shared/EntityManager';
import { System } from '@block/shared/System';
import { Color } from 'three';
import { HTMLParser } from '../HTMLParser';
import '../../assets/stylesheets/inventory.scss';

const elementColors: Record<BlockId, Color | undefined> = {
  [BlockId.Air]: undefined,
  [BlockId.Dirt]: new Color(0xa4764a),
  [BlockId.Grass]: new Color(0x5cac2d),
  [BlockId.Sand]: new Color(0xf5cc4d),
  [BlockId.Stone]: new Color(0x918a8a),
  [BlockId.Wood]: new Color(0x46301A),
  [BlockId.Clay]: new Color(0xD5A372),
  [BlockId.Glass]: new Color(0xbee0ff),
  [BlockId.Logs]: new Color(0xA47449),
  [BlockId.Water]: new Color(0x79d2ffd0),
};

const html = `
    <div id="inventory">
        <ol class="inventory-row">
            <li class="active"><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
            <li><span></span></li>
        </ol>
    </div>
`;

export class InventoryUISystem extends System {
  private domNode: HTMLElement;
  private inventoryElements: NodeListOf<Element>;

  constructor(em: EntityManager, guiNode: HTMLElement) {
    super(em);

    // Parse and show in GUI.
    let parser = new HTMLParser();
    this.domNode = parser.parse(html);
    guiNode.appendChild(this.domNode);

    // Set up selectors.
    this.inventoryElements = this.domNode.querySelectorAll('.inventory-row:first-child li');
  }

  update(dt: number) {
    this.entityManager.getEntities(ComponentId.Inventory).forEach((component, entity) => {
      let inventory = this.entityManager.getComponent<InventoryComponent>(entity, ComponentId.Inventory);
      if (inventory.isDirty('activeSlot')) {
        let currentSlot = this.domNode.querySelector('#inventory .active');
        let newSlot = this.inventoryElements[inventory.activeSlot];

        if (!currentSlot) throw new Error('Current slot not found');

        currentSlot.className = '';
        newSlot.className = 'active';
      }

      inventory.slots.forEach((entity, index) => {
        let domBlock = ((this.inventoryElements[index] as HTMLElement).children[0] as HTMLElement);
        if (!domBlock) return; // If inventory slot is not filled, skip.

        domBlock.style.display = entity ? 'block' : 'none';
        if (entity) {
          let block = this.entityManager.getComponent<BlockComponent>(entity.toString(), ComponentId.Block);
          if (!block) {
            // Block was removed from game / inventory this tick, so update view right away.
            inventory.slots[index] = BlockId.Air;
            domBlock.style.display = 'none';
            return;
          }

          // Workaround for Firefox. It attempts to refetch 404s every tick even though value didn't change.
          let newBg = `#${elementColors[block.kind]?.getHexString()}`;
          if (domBlock.style.background !== newBg) domBlock.style.background = newBg;

          domBlock.innerText = '' + block.count;
        }
      });
    });
  }
}
