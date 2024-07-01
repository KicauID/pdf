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
            },
            pagebreak: {
                avoid: '.avoid-this-element', // Hindari pemisahan halaman pada elemen dengan kelas ini
                before: '.page-break-before', // Pemisahan halaman sebelum elemen dengan kelas ini
                after: '.page-break-after' // Pemisahan halaman setelah elemen dengan kelas ini
            },
            // Fungsi untuk menentukan apakah halaman cukup besar untuk konten atau tidak
            html2pdf: {
                pagebreak: {
                    mode: ['css'],
                    avoid: '.do_not_Break',
                    before: '.allow-page-break-before',
                    in customized dimensions type "even without so dimensions even what   understood.let so sure set automated else response as? do
