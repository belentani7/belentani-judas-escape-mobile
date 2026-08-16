const screens = [...document.querySelectorAll('[data-screen]')];
const chapterLabel = document.querySelector('#chapterLabel');
const progressFill = document.querySelector('#progressFill');
const toast = document.querySelector('#toast');
const audioDot = document.querySelector('#audioDot');
const track = document.querySelector('#judasTrack');
const experience = document.querySelector('#experience');

let currentScreen = 0;
let audioContext;
let master;
let spatial;
let trackSource;
let drone;
let droneGain;
let toastTimer;
const found = new Set();
const solution = ['red', 'gold', 'blue', 'white'];
let sequence = [];

const chapters = ['01 / UMBRAL', '02 / ARCHIVO', '03 / CAJA DE LUZ', '04 / SEÑAL', '05 / CIERRE'];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2500);
}

function setScreen(next) {
  const previous = screens[currentScreen];
  const target = screens[next];
  previous.classList.remove('screen--active');
  previous.hidden = true;
  target.hidden = false;
  requestAnimationFrame(() => target.classList.add('screen--active'));
  currentScreen = next;
  chapterLabel.textContent = chapters[next];
  progressFill.style.width = `${((next + 1) / screens.length) * 100}%`;
  moveSpatial((Math.random() - 0.5) * 0.4, next * 0.15);
}

async function startAudio() {
  if (!audioContext) {
    audioContext = new AudioContext({ latencyHint: 'interactive' });
    master = audioContext.createGain();
    master.gain.value = 0.68;
    master.connect(audioContext.destination);
    spatial = audioContext.createPanner();
    spatial.panningModel = 'HRTF';
    spatial.distanceModel = 'inverse';
    spatial.refDistance = 1;
    spatial.maxDistance = 10;
    spatial.rolloffFactor = 1.4;
    spatial.positionZ.value = 1;
    spatial.connect(master);

    try {
      trackSource = audioContext.createMediaElementSource(track);
      trackSource.connect(spatial);
      track.volume = 0.5;
      await track.play();
      audioDot.classList.add('is-live');
    } catch {
      showToast('La memoria sonora no esta disponible; queda la resonancia.');
    }

    drone = audioContext.createOscillator();
    droneGain = audioContext.createGain();
    drone.type = 'sine';
    drone.frequency.value = 61.74;
    droneGain.gain.value = 0.012;
    drone.connect(droneGain).connect(spatial);
    drone.start();
  }
  if (audioContext.state === 'suspended') await audioContext.resume();
}

function moveSpatial(horizontal, vertical) {
  if (!spatial) return;
  const x = Math.max(-1.8, Math.min(1.8, horizontal * 2));
  const y = Math.max(-1, Math.min(1, vertical));
  spatial.positionX.value = x;
  spatial.positionY.value = y;
}

function begin() {
  void startAudio();
  setScreen(1);
}

function markRelic(button, relic) {
  if (found.has(relic)) return;
  found.add(relic);
  button.classList.add('is-found');
  const messages = { mirror: 'El espejo no devuelve tu cara. Devuelve la direccion.', thread: 'El hilo estaba cortado por el centro.', key: 'La llave pesa menos cuando dejas de esconderla.' };
  showToast(messages[relic]);
  document.querySelector('#signalCount').textContent = `${found.size} / 3 señales encontradas`;
  if (found.size === 3) {
    document.querySelector('#signalMessage').textContent = 'La caja de luz esta despierta.';
    const toBox = document.querySelector('#toBox');
    toBox.disabled = false;
  }
}

function updateSequence() {
  const dots = [...document.querySelectorAll('#sequenceReadout i')];
  dots.forEach((dot, index) => dot.classList.toggle('is-filled', Boolean(sequence[index])));
}

function pressSlot(slot) {
  const value = slot.dataset.slot;
  void startAudio();
  if (value !== solution[sequence.length]) {
    sequence = [];
    updateSequence();
    document.querySelector('#boxInstruction').textContent = 'No. La luz se apaga. Vuelve a escuchar.';
    document.querySelector('#lightbox').classList.remove('is-open');
    showToast('La secuencia no era esa.');
    return;
  }
  sequence.push(value);
  slot.classList.add('is-lit');
  setTimeout(() => slot.classList.remove('is-lit'), 500);
  updateSequence();
  if (sequence.length === solution.length) {
    document.querySelector('#boxInstruction').textContent = 'La caja reconoce tu pulso.';
    document.querySelector('#lightbox').classList.add('is-open');
    showToast('Desbloqueado. La memoria cambia de lugar.');
    setTimeout(() => setScreen(3), 1300);
  } else {
    document.querySelector('#boxInstruction').textContent = `${solution.length - sequence.length} pulsos restantes.`;
  }
}

function resetSequence() {
  sequence = [];
  updateSequence();
  document.querySelector('#boxInstruction').textContent = 'Pulsa el primer pulso.';
}

function updateRoom(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  const room = document.querySelector('#signalRoom');
  room.style.setProperty('--light-x', `${x * 100}%`);
  room.style.setProperty('--light-y', `${y * 100}%`);
  room.querySelector('.signal-room__point').style.transform = `translate(${x * 110}px,${y * 90}px)`;
  room.querySelector('.signal-room__halo').style.transform = `translate(${x * 18}px,${y * 12}px) scale(${1 + Math.abs(x) * .12})`;
  moveSpatial(x, -y);
}

document.querySelectorAll('[data-action="begin"]').forEach((button) => button.addEventListener('click', begin));
document.querySelectorAll('[data-action="finish"]').forEach((button) => button.addEventListener('click', () => setScreen(4)));
document.querySelectorAll('[data-action="restart"]').forEach((button) => button.addEventListener('click', () => window.location.reload()));
document.querySelectorAll('[data-relic]').forEach((button) => button.addEventListener('click', () => markRelic(button, button.dataset.relic)));
document.querySelectorAll('[data-slot]').forEach((slot) => slot.addEventListener('click', () => pressSlot(slot)));
document.querySelector('#toBox').addEventListener('click', () => setScreen(2));
document.querySelector('#resetSequence').addEventListener('click', resetSequence);
document.querySelector('#wordmark').addEventListener('click', () => window.location.reload());
document.querySelector('#signalRoom').addEventListener('pointermove', updateRoom);
document.querySelector('#signalRoom').addEventListener('pointerdown', (event) => { void startAudio(); updateRoom(event); });
experience.addEventListener('pointermove', (event) => {
  if (event.target.closest('button,.lightbox__slot')) return;
  const horizontal = event.clientX / window.innerWidth - 0.5;
  moveSpatial(horizontal, 0);
});
window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'r') resetSequence();
  if (event.key === 'Escape') setScreen(Math.max(0, currentScreen - 1));
});
