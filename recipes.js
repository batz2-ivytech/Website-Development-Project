fetch('data/recipes.json')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('recipe-list');
    data.recipes.forEach(recipe => {
      const card = document.createElement('li');
      card.className = 'recipe-card';
      card.style.setProperty('--rotate', `${Math.random() * 8 - 4}deg`);

      const name = document.createElement('p');
      name.textContent = recipe.name;
      card.appendChild(name);

      if (recipe.link) {
        const link = document.createElement('a');
        link.href = recipe.link;
        link.textContent = 'View recipe →';
        link.target = '_blank';
        card.appendChild(link);
      }

      list.appendChild(card);
    });

    
    for (let i = 0; i < 4; i++) {
      const spacer = document.createElement('li');
      spacer.className = 'recipe-card-empty';
      list.appendChild(spacer);
    }
  })
  .catch(error => console.error('Could not load recipes:', error));

const form = document.getElementById('add-recipe-form');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const nameInput = document.getElementById('recipe-name');
  const linkInput = document.getElementById('recipe-link');
  const message = document.getElementById('form-message');

  const name = nameInput.value.trim();
  const link = linkInput.value.trim();

  if (name === '') {
    message.textContent = 'Please enter a recipe name.';
    message.className = 'form-message form-message-error';
    return;
  }

  const list = document.getElementById('recipe-list');
  const card = document.createElement('li');
  card.className = 'recipe-card';
  card.style.setProperty('--rotate', `${Math.random() * 8 - 4}deg`);

  const nameEl = document.createElement('p');
  nameEl.textContent = name;
  card.appendChild(nameEl);

  if (link !== '') {
    const linkEl = document.createElement('a');
    linkEl.href = link;
    linkEl.textContent = 'View recipe →';
    linkEl.target = '_blank';
    card.appendChild(linkEl);
  }

  const emptySpacer = document.querySelector('.recipe-card-empty');
  list.insertBefore(card, emptySpacer);

  form.reset();
  message.textContent = `"${name}" was added to the board!`;
  message.className = 'form-message form-message-success';
});