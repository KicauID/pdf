window.function = function (html, format) {

  // ==== WAJIB ====
  html = html?.value ?? "No HTML set.";
  format = format?.value ?? "3";

  // ==== FORMAT DIMENSI ====
  const formatDimensions = {
    1: [350, 350],
    2: [350, 700],
    3: [350, 1050],
    4: [350, 1400],
    5: [350, 1750],
    invoice: [350, 700],
    A4: [1240, 1754],
  };

  const dimensions = formatDimensions[format] ?? formatDimensions[3];

  // ==== CSS (ANTI SHRINK BUTTON) ====
  const customCSS = `
    body { margin: 0 !important; }

    .button {
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding: 0 12px;
      border-radius: 0;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      border: none;
      cursor: pointer;
      text-transform: uppercase;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      background: #0353A7;
      box-sizing: border-box;
      transform: none !important;
      box-shadow: 0 0 0 0.5px rgba(0,0,0,.08), 0 1px 2.5px rgba(0,0,0,.1);
    }

    .button:hover {
      background: #024A97;
    }

    .button:active {
      background: #013B78;
      transform: none !important;
    }

    .button.printing {
      background: #013B78;
    }
  `;

  // ==== HTML FINAL ====
  const finalHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
<style>${customCSS}</style>
</head>

<body>

<button class="button" id="print">Print</button>

<div id="content">
${html}
</div>

<script>
document.getElementById('print').onclick = function () {
  const btn = this;
  btn.innerText = 'PRINTING...';
  btn.classList.add('printing');

  html2pdf().set({
    margin: 0,
    html2canvas: { scale: 2 },
    jsPDF: {
      unit: 'px',
      format: [${dimensions[0]}, ${dimensions[1]}],
      orientation: 'portrait'
    }
  }).from(document.getElementById('content')).toPdf().get('pdf').then(pdf => {
    pdf.autoPrint();
    window.open(pdf.output('bloburl'), '_blank');

    btn.innerText = 'Print';
    btn.classList.remove('printing');
  });
};
</script>

</body>
</html>
`;

  return "data:text/html;charset=utf-8," + encodeURIComponent(finalHTML);
};
