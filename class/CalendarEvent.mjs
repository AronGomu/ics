export const EventColors = {
  RED: "#ff0000",
  CONFIRMED: "#ff0000",
  // CONFIRMED: "#ff0000",
  GREEN: "#00ff00",
  BLUE: "#0000ff",
  WHITE: "#000000",
  // AIRBNB:  "",
  // BOOKING: "",
};

/** Represents an event that can be added to a FullCalendar instance.  */
export class CalendarEvent {
  constructor(
    description = null,
    start = null,
    end = null,
    id = null,
    stamp = null,
    summary = null,
    status = null,
    backgroundColor = null,
    allDay = true,
  ) {
    this.title = summary;
    this.start = start;
    this.end = end;
    this.id = id;
    this.stamp = stamp;
    this.summary = summary;
    this.status = status;
    this.backgroundColor = backgroundColor;
    this.allDay = allDay;
    this.description = description;
  }

  generateBackgroundColor() {
    // INFO: Each calendar you fetch may be slightly different so you probably need to make a custom function to check if it match the original website
    if (this.id.includes("airbnb")) return this.backgroundColor = EventColors.RED;
    else if (this.id.includes("booking")) return this.backgroundColor = EventColors.BLUE;
    return this.backgroundColor = EventColors.WHITE;
  }
}

/**
 * Parse an ICS file and return CalendarEvents.
 * @param {string} icsText - Raw ICS file content as a string
 * @returns {Array<CalendarEvent>}
 */
export function parseStringToCalendarEvent(icsText) {
  const events = []
  const lines = icsText.split(/\r?\n/)

  let currentEvent = null

  for (const line of lines) {

    if (line.startsWith("BEGIN:VEVENT")) {
      currentEvent = new CalendarEvent()
    }

    else if (line.startsWith("END:VEVENT")) {
      if (currentEvent) events.push(currentEvent)
      currentEvent = null
    }

    else if (currentEvent) {
      if (line.startsWith("UID:")) {
        currentEvent.uid = line.substring(4)
      }

      else if (line.startsWith("DTSTART")) {
        const value = line.split(":")[1]
        currentEvent.start = formatICSDate(value)
      }

      else if (line.startsWith("DTEND")) {
        const value = line.split(":")[1]
        currentEvent.end = formatICSDate(value)
      }

      else if (line.startsWith("SUMMARY:")) {
        currentEvent.summary = line.substring(8)
      }

    }
  }

  return events
}

/**
 * Convert ICS date format (YYYYMMDD) to YYYY-MM-DD
 *
 * @param {string} dateStr
 * @returns {string|null}
 */
function formatICSDate(dateStr) {
  if (!dateStr) return null
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
}


export function generateIcsFileFromCalendarEventList(ics_event_list) {
  let ics_file = "BEGIN:VCALENDAR\n"
    + "VERSION:2.0\n"
    + "PRODID:null\n"
    + "CALSCALE:GREGORIAN\n"
    + "METHOD:PUBLISH\n"
    + "X-WR-CALNAME:insert_calendar_name\n"
    + "X-WR-TIMEZONE:UTC\n"
    + "\n"

  for (const ics_event of ics_event_list) {
    ics_file += generateIcsFileFromCalendarEvent(ics_event);
  }

  return ics_file += "END:VCALENDAR";
}

function generateIcsFileFromCalendarEvent(calendar_event) {
  return "BEGIN:VEVENT\n"
    + "UID:" + calendar_event.id + "\n"
    + "DTSTAMP:" + calendar_event.stamp + "\n"
    + "DTSTART;VALUE=DATE:" + calendar_event.start + "\n"
    + "DTEND;VALUE=DATE:" + calendar_event.end + "\n"
    + "SUMMARY:" + calendar_event.summary + "\n"
    + "DESCRIPTION:" + calendar_event.title + "\n"
    + "STATUS:" + calendar_event.status + "\n"
    + "END:VEVENT\n"
    + "\n"
}
