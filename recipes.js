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
  })
  .catch(error => console.error('Could not load recipes:', error));