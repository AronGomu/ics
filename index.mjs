import { getTodayDateAsYYYYMMDD, } from "./function/utils.mjs";

import { 
  fetchCalendarList,
  parseCalendarStringToCalendarEventList,
} from "./ics.mjs";

const ics_url_inputs_container = document.getElementById("ics-url-inputs-container")


const airbnb_input = document.getElementById("airbnb-input")
const booking_input = document.getElementById("booking-input")
const fetch_calendars_button = document.getElementById("fetch-calendars-button")
fetch_calendars_button.onclick = () => {
  const calendar_urls_to_fetch = [ 
    airbnb_input.value,
    booking_input.value
  ];
  const calendar_list = fetchCalendarList(calendar_urls_to_fetch);
  const ics_event_list = parseStringListToIcsEventList(calendar_list);
  const ics_event_list_detailled = addDetailsToIcsList(ics_event_list);

  for (const ics_event of ics_event_list) {
    
  }
}
const test_calendars = await fetchCalendarList(null);

console.log("test_calendars", test_calendars);


// const airbnbICSEvents = parseStringToIcsEvent(airbnbIcs)
// console.log('bnbICSEvents : ', airbnbICSEvents);
// const airbnbICSEventsWithDetails = addAirbnbDetailsToIcs(airbnbICSEvents)
// console.log('airbnbICSEventsWithDetails', airbnbICSEventsWithDetails);


// const airbnbCalendarEvents = new icsListToCalendarEvents(airbnbICSEventsWithDetails)
// console.log('bnbCalendarEvents : ',  airbnbCalendarEvents);



const initialDate = getTodayDateAsYYYYMMDD();
const ics_event_list = parseCalendarStringToCalendarEventList(test_calendars);
const calendar_event_list = parseCalendarStringToCalendarEventList(test_calendars);
console.log(ics_event_list);


document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");

  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
    //   left: "prev,next today",
      left: "prev,next",
      center: "title",
    //   right: "dayGridMonth,timeGridWeek,timeGridDay",
      right: "dayGridMonth",
    },
    initialDate: initialDate,
    navLinks: true, // can click day/week names to navigate views
    selectable: true,
    selectMirror: true,
    select: (arg) => select(calendar, arg),
    eventClick: function (arg) {
      if (confirm("Are you sure you want to delete this event?")) {
        arg.event.remove();
      }
    },
    editable: true,
    dayMaxEvents: true, // allow "more" link when too many events
    events: ics_event_list,
  });

  calendar.render();
});


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