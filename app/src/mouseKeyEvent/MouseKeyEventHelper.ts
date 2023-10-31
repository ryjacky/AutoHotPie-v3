import {IGlobalKeyDownMap, IGlobalKeyEvent} from "node-global-key-listener";

export class MouseKeyEventHelper {
  static KeyboardEventToString(event: KeyboardEvent): string {
    // format: ctrl:shift:alt:key

    return `${event.ctrlKey}:${event.shiftKey}:${event.altKey}:${event.key}`.toUpperCase();
  }

  static RawStringToDisplayString(rawString: string): string {
    const hotkey = rawString.split(':');

    return (hotkey[0] === 'true' ? 'Ctrl+' : '') +
      (hotkey[1] === 'true' ? 'Shift+' : '') +
      (hotkey[2] === 'true' ? 'Alt+' : '') +
      ((hotkey[3] ?? ''));
  }

  static GlobalKeyboardEventToString(event: IGlobalKeyEvent, down: IGlobalKeyDownMap): string {
    return `${down["RIGHT CTRL"] || down["RIGHT CTRL"]}:${down["RIGHT SHIFT"] || down["LEFT SHIFT"]}:${down["RIGHT ALT"] || down["LEFT ALT"]}:${event.name}`;
  }
}
