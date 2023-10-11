import {MouseKeyEvent} from "../db/data/PieMenu";

export class MouseKeyEventObject {
  static eventTypes = ['MouseDoubleClick', 'MouseDragStarted', 'MouseDragFinished', 'KeyDown', 'KeyUp'];
  static createString(): string {
    return this.stringify(this.create());
  }

  static create(
    eventName: string = "KeyDown",
    input: string = "",
    x: number = 0,
    y: number = 0,
    shift: boolean = false,
    control: boolean = false,
    alt: boolean = false): MouseKeyEvent {
    return [eventName, input, x, y, shift, control, alt];
  }

  static fromString(json: string): MouseKeyEvent {
    try {
      return JSON.parse(json) as MouseKeyEvent;
    } catch (e) {
      console.error("Error while parsing mouse key event: " + e);
      return this.create();
    }
  }

  static stringify(mouseKeyEvent: MouseKeyEvent): string {
    mouseKeyEvent[1] = mouseKeyEvent[1].toUpperCase();
    return JSON.stringify(mouseKeyEvent).trim();
  }

  static fromKeyboardEvent(event: KeyboardEvent): MouseKeyEvent {
    let type = "";
    switch (event.type) {
      case "keydown":
        type = "KeyDown";
        break;
      case "keyup":
        type = "KeyUp";
        break;
      default:
        type = "KeyDown";
    }
    return [type, event.key, 0, 0, event.shiftKey, event.ctrlKey, event.altKey];
  }
}
