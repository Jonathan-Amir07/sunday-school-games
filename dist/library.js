const qrDialog = document.getElementById('qrDialog');
const gameUrl = new URL('./', location.href).href;
const studentLink = document.getElementById('studentLink');
studentLink.href = gameUrl;
studentLink.textContent = gameUrl;
for (const id of ['showQr', 'showQrBottom']) document.getElementById(id).addEventListener('click', () => qrDialog.showModal());
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
