const people = {
  "Mom": "#EF9F27",
  "Dad": "#639922",
  "Kylie": "#ED93B1",
  "Khloe": "#D85A30",
  "Ryder": "#378ADD",
  "Katelynn": "#9B6BC2"
};

function buildEventDots(dayEvents) {
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'event-dots';

  // flatten all people across all of today's events into one list
  const allPeople = dayEvents.flatMap(event => event.person);
  const uniquePeople = [...new Set(allPeople)];

  const maxDots = 4;
  uniquePeople.slice(0, maxDots).forEach(name => {
    const dot = document.createElement('span');
    dot.className = 'event-dot';
    dot.style.backgroundColor = people[name] || '#999';
    dotsContainer.appendChild(dot);
  });

  if (uniquePeople.length > maxDots) {
    const more = document.createElement('span');
    more.className = 'event-dot-more';
    more.textContent = `+${uniquePeople.length - maxDots}`;
    dotsContainer.appendChild(more);
  }

  return dotsContainer;
}

const monthLabel = document.getElementById('calendar-title');
const calendarBody = document.getElementById('calendar-body');
const dayDetail = document.getElementById('day-detail');

const year = 2026;
const month = 9; // October (0-indexed: Jan = 0, so Oct = 9)

fetch('data/schedule.json')
  .then(response => response.json())
  .then(data => {
    buildCalendar(data.events);
  })
  .catch(error => console.error('Could not load schedule:', error));

function buildCalendar(events) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  let date = 1;
  calendarBody.innerHTML = '';

  for (let row = 0; row < 6; row++) {
    const tr = document.createElement('tr');

    for (let col = 0; col < 7; col++) {
      const td = document.createElement('td');

      if (row === 0 && col < firstDay) {
        // empty cell before the 1st
      } else if (date > daysInMonth) {
        // empty cell after the last day
      } else {
        const cellDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        const dayEvents = events.filter(event => event.date === cellDate);

        const dayNumber = document.createElement('span');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date;
        td.appendChild(dayNumber);

        if (cellDate === todayString) {
          td.classList.add('today');
        }

        if (dayEvents.length > 0) {
          td.appendChild(buildEventDots(dayEvents));
          td.classList.add('has-events');
          td.addEventListener('click', () => showDayDetail(cellDate, dayEvents));
        }

        date++;
      }

      tr.appendChild(td);
    }

    calendarBody.appendChild(tr);
    if (date > daysInMonth) break;
  }
}

function showDayDetail(dateString, dayEvents) {
  dayDetail.innerHTML = '';

  const heading = document.createElement('p');
  heading.className = 'day-detail-heading';
  heading.textContent = new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
  dayDetail.appendChild(heading);

  const list = document.createElement('ul');
  dayEvents.forEach(event => {
    const item = document.createElement('li');
    item.textContent = `${event.title} — ${event.time} (${event.person.join(', ')})`;
    list.appendChild(item);
  });
  dayDetail.appendChild(list);
}