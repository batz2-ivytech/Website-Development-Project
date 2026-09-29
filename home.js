function getNextBirthday(birthdays) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  const withNextDate = birthdays.map(person => {
    let next = new Date(currentYear, person.month - 1, person.day);
    if (next < today) {
      next = new Date(currentYear + 1, person.month - 1, person.day);
    }
    return { ...person, nextDate: next };
  });

  const soonestDate = Math.min(...withNextDate.map(p => p.nextDate.getTime()));
  const soonestPeople = withNextDate.filter(p => p.nextDate.getTime() === soonestDate);

  const daysUntil = Math.round((soonestDate - today.getTime()) / (1000 * 60 * 60 * 24));

  return { names: soonestPeople.map(p => p.name), daysUntil };
}

fetch('data/birthdays.json')
  .then(response => response.json())
  .then(data => {
    const { names, daysUntil } = getNextBirthday(data.birthdays);
    const el = document.getElementById('birthday-countdown');

    const namesText = names.length > 1
      ? names.slice(0, -1).join(', ') + ' & ' + names[names.length - 1]
      : names[0];

    if (daysUntil === 0) {
      el.textContent = `🎉 It's ${namesText}'s birthday today!`;
    } else {
      el.textContent = `${namesText}'s birthday in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`;
    }
  });

fetch('data/schedule.json')
  .then(response => response.json())
  .then(data => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    const todaysEvents = data.events.filter(event => event.date === todayString);

    const list = document.getElementById('today-events');
    list.innerHTML = '';

    if (todaysEvents.length === 0) {
      const empty = document.createElement('li');
      empty.textContent = "Nothing on the calendar today.";
      empty.className = 'no-events';
      list.appendChild(empty);
      return;
    }

    // "All Day" events float to the top, everything else stays in JSON order
    todaysEvents.sort((a, b) => {
      if (a.time === 'All Day') return -1;
      if (b.time === 'All Day') return 1;
      return 0;
    });

    todaysEvents.forEach(event => {
      const item = document.createElement('li');
      item.textContent = `${event.title} — ${event.time} (${event.person.join(', ')})`;
      list.appendChild(item);
    });
  })
  .catch(error => console.error('Could not load today\'s events:', error));

fetch('data/jokes.json')
  .then(response => response.json())
  .then(data => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const joke = data.jokes[dayOfYear % data.jokes.length];
    document.getElementById('joke-of-the-day').textContent = joke;
  });