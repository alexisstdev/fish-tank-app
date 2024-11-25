export async function connectSerial() {
	// @ts-ignore
	const port = await navigator.serial.requestPort();
	await port.open({ baudRate: 9600 });

	const textDecoder = new TextDecoderStream();
	// @ts-ignore
	const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
	const reader = textDecoder.readable.getReader();

	return { port, reader };
}

// @ts-ignore
export async function writeSerial(port, message) {
	const textEncoder = new TextEncoderStream();
	// @ts-ignore
	const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
	const writer = textEncoder.writable.getWriter();
	await writer.write(message);
	writer.releaseLock();
}
