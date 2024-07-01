// Function to generate PDF from HTML content
async function generatePDFFromHTML(htmlContent) {
    return new Promise((resolve, reject) => {
        // Konfigurasi html2pdf
        const opt = {
            margin: 0, // Tanpa margin
            filename: 'output.pdf',
            html2canvas: {
                scale: 2 // Skala rendering untuk meningkatkan kualitas gambar jika diperlukan
            },
            jsPDF: {
                unit: 'in',
                format: [2.76, 7.42], // Format kertas untuk thermal 80mm, dalam inci (width, height)
                orientation: 'portrait',
                compressPDF: true // Mengompres PDF untuk ukuran file yang lebih kecil
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
