import { templates, select, settings, classNames } from "../settings.js";
import utils from "../utils.js";
import AmountWidget from "./AmountWidget.js";
import DatePicker from "./DatePicker.js";
import HourPicker from "./HourPicker.js";

class Booking {
  constructor(wrapper) {
    const thisBooking = this;

    thisBooking.selectedTable = null;

    thisBooking.render(wrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData() {
    const thisBooking = this;

    const startDateParam =
      settings.db.dateStartParamKey + "=" + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam =
      settings.db.dateEndParamKey + "=" + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      bookings: [startDateParam, endDateParam],
      eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDateParam],
      eventsRepeat: [settings.db.repeatParam, endDateParam],
    };

    const urls = {
      bookings:
        settings.db.url + "/" + settings.db.bookings + "?" + params.bookings.join("&"),
      eventsCurrent:
        settings.db.url + "/" + settings.db.events + "?" + params.eventsCurrent.join("&"),
      eventsRepeat:
      settings.db.url + "/" + settings.db.events + "?" + params.eventsRepeat.join("&"),
    };

    Promise.all([
      fetch(urls.bookings),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([bookings, eventsCurrent, eventsRepeat]) => {
      thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
    });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == "daily") {
        for (
          let loopDate = minDate;
          loopDate <= maxDate;
          loopDate = utils.addDays(loopDate, 1)
        ) {
          thisBooking.makeBooked(
            utils.dateToStr(loopDate),
            item.hour,
            item.duration,
            item.table
          );
        }
      }
    }
    //console.log("thisBooking.booked", thisBooking.booked);
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (!thisBooking.booked[date]) {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (
      let hourBlock = startHour;
      hourBlock < startHour + duration;
      hourBlock += 0.5
    ) {
      //console.log('loop', hourBlock);
      if (!thisBooking.booked[date][hourBlock]) {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (!thisBooking.booked[thisBooking.date] || !thisBooking.booked[thisBooking.date][thisBooking.hour]) {
      allAvailable = true;
    }

    thisBooking.selectedTable = null;
    const selectedTable = thisBooking.dom.tablesWrapper.querySelector('.selected');
    if (selectedTable) {
      selectedTable.classList.remove('selected');
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(
          tableId
        )
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  selectTable(clickedElement) {
    const thisBooking = this;

    if (clickedElement.classList.contains('table')) {
      if (clickedElement.classList.contains(classNames.booking.tableBooked)) {
        alert('This table is already booked!');
        return;
      }

      if (clickedElement.classList.contains('selected')) {
        clickedElement.classList.remove('selected');
        thisBooking.selectedTable = null;
      } else {
        const previousSelected = thisBooking.dom.tablesWrapper.querySelector('.selected');
        if (previousSelected) {
          previousSelected.classList.remove('selected');
        }

        clickedElement.classList.add('selected');
        thisBooking.selectedTable = parseInt(clickedElement.getAttribute('data-table'));
      }

      console.log('Selected table:', thisBooking.selectedTable);
    }
  }

  sendBooking() {
    const thisBooking = this;

    const payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.selectedTable ? parseInt(thisBooking.selectedTable) : null,
      duration: parseInt(thisBooking.hoursAmountWidget.value),
      ppl: parseInt(thisBooking.peopleAmountWidget.value),
      starters: [],
      phone: thisBooking.dom.wrapper.querySelector('[name="phone"]').value,
      address: thisBooking.dom.wrapper.querySelector('[name="address"]').value,
    };

    const startersInputs = thisBooking.dom.wrapper.querySelectorAll('input[name="starter"]:checked');
    startersInputs.forEach(input => payload.starters.push(input.value));

    console.log(' Wysyłanie rezerwacji:', payload);

    fetch(settings.db.url + '/' + settings.db.bookings, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(response => {
      console.log(' Rezerwacja zapisana:', response);

      thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
      thisBooking.updateDOM();

      thisBooking.dom.form.reset();
      thisBooking.selectedTable = null;



      const selectedTable = thisBooking.dom.tablesWrapper.querySelector('.selected');
      if (selectedTable) {
        selectedTable.classList.remove('selected');
      }
      console.log(' Formularz zresetowany!');
    })
    .catch(error => console.error(" Błąd podczas zapisywania rezerwacji:", error));
  }

  render(wrapper) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = wrapper;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    );
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);

    thisBooking.dom.tablesWrapper = thisBooking.dom.wrapper.querySelector('.floor-plan');

    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector('.booking-form');
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmountWidget = new AmountWidget(
      thisBooking.dom.peopleAmount
    );

    thisBooking.hoursAmountWidget = new AmountWidget(
      thisBooking.dom.hoursAmount
    );

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
    thisBooking.dom.tablesWrapper.addEventListener('click', (event) => {
      thisBooking.selectTable(event.target);
    });
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector('.booking-form');
    if (thisBooking.dom.form) {
      thisBooking.dom.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisBooking.sendBooking();
      });
    } else {
      console.error(" ERROR: Nie znaleziono formularza rezerwacji! Sprawdź selektor w settings.js.");
    }
  }
  }


export default Booking;
