window.function = function (html, fileName, format, zoom, orientation, margin, fidelity, customDimensions) {
    // FIDELITY MAPPING
    const fidelityMap = {
        low: 1,
        standard: 1.5,
        high: 2,
        veryHigh: 3,
        ultra: 4
    };

    html = html.value ?? "No HTML set.";
    fileName = fileName.value ?? "file";
    format = format.value ?? "3";
    zoom = zoom.value ?? "1";
    orientation = orientation.value ?? "portrait";
    margin = margin.value ?? "0";
    const quality = fidelityMap[fidelity.value] ?? 4;
    customDimensions = customDimensions.value ? customDimensions.value.split(",").map(Number) : null;

    const formatDimensions = {
        1: [350, 350],
        2: [350, 700],
        3: [350, 1050],
        4: [350, 1400],
        5: [350, 1750],
        6: [350, 2100],
        7: [350, 2450],
        8: [350, 2800],
        9: [350, 3150],
        10: [350, 3500],
        11: [350, 3850],
        12: [350, 4200],
        13: [350, 4550],
        14: [350, 4900],
        15: [350, 5250],
        16: [350, 5600],
        17: [350, 5950],
        18: [350, 6300],
        19: [350, 6650],
        20: [350, 7000],
        21: [350, 7350],
        22: [350, 7700],
        23: [350, 8050],
        24: [350, 8400],
        25: [350, 8750],
        26: [350, 9100],
        27: [350, 9450],
        28: [350, 9800],
        29: [350, 10150],
        30: [350, 10500],
        31: [350, 10850],
        32: [350, 11200],
        33: [350, 11550],
        34: [350, 11900],
        35: [350, 12250],
        36: [350, 12600],
        invoice: [350, 600],
        A6: [350, 495],
        A4: [1240, 1754],
    };

    const dimensions = customDimensions || formatDimensions[format];
    const finalDimensions = dimensions.map((dimension) => Math.round(dimension / zoom));

    // LOG SETTINGS TO CONSOLE
    console.log(
        `Filename: ${fileName}\n` +
        `Format: ${format}\n` +
        `Dimensions: ${dimensions}\n` +
        `Zoom: ${zoom}\n` +
        `Final Dimensions: ${finalDimensions}\n` +
        `Orientation: ${orientation}\n` +
        `Margin: ${margin}\n` +
        `Quality: ${quality}`
    );

    const customCSS = `
    body {
        margin: 0!important;
    }

    .button {
        width: 100%;
        border-radius: 0;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.5rem;
        color: #ffffff;
        border: none;
        font-family: 'Arial';
        padding: 0px 12px;
        height: 32px;
        text-transform: uppercase;
        cursor: pointer;
        box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 1px 2.5px rgba(0, 0, 0, 0.1);
        position: fixed;
        top: 0;
        z-index: 1000;
        background: #0353A7;
    }

    .button:hover {
        background: #f5f5f5;
        color: #000000;
    }

    .button.printing {
        background: #ffffff;
        color: #000000;
    }

    .button.done {
        background: #ffffff;
        color: #000000;
    }

    ::-webkit-scrollbar {
        width: 5px;
        background-color: rgb(0 0 0 / 8%);
    }

    ::-webkit-scrollbar-thumb {
        background-color: rgb(0 0 0 / 32%);
        border-radius: 4px;
    }
    `;

    const originalHTML = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
    <style>${customCSS}</style>
    <div class="main">
        <button class="button" id="print">Print</button>
        <div id="content" class="content thermal-${format}">${html}</div>
    </div>
    <script>
        document.getElementById('print').addEventListener('click', function() {
            var element = document.getElementById('content');
            var button = this;
            button.innerText = 'PRINTING...';
            button.className = 'printing';

            var opt = {
                margin: ${margin},
                filename: '${fileName}',
                html2canvas: {
                    useCORS: true,
                    scale: ${quality}
                },
                jsPDF: {
                    unit: 'px',
                    orientation: '${orientation}',
                    format: [${finalDimensions[0]}, ${finalDimensions[1]}],
                    hotfixes: ['px_scaling']
                }
            };
            html2pdf().set(opt).from(element).toPdf().get('pdf').then(function(pdf) {
                pdf.autoPrint();
                window.open(pdf.output('bloburl'), '_blank');
                button.innerText = 'PRINT DONE';
                button.className = 'done';
                setTimeout(function() { 
                    button.innerText = 'Print';
                    button.className = ''; 
                }, 2000);
            });
        });
    </script>
    `;
    var encodedHtml = encodeURIComponent(originalHTML);
    return "data:text/html;charset=utf-8," + encodedHtml;
};
