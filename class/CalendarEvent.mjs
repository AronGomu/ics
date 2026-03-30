import { ICSEvent } from "./ICSEvent.mjs";

/**
 * @typedef {'#ff0000' | '#00ff00' | '#0000ff'} ColorCode
 */
export const EventColors = {
  RED: "#ff0000",
  CONFIRMED: "#ff0000",
  // CONFIRMED: "#ff0000",
  GREEN: "#00ff00",
  BLUE: "#0000ff",
  // AIRBNB:  "",
  // BOOKING: "",
};

/** Represents an event that can be added to a FullCalendar instance.  */
export class CalendarEvent {

  /**
   * @param {Object} params
   * @param {string} params.title - The title of the event.
   * @param {string|Date} params.start - Event start date/time.
   * @param {string|Date} [params.end] - Event end date/time.
   * @param {boolean} [params.allDay=false] - Whether the event is all-day.
   * @param {string} [params.id] - Optional unique identifier for the event.
   * @param {EventColors} [params.backgroundColor] - Optional color for the event.
   */
  constructor({ title, start, end = null, allDay = false, id = null, backgroundColor = null }) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.allDay = allDay;
    this.id = id;
    this.backgroundColor = backgroundColor;
  }

  /**
   * Converts the event to a plain object suitable for FullCalendar.
   * @returns {Object}
   */
  toFullCalendarEvent() {
    const eventObj = {
      title: this.title,
      start: this.start,
      allDay: this.allDay
    };
    if (this.end) eventObj.end = this.end;
    if (this.id) eventObj.id = this.id;
    if (this.backgroundColor) eventObj.backgroundColor = this.backgroundColor;
    return eventObj;
  }
}

/**
 * Converts a single ICSEvent into a CalendarEvent.
 *
 * @param {ICSEvent} icsEvent - The ICS event to convert.
 * @returns {CalendarEvent} A FullCalendar-compatible CalendarEvent.
 *
 * @example
 * const calEvent = icsToCalendarEvent(myICSEvent);
 */
export function icsToCalendarEvent(icsEvent) {
  console.log(icsEvent);
  
  if (!icsEvent || !(icsEvent instanceof ICSEvent)) {
    throw new Error("Parameter must be an ICSEvent instance : ");
  }

  let background_color = EventColors.GREEN;
  if (icsEvent.uid.search("airbnb")) background_color = EventColors.BLUE;
  if (icsEvent.uid.search("booking")) background_color = EventColors.RED;

  return new CalendarEvent({
    title: icsEvent.description,
    start: icsEvent.start,
    end: icsEvent.end,
    allDay: true,
    id: icsEvent.uid,
    backgroundColor: background_color
  });
}

/**
 * Converts an array of ICSEvent objects into CalendarEvent objects.
 *
 * @param {ICSEvent[]} icsEvents - Array of ICS events to convert.
 * @returns {CalendarEvent[]} Array of CalendarEvent instances.
 *
 * @example
 * const calEvents = icsListToCalendarEvents(myICSEventArray);
 */
export function icsListToCalendarEvents(icsEvents) {
  console.log(icsEvents);
  
  if (!Array.isArray(icsEvents)) {
    throw new Error("Parameter must be an array of ICSEvent objects");
  }

  return icsEvents.map(icsToCalendarEvent);
}