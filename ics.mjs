import { CalendarEvent } from "./class/CalendarEvent.mjs";
import { airbnbIcs } from "./test/airbnbIcs.mjs";
import { bookingIcs } from "./test/bookingIcs.mjs";

// const AIRBNB_ICS = "https://www.airbnb.com/calendar/ical/1636328916998110687.ics?t=119c52a9bb8e4cf58ad20aeeca23f533";
// const AIRBNB_ICS = "https://www.airbnb.com/calendar/ical/1636328916998110687.ics";
// const AIRBNB_ICS = "https://www.airbnb.com/calendar/ical/XXXX.ics";
// const BOOKING_ICS = "https://admin.booking.com/hotel/hoteladmin/ical/XXXX.ics";

/** @returns {Array<string>} */
export async function fetchCalendarList(url_list) {
  return [airbnbIcs, bookingIcs];
  // /** @type {Array<string>} */ const cal_res_list = []
  // for (const url of url_list) cal_res_list.push(await fetchCalendar(url))
  // return cal_res_list;
}

/** @returns {string} */
export async function fetchCalendar(url) {
  return airbnbIcs;
  return await ((await fetch(url)).text());
}

/**
 * @param {Array<string>} calendar_string_list
 * @returns {Array<CalendarEvent>}
 */
export function parseStringListToCalendarEventList(calendar_string_list) {
  const calendar_event_list = [];
  
  for (const calendar_string of calendar_string_list) {
    calendar_event_list.push(
      ...parseCalendarStringToCalendarEventList(calendar_string)
    );
  }
  
  return calendar_event_list;
}



export function parseCalendarStringToCalendarEventList(calendar_string) {
  const calendar_event_list = [];
  let ics_event_to_add = null;
  for (let i = 0; i < calendar_string.length; i++) {
    if (stringMatchAtIndex(calendar_string, i, "END:VCALENDAR\n")) {
      return calendar_event_list;
    }

    if (stringMatchAtIndex(calendar_string, i, "END:VEVENT\n")) {
      ics_event_to_add.generateBackgroundColor();
      if (ics_event_to_add) calendar_event_list.push(ics_event_to_add);
      i += "END:VEVENT\n".length
    }

    if (stringMatchAtIndex(calendar_string, i, "BEGIN:VEVENT\n")) {
      ics_event_to_add = new CalendarEvent();
      i += "BEING:VEVENT\n".length;
    }

    readNextIcsProperty(ics_event_to_add, calendar_string, i, "UID:", "id");
    readNextIcsProperty(ics_event_to_add, calendar_string, i, "DTSTAMP:", "stamp");
    readNextIcsProperty(ics_event_to_add, calendar_string, i, "DTSTART;VALUE=DATE:", "start");
    readNextIcsProperty(ics_event_to_add, calendar_string, i, "DTEND;VALUE=DATE:", "end");
    readNextIcsProperty(ics_event_to_add, calendar_string, i, "SUMMARY:", "summary");
    readNextIcsProperty(ics_event_to_add, calendar_string, i, "DESCRIPTION:", "title");
    readNextIcsProperty(ics_event_to_add, calendar_string, i, "STATUS:", "status");
  }

  return calendar_event_list;
}

function readNextIcsProperty(
  calendar_event_to_add,
  calendar_string, 
  i, 
  ics_raw_property, 
  ics_property
) {
  if (!stringMatchAtIndex(calendar_string, i, ics_raw_property)) return;
  
  const value = getValueAfterDoublePoint(calendar_string, i, ics_raw_property);

  calendar_event_to_add[ics_property] = value;
  i += ics_raw_property.length + value.length;
}

/** @returns {boolean} */
function stringMatchAtIndex(list, i, s) {
  if (list.slice(i, i + s.length) === s) { return true; };
  return false;
}


/** Give the word to start after the comma, return all the text up until the end of line.
 * @returns {string} */
function getValueAfterDoublePoint(text, original_index, s) {
  let value = ""
  let i = original_index + s.length;
  
  while (text[i] !== `\n`) {
    value += text[i];
    i++;
    if (!text[i+1]) break; // AVOID INFINITE LOOP !
  }
  return value;
}