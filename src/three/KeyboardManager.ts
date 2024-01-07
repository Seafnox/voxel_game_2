export class KeyboardManager {
    private targetInFocus: boolean = false;
    private pressedKeys: Set<number> = new Set<number>();

    // TODO create HTMLTargetManager instead KeyboardManager.targetInFocus
    // TODO move mouseMove target checking into MouseManager
    constructor(target: HTMLElement) {
        // Because keydown/keyup can only be registered on "document" and inputs (?).
        // Keep track of whether or not the game canvas is in focus, and only allow
        // key presses to get stored if that is the case.
        document.addEventListener('mousemove', evt => {
            this.targetInFocus = evt.target === target
        }, false);

        // Key events.
        document.addEventListener('keydown', evt => {
            if(!this.targetInFocus) return;
            this.pressedKeys.add(evt.keyCode);
        }, false);

        document.addEventListener('keyup', evt => {
            if(!this.targetInFocus) return;
            this.pressedKeys.delete(evt.keyCode);
        }, false);
    }

    isPressed(keyCode: number) {
        return this.pressedKeys.has(keyCode);
    }
}
