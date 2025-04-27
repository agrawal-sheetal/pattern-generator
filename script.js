document.addEventListener('DOMContentLoaded', function() {
    const rows = document.getElementById('rows');
    const columns = document.getElementById('columns');
    const pixelSize = document.getElementById('pixelSize');
    const patternType = document.getElementById('patternType');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const patternContainer = document.getElementById('pattern');
    const colorInputs = document.getElementById('colorInputs');

    makePattern();

    generateBtn.addEventListener('click', makePattern);
    downloadBtn.addEventListener('click', savePattern);

    function makePattern() {
        let rowCount = parseInt(rows.value);
        let colCount = parseInt(columns.value);
        let pixelSizeVal = parseInt(pixelSize.value);
        let pattern = patternType.value;
        patternContainer.innerHTML = '';
        let colors = [];
        document.querySelectorAll('.color-picker').forEach(picker => {
            colors.push(picker.value);
        });
        
        while (colors.length < 2) {
            colors.push('#ffffff'); 
        }
        
        patternContainer.style.gridTemplateRows = `repeat(${rowCount}, ${pixelSizeVal}px)`;
        patternContainer.style.gridTemplateColumns = `repeat(${colCount}, ${pixelSizeVal}px)`;
        
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                let pixel = document.createElement('div');
                pixel.className = 'pixel';
                pixel.style.width = `${pixelSizeVal}px`;
                pixel.style.height = `${pixelSizeVal}px`;
                
                if (pattern === 'checkerboard') {
                    pixel.style.backgroundColor = (i + j) % 2 === 0 ? colors[0] : colors[1];
                } 
                else if (pattern === 'gradient') {
                    let posX = j / (colCount - 1);
                    let posY = i / (rowCount - 1);
                    let avgPos = (posX + posY) / 2;
                    pixel.style.backgroundColor = blendColors(colors[0], colors[1], avgPos);
                } 
                else if (pattern === 'stripes') {
                    let stripeWidth = Math.ceil(colCount / 2);
                    pixel.style.backgroundColor = colors[Math.floor(j / stripeWidth) % 2];
                } 
                else if (pattern === 'random') {
                    pixel.style.backgroundColor = colors[Math.floor(Math.random() * 2)];
                }
                
                patternContainer.appendChild(pixel);
            }
        }
    }

    function savePattern() {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let rowCount = parseInt(rows.value);
        let colCount = parseInt(columns.value);
        let pixelSizeVal = parseInt(pixelSize.value);
        canvas.width = colCount * pixelSizeVal;
        canvas.height = rowCount * pixelSizeVal;
        let pixels = document.querySelectorAll('.pixel');
        let index = 0;
        
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                ctx.fillStyle = pixels[index].style.backgroundColor;
                ctx.fillRect(j * pixelSizeVal, i * pixelSizeVal, pixelSizeVal, pixelSizeVal);
                index++;
            }
        }
        
        let link = document.createElement('a');
        link.download = `pixel-pattern-${patternType.value}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function blendColors(color1, color2, factor) {
        let r1 = parseInt(color1.substring(1, 3), 16);
        let g1 = parseInt(color1.substring(3, 5), 16);
        let b1 = parseInt(color1.substring(5, 7), 16);
        let r2 = parseInt(color2.substring(1, 3), 16);
        let g2 = parseInt(color2.substring(3, 5), 16);
        let b2 = parseInt(color2.substring(5, 7), 16);
        let r = Math.round(r1 + factor * (r2 - r1));
        let g = Math.round(g1 + factor * (g2 - g1));
        let b = Math.round(b1 + factor * (b2 - b1));
        
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }

    rows.addEventListener('change', makePattern);
    columns.addEventListener('change', makePattern);
    pixelSize.addEventListener('change', makePattern);
    patternType.addEventListener('change', makePattern);
    colorInputs.addEventListener('input', function(event) {
        if (event.target.classList.contains('color-picker')) {
            makePattern();
        }
    });
});