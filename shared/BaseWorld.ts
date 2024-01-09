import { ActionManager } from './actions/ActionManager';
import { registerSharedComponents } from './components/RegisterSharedComponents';
import { SystemOrder } from './constants/SystemOrder';
import { EntityManager } from './EntityManager';
import { System } from './System';
import { PhysicsSystem } from './systems/PhysicsSystem';
import { TerrainCollisionSystem } from './systems/TerrainCollisionSystem';
import { PositionSystem } from './systems/PositionSystem';
import { CleanComponentsSystem } from './systems/CleanComponentsSystem';
import { UtilsManager } from './UtilsManager';

export abstract class BaseWorld {
  entityManager: EntityManager;
  abstract actionManager: ActionManager;

  systems: Array<System> = [];
  systemsOrder: Array<number> = [];
  systemTimings: Array<number> = [];
  tickNumber: number = 0;

  private readonly utilsManager: UtilsManager;

  constructor(utilsManager: UtilsManager) {
    let entityManager = new EntityManager(utilsManager);
    // FIXME make overrided method
    registerSharedComponents(entityManager);

    this.entityManager = entityManager;
    this.utilsManager = utilsManager;

    this.addSystem(new PhysicsSystem(entityManager), SystemOrder.Physics);
    this.addSystem(new TerrainCollisionSystem(entityManager), SystemOrder.TerrainCollision);
    this.addSystem(new PositionSystem(entityManager), SystemOrder.Position);

    // Cleaning is the last thing we do in each tick.
    this.addSystem(new CleanComponentsSystem(entityManager), SystemOrder.CleanComponents);
  }

  get utils(): UtilsManager {
    return this.utilsManager;
  }

  addSystem(system: System, order: number = 0.0) {
    let higher = this.systemsOrder.map((ord, idx) => {
      return [ord, idx];
    }).filter(zip => zip[0] > order);

    if (higher.length == 0) {
      this.systems.push(system);
      this.systemsOrder.push(order);
    } else {
      this.systems.splice(higher[0][1], 0, system);
      this.systemsOrder.splice(higher[0][1], 0, order);
    }

    this.systemTimings.push(0);
  }

  tick(dt: number) {
    const performanceNow = this.utils.performanceNow;
    let i = 0;
    let timePeriod = 0;
    let frameTimes = new Float32Array(this.systems.length);
    this.systems.forEach(system => {
      let start = performanceNow();
      system.update(dt);
      let time = performanceNow() - start;
      frameTimes[i] = time;
      this.systemTimings[i] += time;
      timePeriod += time;
      i++;
    });

    if (timePeriod > 10) {
      this.utilsManager.logger.log(`${new Date().toISOString()} TICK (${timePeriod.toFixed(4)}ms)`);
    }
    this.tickNumber++;
  }
}
