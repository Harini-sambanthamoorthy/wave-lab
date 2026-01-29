// ==========================================
// Microwave Link Simulator v4.0
// Friis Path Loss + Space Link Model
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const mwCanvas = document.getElementById('microwaveCanvas');
    if (!mwCanvas) return;

    const mwCtx = mwCanvas.getContext('2d');
    const freqNum = document.getElementById('freqNum');       // GHz
    const powerSlider = document.getElementById('powerSlider'); // dBm
    const gainSlider = document.getElementById('gainSlider');   // dBi
    const rxReadout = document.getElementById('rxReadout');
    const successOverlay = document.getElementById('mwSuccess');

    let locked = false;

    const distanceKm = 150;   // Link distance
    const atmosAlpha = 0.5;   // Atmospheric attenuation coefficient

    // ==========================================
    // Friis Transmission Equation (Simplified)
    // Pr = Pt + Gt + Gr - FSPL - AtmosphericLoss
    // ==========================================
    function calculateReceivedPower() {
        const fGHz = parseFloat(freqNum.value) || 1;
        const Pt = parseFloat(powerSlider.value); // dBm
        const Gt = parseFloat(gainSlider.value);  // dBi
        const Gr = 10;                            // dBi (fixed RX antenna)

        // Free Space Path Loss (FSPL) in dB
        // FSPL = 32.44 + 20log10(d[km]) + 20log10(f[MHz])
        const fspl = 32.44 + 20 * Math.log10(distanceKm) + 20 * Math.log10(fGHz * 1000);

        // Atmospheric + rain loss (simplified)
        const atmosphericLoss = atmosAlpha * (distanceKm / 4);

        const Pr = Pt + Gt + Gr - fspl - atmosphericLoss;
        return Pr;
    }

    // ==========================================
    // Drawing Helpers
    // ==========================================
    function drawRover(x, y) {
        let grad = mwCtx.createLinearGradient(x - 20, y, x + 20, y + 20);
        grad.addColorStop(0, '#475569');
        grad.addColorStop(1, '#1e293b');
        mwCtx.fillStyle = grad;
        mwCtx.fillRect(x - 25, y, 50, 20);

        mwCtx.fillStyle = '#0f172a';
        mwCtx.beginPath();
        mwCtx.arc(x - 18, y + 22, 6, 0, Math.PI * 2);
        mwCtx.arc(x, y + 22, 6, 0, Math.PI * 2);
        mwCtx.arc(x + 18, y + 22, 6, 0, Math.PI * 2);
        mwCtx.fill();

        // Antenna mast
        mwCtx.strokeStyle = '#94a3b8';
        mwCtx.lineWidth = 3;
        mwCtx.beginPath();
        mwCtx.moveTo(x, y);
        mwCtx.lineTo(x, y - 40);
        mwCtx.stroke();

        // Dish
        mwCtx.beginPath();
        mwCtx.arc(x, y - 45, 12, Math.PI, 0);
        mwCtx.strokeStyle = '#22d3ee';
        mwCtx.stroke();

        // Lock glow
        if (locked) {
            mwCtx.shadowBlur = 15;
            mwCtx.shadowColor = '#22d3ee';
            mwCtx.beginPath();
            mwCtx.arc(x, y - 45, 2, 0, Math.PI * 2);
            mwCtx.fillStyle = '#22d3ee';
            mwCtx.fill();
            mwCtx.shadowBlur = 0;
        }
    }

    function drawEarthStation(x, y) {
        let grad = mwCtx.createRadialGradient(x, y, 10, x, y, 60);
        grad.addColorStop(0, 'rgba(34, 211, 238, 0.2)');
        grad.addColorStop(1, 'transparent');
        mwCtx.fillStyle = grad;
        mwCtx.beginPath();
        mwCtx.arc(x, y, 60, 0, Math.PI * 2);
        mwCtx.fill();

        // Base
        mwCtx.fillStyle = '#1e293b';
        mwCtx.beginPath();
        mwCtx.moveTo(x - 40, y + 60);
        mwCtx.lineTo(x + 40, y + 60);
        mwCtx.lineTo(x, y);
        mwCtx.fill();

        // Dish
        mwCtx.strokeStyle = '#22d3ee';
        mwCtx.lineWidth = 4;
        mwCtx.beginPath();
        mwCtx.arc(x, y, 50, 0.2, Math.PI - 0.2);
        mwCtx.stroke();

        // Feed
        mwCtx.fillStyle = '#22d3ee';
        mwCtx.beginPath();
        mwCtx.arc(x, y + 35, 5, 0, Math.PI * 2);
        mwCtx.fill();
    }

    // ==========================================
    // Main Loop
    // ==========================================
    function drawMicrowave() {
        const width = mwCanvas.width = mwCanvas.offsetWidth;
        const height = mwCanvas.height = 450;

        mwCtx.clearRect(0, 0, width, height);

        // Space background
        let skyGrad = mwCtx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#020617');
        skyGrad.addColorStop(1, '#0f172a');
        mwCtx.fillStyle = skyGrad;
        mwCtx.fillRect(0, 0, width, height);

        // Stars
        for (let i = 0; i < 80; i++) {
            let opacity = Math.abs(Math.sin(Date.now() * 0.001 + i));
            mwCtx.fillStyle = `rgba(255,255,255,${opacity * 0.5})`;
            mwCtx.fillRect((i * 137.5) % width, (i * 241) % height, 1.5, 1.5);
        }

        const Pr = calculateReceivedPower();

        if (rxReadout) {
            rxReadout.innerText = `${Pr.toFixed(1)} dBm`;
            rxReadout.style.color = Pr > -75 ? '#22c55e' : '#f472b6';
        }

        // Lock condition
        if (Pr > -75 && !locked) {
            locked = true;
            if (successOverlay) successOverlay.style.display = 'flex';
        }

        // Dust / rain cloud (attenuation visual)
        mwCtx.fillStyle = 'rgba(120, 113, 108, 0.15)';
        for (let j = 0; j < 5; j++) {
            let dx = (Date.now() * 0.02 + j * 150) % width;
            mwCtx.beginPath();
            mwCtx.ellipse(dx, height / 2 + Math.sin(j) * 50, 150, height / 3, 0, 0, Math.PI * 2);
            mwCtx.fill();
        }

        const txX = 150, txY = 350;
        const rxX = width - 150, rxY = 150;

        drawRover(txX, txY);
        drawEarthStation(rxX, rxY);

        // Beam
        if (Pr > -95) {
            mwCtx.save();
            const beamColor = Pr > -75 ? 'rgba(34, 211, 238,' : 'rgba(244, 114, 182,';
            const opacity = Math.min(1, (Pr + 95) / 20);

            mwCtx.strokeStyle = beamColor + (opacity * 0.25) + ')';
            mwCtx.lineWidth = 15;
            mwCtx.shadowBlur = 20;
            mwCtx.shadowColor = Pr > -75 ? '#22d3ee' : '#f472b6';

            mwCtx.beginPath();
            mwCtx.moveTo(txX, txY - 45);
            mwCtx.lineTo(rxX, rxY + 35);
            mwCtx.stroke();
            mwCtx.restore();

            // Data particles
            if (Pr > -75) {
                const t = Date.now() * 0.003;
                for (let i = 0; i < 8; i++) {
                    const p = (t + i / 8) % 1;
                    const px = txX + (rxX - txX) * p;
                    const py = (txY - 45) + (rxY + 35 - (txY - 45)) * p;

                    mwCtx.fillStyle = '#fff';
                    mwCtx.shadowBlur = 10;
                    mwCtx.shadowColor = '#22d3ee';
                    mwCtx.beginPath();
                    mwCtx.arc(px, py, 2, 0, Math.PI * 2);
                    mwCtx.fill();
                }
            }
        }

        requestAnimationFrame(drawMicrowave);
    }

    // ==========================================
    // Reset
    // ==========================================
    window.resetMW = function () {
        locked = false;
        if (successOverlay) successOverlay.style.display = 'none';
        freqNum.value = 15;
    };

    drawMicrowave();

    // Unlock if power drops
    [freqNum, powerSlider, gainSlider].forEach(el => {
        if (el) el.addEventListener('input', () => {
            if (locked && calculateReceivedPower() < -75) locked = false;
        });
    });
});
