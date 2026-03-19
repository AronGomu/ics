/**
 * Represents a calendar event parsed from an ICS file.
 */
export class ICSEvent {

  /**
   * @param {Object} params
   * @param {string|null} params.uid
   * @param {string|null} params.start
   * @param {string|null} params.end
   * @param {string|null} params.summary
   */
  constructor({ uid = null, start = null, end = null, summary = null } = {}) {
    this.uid = uid
    this.start = start
    this.end = end
    this.summary = summary
  }
}

/**
 * Parse an ICS calendar string and return events.
 *
 * Extracts VEVENT blocks and returns simplified event objects.
 *
 * @param {string} icsText - Raw ICS file content as a string
 * @returns {Array<ICSEvent>}
 *
 * @example
 * const events = parseICS(icsString)
 * console.log(events)
 */
export function parseToIcsEvent(icsText) {
  const events = []
  const lines = icsText.split(/\r?\n/)

  let currentEvent = null

  for (const line of lines) {

    if (line.startsWith("BEGIN:VEVENT")) {
      currentEvent = new ICSEvent()
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

  return `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`
}

/**
 * Adds Airbnb-specific details to an array of ICSEvent objects.
 *
 * This function can be used to enrich parsed Airbnb ICS events
 * with additional metadata, formatting, or custom fields required
 * for your calendar or channel manager.
 *
 * @param {ICSEvent[]} airbnbICSEvents - An array of ICSEvent instances parsed from Airbnb ICS.
 *
 * @example
 * const airbnbEvents = parseICS(airbnbIcsText);
 * addAirbnbDetailsToIcs(airbnbEvents);
 */
export function addAirbnbDetailsToIcs(airbnbICSEvents) {
  for (const ics of airbnbICSEvents) {
    // Add Airbnb-specific properties here
    console.log(ics);
    ics.summary = "AIRBNB - Reserved"
    // ics.summary = "AIRBNB - Reservation"
  }
  return  airbnbICSEvents
}