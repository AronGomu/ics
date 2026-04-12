import {
  CalendarEvent,
  generateIcsFileFromCalendarEventList
} from "./class/CalendarEvent.mjs";
import {
  fetchCalendarList,
  parseCalendarStringToCalendarEventList,
  parseStringListToCalendarEventList,
} from "./ics.mjs";

// NOTE: START INIT //

// HTML ELEMENTS + FUNCTIONS ASSOCIATED //

const ics_url_inputs_container = document.getElementById("ics-url-inputs-container");
const add_calendar_button = document.getElementById("add-calendar-button");
console.log(add_calendar_button)
add_calendar_button.removeChild
add_calendar_button.onclick = () => {
  add_calendar_urlInput();
}

// const airbnb_input = document.getElementById("airbnb-input");
// airbnb_input.value = "https://www.airbnb.com/calendar/ical/1636328916998110687.ics"
// const booking_input = document.getElementById("booking-input")

const fetch_calendars_button = document.getElementById("fetch-calendars-button")
fetch_calendars_button.onclick = async () => {
  const input_list = ics_url_inputs_container.querySelectorAll("input")
  const calendar_urls_to_fetch = Array.from(input_list).map(input => input.value);
  const calendar_list = await fetchCalendarList(calendar_urls_to_fetch);
  const calendar_event_list = parseStringListToCalendarEventList(calendar_list);
  saveCalendar(calendar_event_list);
  loadCalendar(calendar_event_list);
}

const download_calendar_button = document.getElementById("download-calendar-button");
download_calendar_button.onclick = () => {
  const ics_file = localStorage.getItem("ics_file");

  const blob = new Blob([ics_file], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "my-calendar.ics";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


document.addEventListener("DOMContentLoaded", () => {
  const ics_file = localStorage.getItem("ics_file");
  console.log(ics_file);
  if (!ics_file) loadCalendar([]);
  else loadCalendar(parseCalendarStringToCalendarEventList(ics_file));


  loadCalendarsUrls();
});


// NOTE: END INIT //


// TEST: TEST SECTION TO COMMENT OUT
// add_calendar_button.click();
// document.getElementById("deletable-input-0").querySelector('input').value = "TEST URL ???"
// add_calendar_button.click();
// document.getElementById("deletable-input-1").querySelector('input').value = "TEST 2";
// add_calendar_button.click();
// document.getElementById("deletable-input-2").querySelector('input').value = "TEST 3";
// fetch_calendars_button.click();


// NOTE: FUNCTIONS

function add_calendar_urlInput(value = "") {
  const all_inputs = ics_url_inputs_container.querySelectorAll("div");
  const nb_id = String(all_inputs.length);

  const deletable_input_div = document.createElement("div");
  deletable_input_div.id = "deletable-input-" + nb_id;
  const input = document.createElement("input");
  input.placeholder = "Enter the URL of the calendar";
  input.value = value;
  input.oninput = () => {
    saveCalendarsUrls(ics_url_inputs_container);
  }

  const delete_button = document.createElement("button");
  delete_button.textContent = "Delete";
  delete_button.onclick = (ev) => {
    ev.originalTarget.parentNode.remove();
    saveCalendarsUrls(ics_url_inputs_container);
  }

  deletable_input_div.appendChild(input);
  deletable_input_div.appendChild(delete_button);
  ics_url_inputs_container.appendChild(deletable_input_div);

  saveCalendarsUrls(ics_url_inputs_container);
}

function saveCalendarsUrls(ics_url_inputs_container) {
  const input_list = ics_url_inputs_container.querySelectorAll("input")
  const calendar_urls_to_fetch = Array.from(input_list).map(input => input.value);
  localStorage.setItem("calendars_url", JSON.stringify(calendar_urls_to_fetch));
}

function loadCalendarsUrls() {
  const calendar_urls_to_fetch = JSON.parse(localStorage.getItem("calendars_url"));
  if (calendar_urls_to_fetch) calendar_urls_to_fetch.map(url => add_calendar_urlInput(url));
}

function saveCalendar(calendar_event_list) {
  const ics_file = generateIcsFileFromCalendarEventList(calendar_event_list);
  localStorage.setItem("ics_file", ics_file);
}

function loadCalendar(calendar_event_list) {
  console.log(calendar_event_list);

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
    // navLinks: true, // can click day/week names to navigate views
    selectable: true,
    selectMirror: true,
    select: (arg) => select(calendar, calendar_event_list, arg),
    // eventClick: function (arg) {
    //   if (confirm("Are you sure you want to delete this event?")) {
    //     arg.event.remove();
    //   }
    // },
    editable: true,
    dayMaxEvents: true, // allow "more" link when too many events
    events: calendar_event_list,
  });

  calendar.render();
};


function select(calendar, calendar_event_list, arg) {
  var title = prompt("Event Title:");

  const calendar_event = new CalendarEvent(
    title,
    getDateAsYYYYMMDD(arg.start),
    getDateAsYYYYMMDD(arg.end),
    null,
    new Date().getUTCDate(),
    "RESERVED",
    arg.allDay,
  )

  calendar_event_list.push(calendar_event)
  saveCalendar(calendar_event_list)
  calendar.addEvent(calendar_event);
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

function getDateAsYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
