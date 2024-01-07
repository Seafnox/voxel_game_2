import { ActionId } from '../constants/ActionId';
import { EntityManager } from '../EntityManager';
import { AbstractAction } from './AbstractAction';

export class ActionManager {
  queue: AbstractAction[] = [];

  executeAll(entityManager: EntityManager) {
    this.queue.forEach(action => {
      action.execute(entityManager);
    });
    // For debugging:
    //if (this.queue.length) console.log(`Processed ${this.queue.length} actions.`);

    this.queue = [];
  }

  queueRawAction(id: ActionId, actionData: Record<string, any>) {}

  queueAction(action: AbstractAction) {
    this.queue.push(action);
  }
}
