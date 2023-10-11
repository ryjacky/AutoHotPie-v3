import {MouseKeyEvent} from "../db/data/PieMenu";

export class MouseKeyEventHelper {
  static emptyMouseKeyEvent(): MouseKeyEvent{
    return ["KeyDown", "", 0, 0, false, false, false];
  }

  static createMouseKeyEvent(eventName: string, input: string, x: number, y: number, shift: boolean, control: boolean, alt: boolean): MouseKeyEvent {
    return [eventName, input, x, y, shift, control, alt];
  }
}
