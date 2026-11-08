const moments = [
  { id: 'friends', title: 'A friendship begins', detail: 'Jonathan and David become close friends.', symbol: '✦', verse: '1 Samuel 18:1–3' },
  { id: 'robe', title: 'The gift of a robe', detail: 'Jonathan gives David his robe and other belongings.', symbol: '◇', verse: '1 Samuel 18:4' },
  { id: 'speaks', title: 'Jonathan speaks up', detail: 'He speaks well of David to Saul and warns David.', symbol: '✧', verse: '1 Samuel 19:1–6' },
  { id: 'arrows', title: 'A message in the field', detail: 'Jonathan uses the arrows to signal that David must leave.', symbol: '➶', verse: '1 Samuel 20:35–42' },
  { id: 'courage', title: 'Courage in the woods', detail: 'Jonathan helps David find strength in God.', symbol: '✣', verse: '1 Samuel 23:16–18' }
];
const byId = Object.fromEntries(moments.map(moment => [moment.id, moment]));
const answer = moments.map(moment => moment.id);
const list = document.getElementById('storyList');
const feedback = document.getElementById('feedback');
let order = [];
let checked = false;

function shuffle() {
  const next = [...answer];
  do {
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
  } while (next.every((id, index) => id === answer[index]));
  return next;
}

function setFeedback(message, kind = '') {
  feedback.textContent = message;
  feedback.className = `feedback ${kind}`;
}

function render(focusId, focusDirection) {
  const correctCount = order.filter((id, index) => id === answer[index]).length;
  document.getElementById('progressText').textContent = `${correctCount} of 5 in place`;
  document.getElementById('progressFill').style.width = `${correctCount * 20}%`;
  list.innerHTML = order.map((id, index) => {
    const moment = byId[id];
    const result = checked ? (answer[index] === id ? ' is-correct' : ' needs-move') : '';
    return `<li class="story-card${result}" data-id="${id}"><span class="position">${String(index + 1).padStart(2, '0')}</span><span class="event-symbol" aria-hidden="true">${moment.symbol}</span><div class="event-copy"><h3>${moment.title}</h3><p>${moment.detail}</p><span>${moment.verse}</span></div><div class="move-controls"><button type="button" data-move="up" data-id="${id}" aria-label="Move ${moment.title} earlier" ${index === 0 ? 'disabled' : ''}>↑</button><button type="button" data-move="down" data-id="${id}" aria-label="Move ${moment.title} later" ${index === order.length - 1 ? 'disabled' : ''}>↓</button></div></li>`;
  }).join('');
  if (focusId) list.querySelector(`[data-move="${focusDirection}"][data-id="${focusId}"]`)?.focus({preventScroll:true});
}

function reset() {
  order = shuffle();
  checked = false;
  document.getElementById('winDialog').close();
  render();
  setFeedback('Use the arrows to put the five moments in order. You can read the story again at any time.');
}

list.addEventListener('click', event => {
  const button = event.target.closest('button[data-move]');
  if (!button) return;
  const index = order.indexOf(button.dataset.id);
  const other = index + (button.dataset.move === 'up' ? -1 : 1);
  if (other < 0 || other >= order.length) return;
  [order[index], order[other]] = [order[other], order[index]];
  checked = false;
  render(button.dataset.id, button.dataset.move);
  setFeedback('Card moved. Keep going, or check your order.');
});

document.getElementById('checkButton').addEventListener('click', () => {
  checked = true;
  render();
  const firstWrong = order.findIndex((id, index) => id !== answer[index]);
  if (firstWrong === -1) {
    setFeedback('Wonderful! All five story moments are in order.', 'success');
    document.getElementById('winDialog').showModal();
  } else {
    const correct = order.filter((id, index) => id === answer[index]).length;
    setFeedback(`${correct} of 5 moments are in the right place. Look again at the story and try moving a card.`, 'try-again');
  }
});

document.getElementById('hintButton').addEventListener('click', () => {
  const firstWrong = order.findIndex((id, index) => id !== answer[index]);
  if (firstWrong === -1) {
    setFeedback('Your story is in order! Tap “Check my order.”', 'success');
    return;
  }
  setFeedback(`Hint: position ${firstWrong + 1} should be “${byId[answer[firstWrong]].title}.”`);
});

const storyDialog = document.getElementById('storyDialog');
const teacherDialog = document.getElementById('teacherDialog');
document.getElementById('storyButton').addEventListener('click', () => storyDialog.showModal());
document.getElementById('referenceButton').addEventListener('click', () => storyDialog.showModal());
document.getElementById('teacherButton').addEventListener('click', () => teacherDialog.showModal());
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => {
  const dialog = button.closest('dialog');
  dialog.close();
  if (dialog === storyDialog) document.getElementById('challenge').scrollIntoView({behavior:'smooth'});
}));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
}));
document.getElementById('resetButton').addEventListener('click', reset);
document.getElementById('playAgainButton').addEventListener('click', reset);

const gameUrl = new URL('./jonathan-david.html', location.href).href;
const gameLink = document.getElementById('gameLink');
gameLink.href = gameUrl;
gameLink.textContent = gameUrl;
document.getElementById('copyButton').addEventListener('click', async event => {
  try {
    await navigator.clipboard.writeText(gameUrl);
    event.currentTarget.textContent = 'Copied!';
  } catch {
    event.currentTarget.textContent = 'Use the link above';
  }
});

reset();
