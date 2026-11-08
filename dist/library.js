const qrDialog = document.getElementById('qrDialog');
const studentLink = document.getElementById('studentLink');
const games = {
  iconostasis: { title: 'The Iconostasis', lesson: '01', path: './', qr: './assets/classroom-qr.svg' },
  jonathan: { title: 'Jonathan & David', lesson: '02', path: './jonathan-david.html', qr: './assets/jonathan-david-qr.svg' }
};
let gameUrl = '';
for (const button of document.querySelectorAll('[data-qr]')) button.addEventListener('click', () => {
  const game = games[button.dataset.qr];
  gameUrl = new URL(game.path, location.href).href;
  document.getElementById('qrEyebrow').textContent = `CLASSROOM CODE · LESSON ${game.lesson}`;
  document.getElementById('qrTitle').textContent = game.title;
  document.getElementById('qrImage').src = game.qr;
  document.getElementById('qrImage').alt = `QR code that opens ${game.title}`;
  document.getElementById('openSelectedGame').href = game.path;
  document.getElementById('copyLink').textContent = 'Copy game link';
  studentLink.href = gameUrl;
  studentLink.textContent = gameUrl;
  qrDialog.showModal();
});
document.getElementById('closeQr').addEventListener('click', () => qrDialog.close());
qrDialog.addEventListener('click', event => { if (event.target === qrDialog) qrDialog.close(); });
document.getElementById('copyLink').addEventListener('click', async event => {
  try {
    await navigator.clipboard.writeText(gameUrl);
    event.currentTarget.textContent = 'Copied!';
  } catch {
    event.currentTarget.textContent = 'Use the link above';
  }
});
