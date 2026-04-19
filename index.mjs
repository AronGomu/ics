import {
  CalendarEvent,
  generateIcsFileFromCalendarEventList,
  parseIcsStringToCalendarEventList
} from "./class/CalendarEvent.mjs";
import {
  fetchCalendarList,
  parseCalendarStringToCalendarEventList,
  parseStringListToCalendarEventList,
} from "./ics.mjs";


// HTML ELEMENTS + FUNCTIONS ASSOCIATED //

const ics_url_inputs_container = document.getElementById("ics-url-inputs-container");
const add_calendar_button = document.getElementById("add-calendar-button");
console.log(add_calendar_button)
add_calendar_button.removeChild
add_calendar_button.onclick = () => {
  add_calendar_url_input();
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



// NOTE: INIT FUNCION //
document.addEventListener("DOMContentLoaded", () => {
  const ics_from_local_storage = localStorage.getItem("ics_file");

  if (!ics_from_local_storage) loadCalendar([]);
  else loadCalendar(parseCalendarStringToCalendarEventList(ics_from_local_storage));

  const calendar_url_list = getCalendarsUrlsToFetch();
  fetchRemoteCalendars(calendar_url_list);
  set_all_calendar_url_input(calendar_url_list)
});


// NOTE: FUNCTIONS SECTION

/** @param {Array<string>} calendar_url_list 
 * @returns {void}  */
function set_all_calendar_url_input(calendar_url_list) {
  for (const calendar_url of calendar_url_list) {
    add_calendar_url_input(calendar_url);
  }
}

function add_calendar_url_input(value = "") {
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



/** @returns {Array<string>} */
function getCalendarsUrlsToFetch() {
  return JSON.parse(localStorage.getItem("calendars_url"));
}

/** @param {Array<string>} calendar_urls 
 * @returns {Array<CalendarEvent>}  */
async function fetchRemoteCalendars(calendar_urls) {
  const ics_string_list = await fetchRemoteCalendarAsIcsStringList(calendar_urls);
  const remote_calendar_event_list_list = ics_string_list.map(
    ics_string => parseIcsStringToCalendarEventList(ics_string)
  );
  let remote_calendar_event_list = []
  if (remote_calendar_event_list_list && remote_calendar_event_list_list.length > 0) {
    remote_calendar_event_list = remote_calendar_event_list_list.flatMap(e => e);
  }
  const local_calendar_event_list = getLocalCalendarEventList();
  const synchronized_calendar_event_list = remote_calendar_event_list.concat(local_calendar_event_list);
  if (isNonEmptyArray(synchronized_calendar_event_list)) loadCalendar(synchronized_calendar_event_list);
}

/** @param {Array<string>} calendar_urls 
 * @returns {Array<string>}  */
async function fetchRemoteCalendarAsIcsStringList(calendar_urls) {
  // NOTE: REPLACE THE FETCH BY THE ACTUAL URLS
  console.error("REPLACE THE FETCH BY THE ACTUAL URLS");  // TO REMOVE WHEN API WORK !
  return [] // TO REMOVE WHEN API WORK !
  try {
    const response = await fetch(
      URL_API_FETCH_REMOTE_CALENDAR,
      {
        method: "POST",
        body: JSON.stringify(calendar_urls)
      }
    );

    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error(error.message);
    return "";
  }
}

/** Get from local storage the events defined by the user
 * @returns {Array<CalendarEvent>} */
function getLocalCalendarEventList() {
  const local_calendar_event_list = JSON.parse(localStorage.getItem("local_calendar_event"));
  if (isNonEmptyArray(local_calendar_event_list)) return local_calendar_event_list;
  return [];
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

function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}
