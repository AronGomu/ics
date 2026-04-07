import { generateIcsFileFromCalendarEventList } from "./class/CalendarEvent.mjs";
import { 
  fetchCalendarList,
  parseCalendarStringToCalendarEventList,
  parseStringListToCalendarEventList,
} from "./ics.mjs";

const ics_url_inputs_container = document.getElementById("ics-url-inputs-container")


const airbnb_input = document.getElementById("airbnb-input")
const booking_input = document.getElementById("booking-input")
const fetch_calendars_button = document.getElementById("fetch-calendars-button")
fetch_calendars_button.onclick = async () => {
  console.log("fetch calendar");
  
  const calendar_urls_to_fetch = [ 
    airbnb_input.value,
    booking_input.value
  ];
  const calendar_list = await fetchCalendarList(calendar_urls_to_fetch);
  const calendar_event_list = parseStringListToCalendarEventList(calendar_list);
  const ics_file = generateIcsFileFromCalendarEventList(calendar_event_list);
  localStorage.setItem("ics_file", ics_file);
  
  loadCalendar(calendar_event_list);
}


document.addEventListener("DOMContentLoaded", () => {
  const ics_file = localStorage.getItem("ics_file");
  const calendar_event_list = parseCalendarStringToCalendarEventList(ics_file);
  loadCalendar(calendar_event_list);
});
// END INIT //

function loadCalendar(calendar_event_list) {
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
    //   left: "prev,next today",
      left: "prev,next",
      center: "title",
    //   right: "dayGridMonth,timeGridWeek,timeGridDay",
      right: "dayGridMonth",
    },
    initialDate: getTodayDateAsYYYYMMDD(),
    navLinks: true, // can click day/week names to navigate views
    selectable: true,
    selectMirror: true,
    select: (arg) => select(calendar, arg),
    eventClick: function (arg) {
      if (confirm("Are you sure you want to delete this event?")) {
        arg.event.remove();
      }
    },
    editable: false,
    dayMaxEvents: true, // allow "more" link when too many events
    events: calendar_event_list,
  });

  calendar.render();
};


function select(calendar, arg) {
      console.log('select arg : ', arg);
  
      var title = prompt("Event Title:");
      if (title) {
        calendar.addEvent({
          title: title,
          start: arg.start,
          end: arg.end,
          allDay: arg.allDay,
        });
      }
      calendar.unselect();
}



// FUNCTIONS // 
/**
 * Returns today's date formatted as YYYY-MM-DD.
 * 
 * Uses the browser's local time and pads month/day with leading zeros
 * to ensure proper ISO-like formatting.
 *
 * @returns {string} Today's date formatted as "YYYY-MM-DD"
 *
 * @example
 * const today = getTodayDate();
 * console.log(today); // "2026-03-08"
 */
export function getTodayDateAsYYYYMMDD() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}