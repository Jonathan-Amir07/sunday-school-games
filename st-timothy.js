const scenes = [
  {
    short: 'Serve', eyebrow: 'A SHEPHERD FOR ANSENA', title: 'A faithful beginning',
    intro: 'Timothy became a monk while he was young. His good character and knowledge led to his selection as Bishop of Ansena.',
    question: 'How did Timothy serve the people of Ansena?',
    choices: ['He taught believers and guided them toward Christ.', 'He built a palace for himself.', 'He stopped caring for the people.'],
    correct: 0, hint: 'Think about what a caring bishop does for his people.',
    reveal: 'Yes. St. Timothy taught the believers and helped them follow Christ.'
  },
  {
    short: 'Return', eyebrow: 'FAITH THROUGH HARDSHIP', title: 'Back to his people',
    intro: 'The governor imprisoned Timothy for his faith. Years later, when the persecution ended, Timothy was set free.',
    question: 'Where did Timothy go after he was released?',
    choices: ['He became the new governor.', 'He returned to his diocese and his people.', 'He forgot the people of Ansena.'],
    correct: 1, hint: 'His people still needed their bishop.',
    reveal: 'That’s right. Timothy returned to his diocese and gathered its priests.'
  },
  {
    short: 'Pray', eyebrow: 'A SURPRISING PRAYER', title: 'Prayer through the night',
    intro: 'Timothy gathered the priests of his diocese. Together they prayed through the night.',
    question: 'Who did Timothy especially pray for?',
    choices: ['Only the people who had praised him.', 'The governor who had hurt him.', 'No one at all.'],
    correct: 1, hint: 'His prayer showed forgiveness toward someone who had hurt him.',
    reveal: 'Yes. He prayed that the governor would come close to God.'
  },
  {
    short: 'Forgive', eyebrow: 'A CHANGED HEART', title: 'The governor listens',
    intro: 'When the governor heard that Timothy had prayed for him, he was surprised and asked about the Christian faith.',
    question: 'What happened after Timothy answered him?',
    choices: ['Timothy refused to speak with him.', 'The governor left without listening.', 'The governor believed, was baptized by Timothy, and later became a monk.'],
    correct: 2, hint: 'The story ends with the governor’s heart changing.',
    reveal: 'Exactly. Timothy taught him, baptized him, and the governor later became a monk.'
  }
];

let active = 0;
let solved = Array(scenes.length).fill(false);
let lastWrong = -1;
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('nextButton');

function setFeedback(message, kind = '') {
  feedback.textContent = message;
  feedback.className = `feedback ${kind}`;
}

function render() {
  const scene = scenes[active];
  document.getElementById('sceneNumber').textContent = String(active + 1).padStart(2, '0');
  document.getElementById('sceneEyebrow').textContent = scene.eyebrow;
  document.getElementById('sceneTitle').textContent = scene.title;
  document.getElementById('sceneIntro').textContent = scene.intro;
  document.getElementById('sceneQuestion').textContent = scene.question;
  document.getElementById('journeySteps').innerHTML = scenes.map((item, index) => `<div class="journey-step ${solved[index] ? 'done' : index === active ? 'active' : ''}" ${index === active ? 'aria-current="step"' : ''}><span>${solved[index] ? '✓' : String(index + 1).padStart(2, '0')}</span><b>${item.short}</b></div>`).join('');
  document.getElementById('choiceList').innerHTML = scene.choices.map((choice, index) => `<button type="button" class="choice ${solved[active] && index === scene.correct ? 'correct' : index === lastWrong ? 'wrong' : ''}" data-choice="${index}" ${solved[active] ? 'disabled' : ''}><span class="choice-marker">${String.fromCharCode(65 + index)}</span><span>${choice}</span></button>`).join('');
  const count = solved.filter(Boolean).length;
  document.getElementById('progressText').textContent = `${count} of 4 moments`;
  document.getElementById('progressFill').style.width = `${count * 25}%`;
  nextButton.hidden = !solved[active];
  nextButton.innerHTML = active === scenes.length - 1 ? 'Finish the story <span aria-hidden="true">✦</span>' : 'Continue the story <span aria-hidden="true">→</span>';
  if (solved[active]) setFeedback(scene.reveal, 'success');
  else setFeedback('Choose an answer to continue the story.');
}

document.getElementById('choiceList').addEventListener('click', event => {
  const button = event.target.closest('button[data-choice]');
  if (!button || solved[active]) return;
  const chosen = Number(button.dataset.choice);
  if (chosen === scenes[active].correct) {
    solved[active] = true;
    lastWrong = -1;
    render();
    nextButton.focus({preventScroll:true});
  } else {
    lastWrong = chosen;
    button.classList.add('wrong');
    setFeedback(`Try again. ${scenes[active].hint}`, 'try-again');
  }
});

nextButton.addEventListener('click', () => {
  if (!solved[active]) return;
  if (active === scenes.length - 1) {
    document.getElementById('winDialog').showModal();
  } else {
    active += 1;
    lastWrong = -1;
    render();
    document.getElementById('sceneCard').scrollIntoView({behavior:'smooth',block:'start'});
  }
});

function reset() {
  active = 0;
  solved = Array(scenes.length).fill(false);
  lastWrong = -1;
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

const gameUrl = new URL('./st-timothy.html', location.href).href;
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

render();
