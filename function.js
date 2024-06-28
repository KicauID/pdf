window.function = function (html, fileName, format, zoom, orientation, margin, breakBefore, breakAfter, breakAvoid, fidelity, customDimensions) {
    // FIDELITY MAPPING
    const fidelityMap = {
        low: 1,
        standard: 1.5,
        high: 2,
    };

    // DYNAMIC VALUES
    html = html.value ?? "No HTML set.";
    fileName = fileName.value ?? "file";
    format = format.value ?? "a4";
    zoom = zoom.value ?? "1";
    orientation = orientation.value ?? "portrait";
    margin = margin.value ?? "0";
    breakBefore = breakBefore.value ? breakBefore.value.split(",") : [];
    breakAfter = breakAfter.value ? breakAfter.value.split(",") : [];
    breakAvoid = breakAvoid.value ? breakAvoid.value.split(",") : [];
    quality = fidelityMap[fidelity.value] ?? 1.5;
    customDimensions = customDimensions.value ? customDimensions.value.split(",").map(Number) : null;

    // DOCUMENT DIMENSIONS
    const formatDimensions = {
        a0: [4967, 7022],
        a1: [3508, 4967],
        a2: [2480, 3508],
        a3: [1754, 2480],
        a4: [1240, 1754],
        a5: [874, 1240],
        a6: [620, 874],
        a7: [437, 620],
        a8: [307, 437],
        a9: [219, 307],
        a10: [154, 219],
        b0: [5906, 8350],
        b1: [4175, 5906],
        b2: [2953, 4175],
        b3: [2085, 2953],
        b4: [1476, 2085],
        b5: [1039, 1476],
        b6: [738, 1039],
        b7: [520, 738],
        b8: [366, 520],
        b9: [260, 366],
        b10: [183, 260],
        c0: [5415, 7659],
        c1: [3827, 5415],
        c2: [2705, 3827],
        c3: [1913, 2705],
        c4: [1352, 1913],
        c5: [957, 1352],
        c6: [673, 957],
        c7: [478, 673],
        c8: [337, 478],
        c9: [236, 337],
        c10: [165, 236],
        dl: [650, 1299],
        letter: [1276, 1648],
        government_letter: [1199, 1577],
        legal: [1276, 2102],
        junior_legal: [1199, 750],
        ledger: [2551, 1648],
        tabloid: [1648, 2551],
        credit_card: [319, 508],
        thermal_58mm: [154, 1050], // Added thermal paper 58mm dimensions
        thermal_80mm: [224, 1050], // Added thermal paper 80mm dimensions
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
        `Break avoid: ${breakAvoid}\n` +
        `Quality: ${quality}`
    );

    const customCSS = `
    body {
      margin: 0!important;
    }

    .button {
      width: 50%; /* Each button takes half the width */
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

    button#print {
      background: #0353A7;
      right: 0;
    }

    button#download:hover, button#print:hover {
      background: #f5f5f5;
      color: #000000;
    }

    button#download.downloading, button#print.printing {
      background: #ffffff;
      color: #000000;
    }

    button#download.done, button#print.done {
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

    .content {
      margin-top: 40px; /* Adding margin to avoid overlap with fixed buttons */
    }
    `;

    // HTML THAT IS RETURNED AS A RENDERABLE URL
    const originalHTML = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
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
          pagebreak: { mode: ['css'], before: ${JSON.stringify(breakBefore)}, after: ${JSON.stringify(breakAfter)}, avoid: ${JSON.stringify(breakAvoid)} },
          margin: ${margin},
          filename: '${fileName}',
          html2canvas: {
            useCORS: true,
            scale: ${quality}
          },
          jsPDF: {
            unit: 'px',
            orientation: '${orientation}',
            format: [${finalDimensions}],
            hotfixes: ['px_scaling']
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

        var opt = {
          pagebreak: { mode: ['css'], before: ${JSON.stringify(breakBefore)}, after: ${JSON.stringify(breakAfter)}, avoid: ${JSON.stringify(breakAvoid)} },
          margin: ${margin},
          filename: '${fileName}',
          html2canvas: {
            useCORS: true,
            scale: ${quality}
          },
          jsPDF: {
            unit: 'px',
            orientation: '${orientation}',
            format: [${finalDimensions}],
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
