export enum EntityManagerEvent {
  EntityCreated,
  EntityRemoved,
  ComponentAdded,
  ComponentReplaced,
  ComponentRemoved,
  NumEvents, // Used to initialize event handler array. Not a real event.
}

export const entityManagerEventMap = Array(5).fill(0).map((_, index) => EntityManagerEvent[index]);
