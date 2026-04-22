const input = document.getElementById('restaurantInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('restaurantList');
const spinBtn = document.getElementById('spinBtn');
const resetBtn = document.getElementById('resetBtn');
const winnerDisplay = document.getElementById('winnerDisplay');
const winnerName = document.getElementById('winnerName');

const STORAGE_KEY = 'dinnerRoulette';
let restaurants = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let isSpinning = false;
let errorTimer = null;

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
}

function showError(message) {
    let err = document.getElementById('formError');
    if (!err) {
        err = document.createElement('p');
        err.id = 'formError';
        err.className = 'form-error';
        document.querySelector('.input-group').insertAdjacentElement('afterend', err);
    }
    err.textContent = message;
    clearTimeout(errorTimer);
    errorTimer = setTimeout(() => { err.textContent = ''; }, 3000);
}

function addRestaurant() {
    const raw = input.value.trim();
    if (!raw) return;

    const name = raw.length > 60 ? raw.slice(0, 60).trimEnd() + '…' : raw;

    if (restaurants.some(r => r.toLowerCase() === name.toLowerCase())) {
        showError(`"${name}" is already on the list.`);
        return;
    }

    restaurants.push(name);
    save();
    renderList();
    input.value = '';
    input.focus();
}

function removeRestaurant(index) {
    restaurants.splice(index, 1);
    save();
    renderList();
}

function renderList() {
    list.innerHTML = '';
    if (restaurants.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'empty-msg';
        empty.textContent = 'No restaurants added yet...';
        list.appendChild(empty);
        return;
    }
    restaurants.forEach((name, i) => {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.className = 'restaurant-name';
        span.textContent = name;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = '×';
        removeBtn.setAttribute('aria-label', `Remove ${name}`);
        removeBtn.addEventListener('click', () => removeRestaurant(i));

        li.appendChild(span);
        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}

function spin() {
    if (isSpinning) return;

    if (restaurants.length === 0) {
        showError('Add at least one restaurant before spinning!');
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;

    const winner = restaurants[Math.floor(Math.random() * restaurants.length)];
    winnerName.textContent = winner;

    winnerDisplay.classList.add('hidden');
    winnerDisplay.offsetHeight; // force reflow to restart animation
    winnerDisplay.classList.remove('hidden');

    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
    }, 400);
}

function reset() {
    restaurants = [];
    save();
    renderList();
    winnerDisplay.classList.add('hidden');
    winnerName.textContent = '';
}

renderList();

addBtn.addEventListener('click', addRestaurant);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addRestaurant();
});
spinBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', reset);
