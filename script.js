document.getElementById('generateButton').addEventListener('click', () => {
    const essay = document.getElementById('essayInput').value;
    const maxCharsPerSquare = 300; // Adjust for text size
    const words = essay.split(' ');
    const imagePreview = document.getElementById('imagePreview');
    const downloadButton = document.getElementById('downloadAllButton');
    imagePreview.innerHTML = '';

    let currentText = '';
    let squareCount = 0;

    words.forEach((word, index) => {
        if ((currentText + word).length > maxCharsPerSquare || index === words.length - 1) {
            if (index === words.length - 1) currentText += ' ' + word;
            squareCount++;
            createSquare(currentText, squareCount);
            currentText = '';
        }
        currentText += (currentText ? ' ' : '') + word;
    });

    downloadButton.style.display = squareCount > 0 ? 'block' : 'none';
});

function createSquare(text, count) {
    const canvas = document.createElement('canvas');
    const size = 1080; // Instagram square size
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    ctx.font = '24px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';

    const lines = wrapText(ctx, text, size - 40);
    lines.forEach((line, i) => {
        ctx.fillText(line, size / 2, 50 + i * 30);
    });

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('imageContainer');
    imageContainer.appendChild(canvas);

    const imagePreview = document.getElementById('imagePreview');
    imagePreview.appendChild(imageContainer);
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });

    lines.push(currentLine.trim());
    return lines;
}

document.getElementById('downloadAllButton').addEventListener('click', () => {
    const canvases = document.querySelectorAll('#imagePreview canvas');
    canvases.forEach((canvas, i) => {
        const link = document.createElement('a');
        link.download = `square_${i + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});