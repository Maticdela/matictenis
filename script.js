$(document).ready(function() {
    const today = moment();
    const twoMonthsLater = today.clone().add(2, 'months');

    // Get reserved slots from localStorage
    let reservedSlots = JSON.parse(localStorage.getItem('reservedSlots') || '[]');

    // Initialize the calendar
    $('#calendar').fullCalendar({
        defaultView: 'month',
        header: {
            left: 'prev,next today',  // "today" will automatically be translated to Slovenian
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        locale: 'sl',  // Enable Slovenian locale for calendar elements
        minDate: today.format('YYYY-MM-DD'),
        maxDate: twoMonthsLater.format('YYYY-MM-DD'),
        events: reservedSlots,  // Load events from localStorage
        selectable: true,
        selectHelper: true,
        select: function(start, end) {
            const name = prompt('Vnesite svoje ime in priimek:');
            const phone = prompt('Vnesite svoj telefon:');
            if (name && phone) {
                const eventData = {
                    title: name.split(' ')[1], // Use surname as title
                    start: start.toISOString(),
                    end: end.toISOString(),
                    phone: phone
                };

                // Render the event on the calendar
                $('#calendar').fullCalendar('renderEvent', eventData, true);

                // Save the event in localStorage
                reservedSlots.push(eventData);
                localStorage.setItem('reservedSlots', JSON.stringify(reservedSlots));
            }
            $('#calendar').fullCalendar('unselect');
        },
        editable: true,
        eventClick: function(event) {
            alert('Rezervacija: ' + event.title + '\nTelefon: ' + event.phone + '\nTermin: ' + event.start.format('YYYY-MM-DD HH:mm'));
        },
        eventRender: function(event, element) {
            // Check if the event is reserved (for styling purposes)
            if (reservedSlots.some(e => e.start === event.start.toISOString())) {
                // Change the color of reserved slots (e.g., red for reserved)
                element.css('background-color', '#FF4B4B'); // Red for reserved slots
            } else {
                // Default to green for available days
                element.css('background-color', '#4CAF50'); // Green for available days
            }
        }
    });
});

// Combine both `openModal` functions into one
function openModal(start, end) {
    const modal = document.getElementById('reservationModal');
    modal.style.display = 'flex';
  
    // Set the date field with the correct format
    const dateField = document.getElementById('date');
    dateField.value = start.format('YYYY-MM-DD');  // Format start as 'YYYY-MM-DD'
  
    // Populate the time dropdown
    const timeDropdown = document.getElementById('time');
    timeDropdown.innerHTML = ''; // Clear existing options
  
    const times = [];
    let time = moment("08:00", "HH:mm");
    const endTime = moment("21:00", "HH:mm");
  
    while (time <= endTime) {
        times.push(time.format("HH:mm"));
        time.add(30, 'minutes');
    }
  
    times.forEach(t => {
        const option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        timeDropdown.appendChild(option);
    });
  
    // Save selected times for the reservation
    window.currentEventStart = start;
    window.currentEventEnd = end;
}
