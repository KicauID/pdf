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
        alert('Failed to print: ' + error);
    }
}
