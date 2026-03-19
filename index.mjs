import { 
  CalendarEvent,
  icsListToCalendarEvents,
  icsToCalendarEvent
} from "./class/CalendarEvent.mjs";
import { 
  parseToIcsEvent,
  addAirbnbDetailsToIcs,
 } from "./class/ICSEvent.mjs";
import { getTodayDateAsYYYYMMDD, } from "./function/utils.mjs";
import { airbnbIcs } from './test/airbnbIcs.mjs'

const airbnbICSEvents = parseToIcsEvent(airbnbIcs)
console.log('bnbICSEvents : ', airbnbICSEvents);
const airbnbICSEventsWithDetails = addAirbnbDetailsToIcs(airbnbICSEvents)
console.log('airbnbICSEventsWithDetails', airbnbICSEventsWithDetails);


const airbnbCalendarEvents = new icsListToCalendarEvents(airbnbICSEventsWithDetails)
console.log('bnbCalendarEvents : ',  airbnbCalendarEvents);



const initialDate = getTodayDateAsYYYYMMDD();

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
    events: airbnbCalendarEvents,
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