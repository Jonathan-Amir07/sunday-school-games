const moments = [
  { id: 'challenge', story: 'korah', text: 'A group gathered to challenge Moses and Aaron’s leadership.', hint: 'This happened in the wilderness with Moses and Aaron.', detail: 'Korah gathered people to challenge Moses and Aaron.' },
  { id: 'prayer', story: 'korah', text: 'Moses fell on his face and asked God to show whom He had chosen.', hint: 'Moses is part of the Numbers 16 story.', detail: 'Moses prayed and asked God to show whom He had chosen.' },
  { id: 'refusal', story: 'korah', text: 'Two men refused Moses’s invitation to come and speak with him.', hint: 'Dathan and Abiram refused Moses’s summons.', detail: 'Dathan and Abiram refused to answer Moses’s summons.' },
  { id: 'study', story: 'demetrius', text: 'A patriarch decided he still had much to learn.', hint: 'The Sunday school lesson remembers a pope who kept studying.', detail: 'Pope Demetrius continued to study after becoming patriarch.' },
  { id: 'teacher', story: 'demetrius', text: 'He sat at his teacher’s feet to learn.', hint: 'This moment shows Pope Demetrius’s humility.', detail: 'Pope Demetrius sat at his teacher’s feet.' },
  { id: 'respect', story: 'demetrius', text: 'His high position did not stop him from respecting his teacher.', hint: 'This is the example set by Pope Demetrius.', detail: 'Pope Demetrius respected his teacher.' }
];

const choices = [
  { id: 'korah', label: 'Korah, Dathan & Abiram', sub: 'The story in Numbers 16', symbol: '✦' },
  { id: 'demetrius', label: 'Pope Demetrius', sub: 'The story of his teacher', symbol: '✣' }
];
const reflectionChoices = [
  'Ask calmly and listen to the answer.',
  'Interrupt loudly and laugh.',
  'Walk away without listening.'
];

let order = [];
let index = 0;
let sorted = { korah: [], demetrius: [] };
let currentSolved = false;
let wrongChoice = '';
const choiceList = document.getElementById('choiceList');
const nextButton = document.getElementById('nextButton');
const feedback = document.getElementById('feedback');

function shuffle() {
  const list = [...moments];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function setFeedback(message, kind = '') {
  feedback.textContent = message;
  feedback.className = `feedback ${kind}`;
}

function renderBoards() {
  for (const story of ['korah', 'demetrius']) {
    const board = document.getElementById(story === 'korah' ? 'korahBoard' : 'demetriusBoard');
    board.innerHTML = sorted[story].map(item => `<li>${item.detail}</li>`).join('');
    if (!sorted[story].length) board.innerHTML = '<li class="empty">Your sorted moments will appear here.</li>';
  }
}

function render() {
  const reflection = index >= order.length;
  const sortedCount = sorted.korah.length + sorted.demetrius.length;
  document.getElementById('progressText').textContent = reflection ? '6 of 6 sorted · one question left' : `${sortedCount} of 6 sorted`;
  document.getElementById('progressFill').style.width = `${sortedCount / 6 * 100}%`;
  document.getElementById('momentEyebrow').textContent = reflection ? 'YOUR TURN · ONE LAST QUESTION' : `MOMENT ${String(index + 1).padStart(2, '0')} OF 06`;
  document.getElementById('momentText').textContent = reflection ? 'You do not understand something your teacher has said.' : order[index].text;
  document.getElementById('momentPrompt').textContent = reflection ? 'What is a respectful way to respond?' : 'Which story does this moment belong to?';
  choiceList.setAttribute('aria-label', reflection ? 'Choose a respectful response' : 'Choose the story for this moment');
  choiceList.innerHTML = reflection
    ? reflectionChoices.map((label, choiceIndex) => `<button class="choice ${currentSolved && choiceIndex === 0 ? 'correct' : wrongChoice === String(choiceIndex) ? 'wrong' : ''}" type="button" data-choice="${choiceIndex}" ${currentSolved ? 'disabled' : ''}><span class="choice-marker">${String.fromCharCode(65 + choiceIndex)}</span><span>${label}</span></button>`).join('')
    : choices.map(choice => `<button class="choice ${currentSolved && choice.id === order[index].story ? 'correct' : wrongChoice === choice.id ? 'wrong' : ''}" type="button" data-choice="${choice.id}" ${currentSolved ? 'disabled' : ''}><span class="choice-marker">${choice.symbol}</span><span><b>${choice.label}</b><small>${choice.sub}</small></span></button>`).join('');
  nextButton.hidden = !currentSolved;
  nextButton.innerHTML = reflection ? 'Finish the lesson <span aria-hidden="true">✦</span>' : index === order.length - 1 ? 'One last question <span aria-hidden="true">→</span>' : 'Next moment <span aria-hidden="true">→</span>';
  if (currentSolved) setFeedback(reflection ? 'Yes. Asking a sincere question kindly shows respect and helps us learn.' : `That belongs to ${order[index].story === 'korah' ? 'Korah’s story' : 'Pope Demetrius’s story'}. ${order[index].detail}`, 'success');
  else setFeedback(reflection ? 'Choose the response that listens and asks kindly.' : 'Choose a story to sort this moment.');
  renderBoards();
}

choiceList.addEventListener('click', event => {
  const button = event.target.closest('button[data-choice]');
  if (!button || currentSolved) return;
  const choice = button.dataset.choice;
  const reflection = index >= order.length;
  const correct = reflection ? choice === '0' : choice === order[index].story;
  if (correct) {
    currentSolved = true;
    wrongChoice = '';
    if (!reflection) sorted[order[index].story].push(order[index]);
    render();
    nextButton.focus({preventScroll:true});
  } else {
    wrongChoice = choice;
    button.classList.add('wrong');
    setFeedback(reflection ? 'Try again. You can ask a question and still show respect.' : `Try again. ${order[index].hint}`, 'try-again');
  }
});

nextButton.addEventListener('click', () => {
  if (!currentSolved) return;
  if (index >= order.length) {
    document.getElementById('winDialog').showModal();
  } else {
    index += 1;
    currentSolved = false;
    wrongChoice = '';
    render();
    document.getElementById('momentCard').scrollIntoView({behavior:'smooth',block:'start'});
  }
});

document.getElementById('hintButton').addEventListener('click', () => {
  if (currentSolved) return;
  setFeedback(index >= order.length ? 'Hint: a respectful question leaves room to listen.' : `Hint: ${order[index].hint}`);
});

function reset() {
  order = shuffle();
  index = 0;
  sorted = { korah: [], demetrius: [] };
  currentSolved = false;
  wrongChoice = '';
  const winDialog = document.getElementById('winDialog');
  if (winDialog.open) winDialog.close();
  render();
  document.getElementById('challenge').scrollIntoView({behavior:'smooth',block:'start'});
}
document.getElementById('resetButton').addEventListener('click', reset);
document.getElementById('playAgainButton').addEventListener('click', reset);

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

const gameUrl = new URL('./respect-humility.html', location.href).href;
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

order = shuffle();
render();
