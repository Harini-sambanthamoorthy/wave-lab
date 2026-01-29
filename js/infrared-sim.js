// ==========================================
// Infrared Communication Simulator v4.0
// High Fidelity + Educational Edition
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const irCanvas = document.getElementById('infraredCanvas');
    if (!irCanvas) return;

    const irCtx = irCanvas.getContext('2d');
    const sampleSlider = document.getElementById('sampleSlider');   // Carrier freq (kHz)
    const dutySlider = document.getElementById('dutySlider');       // Duty cycle (%)
    const snrReadout = document.getElementById('snrReadout');
    const successOverlay = document.getElementById('irSuccess');
    const payloadDisplay = document.getElementById('payloadText');

    let locked = false;

    const NOISE_LEVEL = 65;          // Environment noise power
    const TARGET_PAYLOAD = "0xAF32_77_E9";  // Decoded data if link is good

    // ==========================================
    // SNR Model (Simplified Physical Approximation)
    // ==========================================
    function calculateSNR() {
        const carrier = parseFloat(sampleSlider.value); // in kHz
        const duty = parseFloat(dutySlider.value) / 100;

        // IR receivers usually expect ~38 kHz carrier
        const freqMatch = 1 - Math.abs(carrier - 38) / 38;
        const dutyMatch = 1 - Math.abs(duty - 0.33) / 0.67;

        // Effective signal power model
        const signalPower = 1000 * duty * Math.max(0, freqMatch) * Math.max(0, dutyMatch);

        // SNR in dB
        const snr = 10 * Math.log10(Math.max(0.1, signalPower / NOISE_LEVEL));
        return snr;
    }

    // ==========================================
    // Oscilloscope Background
    // ==========================================
    function drawOscilloscopeBackground(width, height) {
        // CRT glow background
        let grad = irCtx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
        grad.addColorStop(0, '#0a0f1e');
        grad.addColorStop(1, '#020617');
        irCtx.fillStyle = grad;
        irCtx.fillRect(0, 0, width, height);

        // Grid
        irCtx.strokeStyle = 'rgba(34, 211, 238, 0.05)';
        irCtx.lineWidth = 0.5;
        for (let i = 0; i < width; i += 40) {
            irCtx.beginPath(); irCtx.moveTo(i, 0); irCtx.lineTo(i, height); irCtx.stroke();
        }
        for (let j = 0; j < height; j += 40) {
            irCtx.beginPath(); irCtx.moveTo(0, j); irCtx.lineTo(width, j); irCtx.stroke();
        }

        // Center axes
        irCtx.strokeStyle = 'rgba(34, 211, 238, 0.15)';
        irCtx.lineWidth = 1;
        irCtx.beginPath(); irCtx.moveTo(width / 2, 0); irCtx.lineTo(width / 2, height); irCtx.stroke();
        irCtx.beginPath(); irCtx.moveTo(0, height / 2); irCtx.lineTo(width, height / 2); irCtx.stroke();
    }

    // ==========================================
    // Main Drawing Loop
    // ==========================================
    function drawInfrared() {
        const width = irCanvas.width = irCanvas.offsetWidth;
        const height = irCanvas.height = 450;

        irCtx.clearRect(0, 0, width, height);
        drawOscilloscopeBackground(width, height);

        const snr = calculateSNR();

        // Update SNR display
        if (snrReadout) {
            snrReadout.innerText = `${snr.toFixed(1)} dB`;
            snrReadout.style.color = snr > 12 ? '#22d3ee' : '#f472b6';
        }

        // Successful lock condition
        if (snr > 12 && !locked) {
            locked = true;
            if (successOverlay) successOverlay.style.display = 'flex';
            if (payloadDisplay) payloadDisplay.innerText = TARGET_PAYLOAD;
        }

        // Noise grain
        irCtx.fillStyle = `rgba(255,255,255,${(Math.random() * 0.02)})`;
        irCtx.fillRect(0, 0, width, height);

        // ==========================================
        // Digital Bitstream Trace
        // ==========================================
        irCtx.save();
        irCtx.strokeStyle = snr > 12 ? '#22d3ee' : '#f472b6';
        irCtx.lineWidth = 2.5;
        irCtx.shadowBlur = 10;
        irCtx.shadowColor = irCtx.strokeStyle;
        irCtx.beginPath();

        const tBase = Date.now() * 0.008;

        for (let x = 0; x < width; x += 2) {
            const t = tBase + x * 0.04;

            // Fake digital data
            const bit = Math.sin(t) + Math.cos(t * 0.3) + Math.sin(t * 0.7) > 0 ? 1 : 0;

            // Noise increases when SNR is low
            const jitter = (Math.random() - 0.5) * (NOISE_LEVEL / (snr > 12 ? 8 : 1.5));

            const y = height / 2 - (bit * 120) + jitter + 60;

            if (x === 0) irCtx.moveTo(x, y);
            else irCtx.lineTo(x, y);
        }
        irCtx.stroke();
        irCtx.restore();

        // ==========================================
        // Sub-carrier (38kHz) visualization
        // ==========================================
        if (snr > 8) {
            irCtx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
            irCtx.lineWidth = 1;
            irCtx.beginPath();

            for (let x = 0; x < width; x += 4) {
                const t = tBase + x * 0.04;
                const bit = Math.sin(t) + Math.cos(t * 0.3) + Math.sin(t * 0.7) > 0 ? 1 : 0;

                if (bit) {
                    const carrier = Math.sin(x * 1.2 + Date.now() * 0.2) * 20;
                    irCtx.lineTo(x, height / 2 - 60 + carrier);
                }
            }
            irCtx.stroke();
        }

        // CRT scanlines
        irCtx.fillStyle = 'rgba(0,0,0,0.1)';
        for (let i = 0; i < height; i += 4) {
            irCtx.fillRect(0, i, width, 2);
        }

        // Status text
        irCtx.fillStyle = snr > 12 ? '#22d3ee' : '#f472b6';
        irCtx.font = '800 12px Inter';
        irCtx.fillText("TRIG'D", 40, 40);
        irCtx.fillText(snr > 12 ? "LINK: LOCKED" : "LINK: NOISY", width - 120, 40);

        requestAnimationFrame(drawInfrared);
    }

    // ==========================================
    // Reset Function
    // ==========================================
    window.resetIR = function () {
        locked = false;
        if (successOverlay) successOverlay.style.display = 'none';
        sampleSlider.value = 38;
        dutySlider.value = 33;
    };

    drawInfrared();

    // If user changes values and SNR drops → unlock
    [sampleSlider, dutySlider].forEach(el => {
        if (el) el.addEventListener('input', () => {
            if (locked && calculateSNR() < 12) locked = false;
        });
    });
});
