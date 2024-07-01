window.function = function (html, fileName, format, zoom, orientation, margin, breakBefore, breakAfter, breakAvoid, fidelity, customDimensions) {
    // DYNAMIC VALUES
    html = html.value ?? "No HTML set.";
    fileName = fileName.value ?? "file";
    format = format.value ?? "thermal_80mm";
    zoom = zoom.value ?? "1";
    orientation = orientation.value ?? "portrait";
    margin = margin.value ?? "0";
    breakBefore = breakBefore.value ? breakBefore.value.split(",") : [];
    breakAfter = breakAfter.value ? breakAfter.value.split(",") : [];
    breakAvoid = breakAvoid.value ? breakAvoid.value.split(",") : [];
    customDimensions = customDimensions.value ? customDimensions.value.split(",").map(Number) : null;

    // DOCUMENT DIMENSIONS HANYA UNTUK A4 DAN THERMAL 80MM
    const formatDimensions = {
        a4: [210, 297], // Format A4 dalam mm (width, height)
        thermal_80mm: [80, 225] // Format thermal 80mm dalam mm (width, height)
    };

    // GET FINAL DIMENSIONS FROM SELECTED FORMAT
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
        `Break before: ${breakBefore}\n` +
        `Break after: ${breakAfter}\n` +
        `Break avoid: ${breakAvoid}`
    );

    const customCSS = `
    body {
        margin: 0!important;
    }

    .button {
        width: 50%;
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
    }

    button#download {
        background: #04A535;
        left: 0;
    }

    button#download:hover {
        background: #f5f5f5;
        color: #000000;
    }

    button#download.downloading {
        background: #ffffff;
        color: #000000;
    }

    button#download.done {
        background: #ffffff;
        color: #000000;
    }

    button#print {
        background: #0353A7;
        right: 0;
    }

    button#print:hover {
        background: #f5f5f5;
        color: #000000;
    }

    button#print.printing {
        background: #ffffff;
        color: #000000;
    }

    button#print.done {
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
    <style>${customCSS}</style>
    <div class="main">
        <button class="button" id="download">Download</button>
        <button class="button" id="print">Print</button>
        <div id="content" class="content">${html}</div>
    </div>
    <script>
        document.getElementById('download').addEventListener('click', function() {
            var element = document.getElementById('content');
            var button = this;
            button.innerText = 'DOWNLOADING...';
            button.className = 'downloading';

            var opt = {
                margin: ${margin},
                filename: '${fileName}',
                html2canvas: {
                    useCORS: true,
                    scale: 2 // Skala rendering untuk meningkatkan kualitas gambar jika diperlukan
                },
                jsPDF: {
                    unit: 'in',
                    orientation: '${orientation}',
                    format: [${finalDimensions}]
                }
            };
            html2pdf().set(opt).from(element).toPdf().get('pdf').then(function(pdf) {
                button.innerText = 'DOWNLOAD DONE';
                button.className = 'done';
                setTimeout(function() { 
                    button.innerText = 'Download';
                    button.className = ''; 
                }, 2000);
            }).save();
        });

        document.getElementById('print').addEventListener('click', function() {
            var element = document.getElementById('content');
            var button = this;
            button.innerText = 'PRINTING...';
            button.className = 'printing';

            // Adjust printing logic based on Bluetooth or other specific printer API

            // Example: Print using Bluetooth printer
            printToBluetoothPrinter(element.innerHTML).then(function() {
                button.innerText = 'PRINT DONE';
                button.className = 'done';
                setTimeout(function() { 
                    button.innerText = 'Print';
                    button.className = ''; 
                }, 2000);
            }).catch(function(error) {
                console.error('Error:', error);
                alert('Failed to print');
                button.innerText = 'Print';
                button.className = ''; 
            });
        });
    </script>
    `;
    var encodedHtml = encodeURIComponent(originalHTML);
    return "data:text/html;charset=utf-8," + encodedHtml;
};

// Function to print content to Bluetooth printer
async function printToBluetoothPrinter(content) {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['printer_service'] }]
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('printer_service');
        const characteristic = await service.getCharacteristic('print_characteristic');

        let data = new TextEncoder().encode(content);
        await characteristic.writeValue(data);

        console.log('Printed successfully');
        alert('Printed successfully');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to print');
    }
}
