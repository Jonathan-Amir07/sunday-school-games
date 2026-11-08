const moments = [
  { id:'name', title:'A child named Philopater', detail:'His Christian family gave him the name Philopater, meaning “Lover of the Father.”', prompt:'Find the beginning of his story.', hint:'Start with the name his family gave him.', symbol:'✣' },
  { id:'soldier', title:'He became a soldier', detail:'In the Roman army he became known as Mercurius.', prompt:'What did Philopater become when he grew up?', hint:'He served in the Roman army.', symbol:'◆' },
  { id:'angel', title:'An angel gave him a sword', detail:'Before a battle, an angel gave him a second sword and told him to remember God.', prompt:'Who brought him a second sword?', hint:'Look for the messenger from heaven.', symbol:'✦' },
  { id:'remember', title:'He remembered God', detail:'After the victory, the angel reminded Mercurius to remember the Lord.', prompt:'What did the angel remind him to do after the victory?', hint:'Remember the source of his help.', symbol:'☀' },
  { id:'incense', title:'He refused to offer incense to idols', detail:'Mercurius confessed his faith in Christ when the emperor asked him to worship idols.', prompt:'What did he do when asked to worship idols?', hint:'He stayed true to his faith in Christ.', symbol:'❖' },
  { id:'martyr', title:'He remained faithful to the end', detail:'Mercurius was martyred for his faith.', prompt:'How does the Synaxarium end his earthly story?', hint:'He remained faithful even when his life was threatened.', symbol:'✧' }
];

const sequence = document.getElementById('sequence');
const cardList = document.getElementById('cardList');
const feedback = document.getElementById('feedback');
let deck = [];
let placed = 0;
let wrongId = '';

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function setFeedback(message, kind = '') {
  feedback.textContent = message;
  feedback.className = `feedback ${kind}`;
}

function render() {
  document.getElementById('progressText').textContent = `${placed} of 6 moments placed`;
  document.getElementById('progressFill').style.width = `${placed / moments.length * 100}%`;
  document.getElementById('stepLabel').textContent = placed === moments.length ? 'STORY COMPLETE' : `FIND MOMENT ${String(placed + 1).padStart(2, '0')}`;
  document.getElementById('stepPrompt').textContent = placed === moments.length ? 'You put his story in order.' : moments[placed].prompt;
  sequence.replaceChildren();
  moments.forEach((moment, index) => {
    const item = document.createElement('li');
    item.className = index < placed ? 'filled' : index === placed ? 'current' : '';
    const number = document.createElement('span');
    number.className = 'slot-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const copy = document.createElement('span');
    copy.textContent = index < placed ? moment.title : index === placed ? 'Choose this moment below' : 'Waiting for its moment';
    item.append(number, copy);
    sequence.append(item);
  });
  cardList.replaceChildren();
  deck.filter(moment => moments.indexOf(moment) >= placed).forEach(moment => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `story-card${wrongId === moment.id ? ' wrong' : ''}`;
    button.dataset.id = moment.id;
    const symbol = document.createElement('span');
    symbol.className = 'card-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = moment.symbol;
    const title = document.createElement('strong');
    title.textContent = moment.title;
    button.append(symbol, title);
    cardList.append(button);
  });
  document.getElementById('finalQuestion').hidden = placed !== moments.length;
  document.querySelector('.cards-head').hidden = placed === moments.length;
  cardList.hidden = placed === moments.length;
}

cardList.addEventListener('click', event => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;
  const expected = moments[placed];
  if (button.dataset.id !== expected.id) {
    wrongId = button.dataset.id;
    button.classList.add('wrong');
    setFeedback(`Try again. ${expected.hint}`, 'try-again');
    return;
  }
  placed += 1;
  wrongId = '';
  render();
  setFeedback(placed === moments.length ? 'All six moments are in order. Try one last question below.' : `Correct! ${expected.detail}`, 'success');
  if (placed === moments.length) {
    document.getElementById('finalQuestion').scrollIntoView({behavior:'smooth',block:'center'});
    document.querySelector('#finalChoices button').focus({preventScroll:true});
  } else {
    cardList.querySelector('button')?.focus({preventScroll:true});
  }
});

document.getElementById('hintButton').addEventListener('click', () => {
  if (placed < moments.length) setFeedback(`Hint: ${moments[placed].hint}`);
});

const finalChoices = document.getElementById('finalChoices');
const finalFeedback = document.getElementById('finalFeedback');
finalChoices.addEventListener('click', event => {
  const button = event.target.closest('button[data-answer]');
  if (!button || document.getElementById('finishButton').hidden === false) return;
  if (button.dataset.answer === 'two') {
    button.classList.add('correct');
    [...finalChoices.querySelectorAll('button')].forEach(choice => choice.disabled = true);
    finalFeedback.textContent = 'Yes! One sword came from the army and the other was given by the angel.';
    finalFeedback.className = 'feedback success';
    document.getElementById('finishButton').hidden = false;
    document.getElementById('finishButton').focus({preventScroll:true});
  } else {
    button.classList.add('wrong');
    finalFeedback.textContent = 'Try again. Look at the two swords in his icon and remember the story.';
    finalFeedback.className = 'feedback try-again';
  }
});

document.getElementById('finishButton').addEventListener('click', () => document.getElementById('winDialog').showModal());

function reset() {
  deck = shuffle(moments);
  placed = 0;
  wrongId = '';
  const winDialog = document.getElementById('winDialog');
  if (winDialog.open) winDialog.close();
  document.getElementById('finishButton').hidden = true;
  finalChoices.querySelectorAll('button').forEach(button => { button.disabled = false; button.classList.remove('correct', 'wrong'); });
  finalFeedback.textContent = 'Choose an answer.';
  finalFeedback.className = 'feedback';
  setFeedback('Choose a card below to begin.');
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

const gameUrl = new URL('./st-philopater.html', location.href).href;
const gameLink = document.getElementById('gameLink');
gameLink.href = gameUrl;
gameLink.textContent = gameUrl;
document.getElementById('copyButton').addEventListener('click', async event => {
  try { await navigator.clipboard.writeText(gameUrl); event.currentTarget.textContent = 'Copied!'; }
  catch { event.currentTarget.textContent = 'Use the link above'; }
});

reset();
