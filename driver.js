// Mengubah event listener untuk menerima pesan dan menghasilkan PDF satu halaman
window.addEventListener("message", async function(event) {
    const { origin, data: { key, params, htmlContent } } = event;

    let pdfData;
    let error;
    try {
        // Generate PDF from HTML content using window.function
        const pdfUrl = window.function(htmlContent, ...Object.values(params));
        pdfData = await fetch(pdfUrl).then(response => response.blob());
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
        const pdfBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(pdfData);
        });
        response.result = { pdfData: pdfBase64 };
    }
    if (error) {
        response.error = error;
    }

    event.source.postMessage(response, "*");
});
