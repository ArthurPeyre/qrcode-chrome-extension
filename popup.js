// State
let currentUrl = '';
let qrSize = 300-16;
let fgColor = '#0a0a0a';
let bgColor = '#fff';
bgColor = 'transparent';
let qrcode;

// DOM Refs
let textToTransform;
let currentUrlBtn;
let copyBtn;
let downloadBtn;
let deleteBtn;

function getCurrentUrl() {
    chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]?.url) {
            currentUrl = tabs[0].url;
            const display = currentUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            textToTransform.value = display;
            generateQR();
        }
    });
}

function generateQR() {
    qrcode.clear();

    qrcode.makeCode(textToTransform.value)
}

async function copyQR() {
    const canvas = document.querySelector('#qrcode canvas');

    if (!canvas) return;

    try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
    } catch {
        await navigator.clipboard.writeText(currentUrl);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    textToTransform = document.getElementById('txtToTransform');
    currentUrlBtn = document.getElementById('currentUrlBtn');
    copyBtn = document.getElementById('copy');
    downloadBtn = document.getElementById('download');
    deleteBtn = document.getElementById('delete');

    qrcode = new QRCode("qrcode", {
        text: '',
        width: qrSize,
        height: qrSize,
        colorDark: fgColor,
        colorLight: bgColor,
        correctLevel: QRCode.CorrectLevel.H
    });

    textToTransform.addEventListener('input', generateQR);

    currentUrlBtn.addEventListener('click', getCurrentUrl);

    copyBtn.addEventListener('click', copyQR);

    deleteBtn.addEventListener('click', () => {
        textToTransform.value = "";
        generateQR()
    });

    // GET CURRENT URL ON START
    getCurrentUrl();
});