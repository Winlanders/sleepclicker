const state = {
  de: 0,
  rp: 0,
  lucidity: 0,
  taps: 0,
  bedLevel: 0,
  pillowLevel: 0,
  beddingLevel: 0,
  environmentLevel: 0,
  petLevel: 0,
};

const beds = [
  "Straw Mat", "Futon", "Standard Mattress", "Memory Foam", "Cooling Gel Bed", "Luxury King Bed", "Cloud Bed", "Astral Pod"
];
const pillows = [
  "Cotton", "Feather", "Memory Foam", "Gel Pillow", "Lavender Pillow", "Hypnotic Pillow", "Celestial Pillow"
];
const beddings = [
  "Standard Sheets", "Silk Sheets", "Bamboo Sheets", "Cooling Sheets", "Heavenly Sheets"
];
const environments = [
  "Nightstand", "Cozy Lamp", "White Noise Machine", "Aromatherapy Diffuser", "Ambient Projector", "Dream Generator"
];
const pets = [
  "Sleep Sheep", "Slumber Snail", "Dozy Dolphin", "Nap Cat", "Snooze Bunny", "Twilight Turtle", "Starry Fox", "Luna Dragon"
];

const achievements = [
  { id: 'first-wink', name: 'First Wink', condition: s => s.taps >= 100 },
  { id: 'deep-sleep', name: 'Deep Sleep Expert', condition: s => s.taps >= 10000 }
];

const clickSound = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=');

function updateDisplay() {
  document.getElementById('de').textContent = state.de.toFixed(0);
  document.getElementById('rp').textContent = state.rp.toFixed(0);
  document.getElementById('lucidity').textContent = state.lucidity;

  document.getElementById('bed-name').textContent = beds[state.bedLevel] || 'Max';
  document.getElementById('pillow-name').textContent = pillows[state.pillowLevel] || 'Max';
  document.getElementById('bedding-name').textContent = beddings[state.beddingLevel] || 'Max';
  document.getElementById('environment-name').textContent = environments[state.environmentLevel] || 'Max';
  document.getElementById('pet-name').textContent = pets[state.petLevel] || 'Max';

  const arrays = { bed: beds, pillow: pillows, bedding: beddings, environment: environments, pet: pets };
  ['bed', 'pillow', 'bedding', 'environment', 'pet'].forEach((type, idx) => {
    const level = state[type + 'Level'];
    const cost = getCost(level + idx);
    const btn = document.getElementById('buy-' + type);
    btn.classList.toggle('affordable', state.de >= cost);
    const bar = document.getElementById(type + '-progress');
    const max = arrays[type].length - 1;
    const width = Math.min(100, (level / max) * 100);
    bar.style.width = width + '%';
  });

  document.getElementById('bed-cost').textContent = getCost(state.bedLevel);
  document.getElementById('pillow-cost').textContent = getCost(state.pillowLevel + 1);
  document.getElementById('bedding-cost').textContent = getCost(state.beddingLevel + 2);
  document.getElementById('environment-cost').textContent = getCost(state.environmentLevel + 3);
  document.getElementById('pet-cost').textContent = getCost(state.petLevel + 4);

  document.getElementById('prestige-info').textContent = `Prestige now for ${calcPrestige()} Lucidity`;
}

function getCost(level) {
  return Math.floor(10 * Math.pow(1.5, level));
}

function tap() {
  const power = 1 + state.bedLevel + state.beddingLevel + state.petLevel;
  state.de += power;
  state.taps++;
  checkAchievements();
  clickSound.currentTime = 0;
  clickSound.play();
  updateDisplay();
}

function idleGain() {
  const gain = 1 + state.pillowLevel + state.environmentLevel + state.petLevel;
  state.de += gain;
  state.rp += gain;
  updateDisplay();
}

function buyUpgrade(type) {
  let level = state[`${type}Level`];
  const order = ['bed', 'pillow', 'bedding', 'environment', 'pet'];
  const cost = getCost(level + order.indexOf(type));
  if (state.de >= cost && level < eval(type + 's').length) {
    state.de -= cost;
    state[`${type}Level`]++;
  }
  updateDisplay();
}

function checkAchievements() {
  achievements.forEach(a => {
    if (!a.unlocked && a.condition(state)) {
      a.unlocked = true;
      const li = document.createElement('li');
      li.textContent = a.name;
      document.getElementById('achievement-list').appendChild(li);
    }
  });
}

function calcPrestige() {
  return Math.floor(Math.sqrt(state.de / 1000));
}

function prestige() {
  const gain = calcPrestige();
  if (gain > 0 && confirm(`Prestige for ${gain} Lucidity? This will reset progress.`)) {
    state.lucidity += gain;
    state.de = 0;
    state.rp = 0;
    state.bedLevel = 0;
    state.pillowLevel = 0;
    state.beddingLevel = 0;
    state.environmentLevel = 0;
    state.petLevel = 0;
  }
  updateDisplay();
}

// Event listeners
document.getElementById('tap-button').addEventListener('click', tap);
document.getElementById('buy-bed').addEventListener('click', () => buyUpgrade('bed'));
document.getElementById('buy-pillow').addEventListener('click', () => buyUpgrade('pillow'));
document.getElementById('buy-bedding').addEventListener('click', () => buyUpgrade('bedding'));
document.getElementById('buy-environment').addEventListener('click', () => buyUpgrade('environment'));
document.getElementById('buy-pet').addEventListener('click', () => buyUpgrade('pet'));
document.getElementById('prestige-button').addEventListener('click', prestige);

setInterval(idleGain, 1000);
updateDisplay();
checkAchievements();
