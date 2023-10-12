export class MouseKeyEventHelper {
  static KeyboardEventToString(event: KeyboardEvent): string {
    // format: eventName:input:x:y:shift:control:alt

    return `${event.type === "keyup" ? "keyup" : "keydown"}:${event.key}:${event.shiftKey}:${event.ctrlKey}:${event.altKey}`.toLowerCase();
  }
}
