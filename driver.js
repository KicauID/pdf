// Mengubah event listener untuk menerima pesan dan menghasilkan PDF satu halaman
window.addEventListener("message", async function(event) {
    const { origin, data: { key, params, htmlContent } } = event;

    let pdfData;
    let error;
    try {
        // Generate PDF from HTML content
        pdfData = await generatePDFFromHTML(htmlContent);
    } catch (e) {
        pdfData = undefined;
        try {
            error = e.toString();
        } catch (e) {
            error = "Exception can't be stringified.";
        }
    }

    const response = { key };
    if (pdfData) {
        response.result = { pdfData };
    }
    if (error) {
        response.error = error;
    }

    event.source.postMessage(response, "*");
});

// Function to generate PDF from HTML content
async function generatePDFFromHTML(htmlContent) {
    return new Promise((resolve, reject) => {
        // Konfigurasi html2pdf
        const opt = {
            margin: 1,
            filename: 'output.pdf',
            html2canvas: {
                scale: 2 // Skala rendering untuk meningkatkan kualitas gambar jika diperlukan
            },
            jsPDF: {
                unit: 'in',
                format: 'letter',
                orientation: 'portrait'
            }
        };

        // Menghasilkan PDF menggunakan html2pdf
        html2pdf().set(opt).from(htmlContent).toPdf().get('pdf').then(function(pdf) {
            // Konversi PDF ke base64 untuk dikirimkan sebagai hasil
            pdfOutput = pdf.output('bloburl'); // Mengubah PDF menjadi URL blob
            resolve(pdfOutput);
        }).catch(function(error) {
            reject(error);
        });
    });
}
