import { CalendarEvent, icsToCalendarEvent } from "./class/CalendarEvent.mjs";
import { ICSEvent } from "./class/ICSEvent.mjs";
import { airbnbIcs } from "./test/airbnbIcs.mjs";
import { bookingIcs } from "./test/bookingIcs.mjs";

// const AIRBNB_ICS = "https://www.airbnb.com/calendar/ical/1636328916998110687.ics?t=119c52a9bb8e4cf58ad20aeeca23f533";
// const AIRBNB_ICS = "https://www.airbnb.com/calendar/ical/1636328916998110687.ics";
// const AIRBNB_ICS = "https://www.airbnb.com/calendar/ical/XXXX.ics";
// const BOOKING_ICS = "https://admin.booking.com/hotel/hoteladmin/ical/XXXX.ics";

/** @returns {Array<string>} */
export async function fetchCalendarList(url_list) {
  return [airbnbIcs, bookingIcs];
  /** @type {Array<string>} */ const cal_res_list = []
  for (const url of url_list) cal_res_list.push(await fetchCalendar(url))
  return cal_res_list;
}

/** @returns {string} */
export async function fetchCalendar(url) {
  return airbnbIcs;
  return await ((await fetch(url)).text());
}

/**
 * @param {Array<string>} calendar_string_list
 * @returns {Array<ICSEvent>} ics_event_list
 */
export function parseStringListToCalendarEventList(calendar_string_list) {
  const calendar_event_list = [];
  console.log(calendar_string_list);
  
  for (const calendar_string of calendar_string_list) {
    console.log(calendar_string);
    console.log(parseCalendarStringToCalendarEventList(calendar_string));
     
    
    calendar_event_list.push(...parseCalendarStringToCalendarEventList(calendar_string));
  }
  console.log(calendar_event_list);
  return calendar_event_list;
}



export function parseCalendarStringToCalendarEventList(calendar_string) {
  console.log("parseCalendarStringToCalendarEventList");
  
  const calendar_event_list = [];
  let ics_event_to_add = null;
  // for (const calendar_string of calendar_string_list) {
    for (let i = 0; i < calendar_string.length; i++) {
      if (stringMatchAtIndex(calendar_string, i, "END:VCALENDAR\n")) {
        console.log(calendar_event_list);
        return calendar_event_list;
      }
  
      if (stringMatchAtIndex(calendar_string, i, "END:VEVENT\n")) {
        console.log(icsToCalendarEvent(ics_event_to_add));
        if (ics_event_to_add) calendar_event_list.push(icsToCalendarEvent(ics_event_to_add));
        i += "END:VEVENT\n".length
      }
  
      if (stringMatchAtIndex(calendar_string, i, "BEGIN:VEVENT\n")) {
        ics_event_to_add = new ICSEvent();
        i += "BEING:VEVENT\n".length;
      }

      readNextIcsProperty(ics_event_to_add, calendar_string, i, "UID:", "uid");
      readNextIcsProperty(ics_event_to_add, calendar_string, i, "DTSTAMP:", "stamp");
      readNextIcsProperty(ics_event_to_add, calendar_string, i, "DTSTART;VALUE=DATE:", "start");
      readNextIcsProperty(ics_event_to_add, calendar_string, i, "DTEND;VALUE=DATE:", "end");
      readNextIcsProperty(ics_event_to_add, calendar_string, i, "SUMMARY:", "summary");
      readNextIcsProperty(ics_event_to_add, calendar_string, i, "DESCRIPTION:", "description");
      readNextIcsProperty(ics_event_to_add, calendar_string, i, "STATUS:", "status");
    }
  // }
  return calendar_event_list;
}

function readNextIcsProperty(ics_event_to_add, calendar_string, i, ics_raw_property, ics_property) {
  if (!stringMatchAtIndex(calendar_string, i, ics_raw_property)) return;
  
  const value = getValueAfterDoublePoint(calendar_string, i, ics_raw_property);
  ics_event_to_add[ics_property] = value;
  i += ics_raw_property.length + value.length;
}

/** @returns {boolean} */
function stringMatchAtIndex(list, i, s) {
  if (list.slice(i, i + s.length) === s) {
    return true;
  };
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



// /**
//  * @param {Array<string>} ics_urls_list 
//  * @returns {Array<string>} ics_event_list
//  */
// async function mergeCalendars(ics_urls_list) {
//   const ics_merged_event_list = []

//   for (const ics_url of ics_urls_list) {
//     const event_list = await fetchCalendar(ics_url)
//     if (event.type === "VEVENT") ics_merged_event_list.push()
//   }

//   return ics_merged_event_list
// }

// async function generateICS() {
//   const events = await mergeCalendars();
//   console.log("events", events);
  

//   const calendar = icalGenerator({
//     name: "Unified Booking Calendar",
//   });

//   events.forEach((event) => {
//     calendar.createEvent({
//       start: event.start,
//       end: event.end,
//       summary: event.summary || "Reserved",
//     });
//   });

//   return calendar.toString();
// }

// async function main() {
//   console.log(await generateICS());
// }

// main();

// const app = express();

// app.get("/calendar.ics", async (req, res) => {
//   const ics = await generateICS();
//   res.setHeader("Content-Type", "text/calendar");
//   res.send(ics);
// });

// app.listen(3000, () => {
//   console.log("Calendar available at http://localhost:3000/calendar.ics");
// });
