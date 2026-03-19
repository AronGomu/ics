import fetch from "node-fetch";
import ical from "node-ical";
import icalGenerator from "ical-generator";
import express from "express";

// const AIRBNB_ICS = "https://www.airbnb.com/calendar/ical/1636328916998110687.ics?t=119c52a9bb8e4cf58ad20aeeca23f533";
const AIRBNB_ICS =
  "https://www.airbnb.com/calendar/ical/1636328916998110687.ics";
// const AIRBNB_ICS = "https://www.airbnb.com/calendar/ical/XXXX.ics";
// const BOOKING_ICS = "https://admin.booking.com/hotel/hoteladmin/ical/XXXX.ics";

async function fetchCalendar(url) {
  const response = await fetch(url);
  const text = await response.text();
  return ical.parseICS(text);
}

async function mergeCalendars() {
  const airbnbEvents = await fetchCalendar(AIRBNB_ICS);
  //   const bookingEvents = await fetchCalendar(BOOKING_ICS);

  console.log("airbnbEvents", airbnbEvents);

  const merged = [];

  for (const event of Object.values(airbnbEvents)) {
    if (event.type === "VEVENT") {
      merged.push(event);
    }
  }

//   for (const event of Object.values(bookingEvents)) {
//     if (event.type === "VEVENT") {
//       merged.push(event);
//     }
//   }

  return merged;
}

async function generateICS() {
  const events = await mergeCalendars();
  console.log("events", events);
  

  const calendar = icalGenerator({
    name: "Unified Booking Calendar",
  });

  events.forEach((event) => {
    calendar.createEvent({
      start: event.start,
      end: event.end,
      summary: event.summary || "Reserved",
    });
  });

  return calendar.toString();
}

async function main() {
  console.log(await generateICS());
}

main();

// const app = express();

// app.get("/calendar.ics", async (req, res) => {
//   const ics = await generateICS();
//   res.setHeader("Content-Type", "text/calendar");
//   res.send(ics);
// });

// app.listen(3000, () => {
//   console.log("Calendar available at http://localhost:3000/calendar.ics");
// });
