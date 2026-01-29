// Universal Spectrum Laboratory Engine v5.0 - Full Spectrum Lab

document.addEventListener('DOMContentLoaded', () => {
    const mainCanvas = document.getElementById('unifiedCanvas');
    const interCanvas = document.getElementById('interactionCanvas'); // Optional, may be null
    if (!mainCanvas) return;

    const ctx = mainCanvas.getContext('2d');
    const iCtx = interCanvas ? interCanvas.getContext('2d') : null;

    const slider = document.getElementById('masterFrequencySlider');
    const freqDisp = document.getElementById('freqDisplay');
    const waveDisp = document.getElementById('waveDisplay');
    const energyDisp = document.getElementById('energyDisplay');
    const regimeDisp = document.getElementById('regimeDisplay');
    const modeTag = document.getElementById('modeTag');
    const physicsLog = document.getElementById('physicsLog');

    const C = 299792458; // Speed of light
    const H = 4.135667696e-15; // Planck constant

    // HUD update
    function updateHUD(f) {
        freqDisp.innerText = f < 1e12 ? (f / 1e9).toFixed(2) + " GHz" : (f / 1e12).toFixed(2) + " THz";

        const lambda = C / f;
        if (lambda >= 0.01) waveDisp.innerText = (lambda * 100).toFixed(2) + " cm";
        else if (lambda >= 1e-6) waveDisp.innerText = (lambda * 1e6).toFixed(2) + " μm";
        else waveDisp.innerText = (lambda * 1e9).toFixed(2) + " nm";

        const energy = H * f;
        energyDisp.innerText = energy < 1e-3 ? (energy * 1e6).toFixed(1) + " μeV" : energy.toFixed(3) + " eV";

        if (f < 3e11) {
            regimeDisp.innerText = "MICROWAVE";
            regimeDisp.style.color = "var(--primary-cyan)";
            modeTag.innerText = "LINK: SATELLITE TO EARTH";
            physicsLog.innerText = "Microwave: LoS, 1-10 Mbps, 12-15 year satellite life.";
        } else if (f < 3e12) {
            regimeDisp.innerText = "THz GAP";
            regimeDisp.style.color = "var(--primary-amber)";
            modeTag.innerText = "LINK: SECURITY SCANNER";
            physicsLog.innerText = "THz: High absorption, used in non-ionizing imaging & scanning.";
        } else {
            regimeDisp.innerText = "INFRARED";
            regimeDisp.style.color = "var(--primary-magenta)";
            modeTag.innerText = "LINK: LOCAL SECURE BEAM";
            physicsLog.innerText = "IR: Short range, walls block transmission, solar interference possible.";
        }
    }

    // ===== Drawing Helpers (Original Lab Features) =====

    function drawSatellite(ctx, x, y, time) {
        ctx.save();
        ctx.translate(x, y + Math.sin(time * 0.5) * 10);

        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-20, -10, 40, 20);

        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(-60, -5, 40, 10);
        ctx.fillRect(20, -5, 40, 10);
        ctx.strokeStyle = '#3b82f6';
        ctx.strokeRect(-60, -5, 40, 10);
        ctx.strokeRect(20, -5, 40, 10);

        ctx.beginPath();
        ctx.arc(0, 15, 15, 0.2, Math.PI - 0.2);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.shadowBlur = 15; ctx.shadowColor = '#3b82f6';
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(0, 30, 2, 0, Math.PI * 2); ctx.fill();

        ctx.restore();
    }

    function drawMountainTower(ctx, w, h) {
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(w - 300, h);
        ctx.lineTo(w - 150, h - 200);
        ctx.lineTo(w, h);
        ctx.fill();

        const tx = w - 150, ty = h - 200;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tx, ty); ctx.lineTo(tx, ty - 60); ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(tx, ty - 65, 10, 0, Math.PI * 2); ctx.fill();
    }

    function drawLivingRoom(ctx, w, h, isBlocked) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, h - 50, w, 50);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(w - 120, h - 200, 20, 150);
        ctx.fillStyle = '#000';
        ctx.fillRect(w - 115, h - 195, 10, 140);

        if (isBlocked) {
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(w / 2 - 10, 50, 20, h - 100);
            ctx.strokeStyle = '#475569';
            ctx.strokeRect(w / 2 - 10, 50, 20, h - 100);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '10px Inter';
            ctx.fillText("OPAQUE WALL", w / 2 - 35, 40);
        }

        ctx.fillStyle = '#334155';
        ctx.fillRect(50, h - 100, 40, 20);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(90, h - 90, 5, 0, Math.PI * 2); ctx.fill();
    }

    // ======== DRAW WAVE SIMULATION (Updated Version) ========

    function drawSimulation(f) {
        const w = mainCanvas.width = mainCanvas.offsetWidth;
        const h = mainCanvas.height = 500;
        ctx.clearRect(0, 0, w, h);

        const time = Date.now() * 0.001;
        const isMW = f < 3e11;
        const isIR = f >= 3e12;

        // Background
        ctx.fillStyle = isMW ? '#020617' : isIR ? '#020617' : '#0c0a09';
        ctx.fillRect(0, 0, w, h);

        // Draw original environment visuals
        if (isMW) {
            drawSatellite(ctx, 150, 100, time);
            drawMountainTower(ctx, w, h);
        } else if (isIR) {
            drawLivingRoom(ctx, w, h, true);
        }

        // Wave drawing
        const startX = isMW ? 150 : 90;
        const startY = isMW ? 130 : h - 90;
        const endX = isMW ? w - 150 : w - 110;
        const endY = isMW ? h - 265 : h - 125;
        const color = isMW ? '#22d3ee' : isIR ? '#f472b6' : '#fbbf24';

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10; ctx.shadowColor = color;
        ctx.beginPath();

        const steps = 200;
        const freqScale = Math.log10(f) - 8.5;

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            let px = startX + (endX - startX) * t;
            let py = startY + (endY - startY) * t;

            const wave = Math.sin(t * 200 * 0.1 * freqScale - time * 10) * 20;
            const angle = Math.atan2(endY - startY, endX - startX) + Math.PI / 2;
            px += Math.cos(angle) * wave;
            py += Math.sin(angle) * wave;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }

        ctx.stroke();
        ctx.restore();
    }

    // ===== Loop =====
    slider.addEventListener('input', (e) => {
        const f = Math.pow(10, parseFloat(e.target.value));
        updateHUD(f);
    });

    function loop() {
        const f = Math.pow(10, parseFloat(slider.value));
        drawSimulation(f);
        requestAnimationFrame(loop);
    }

    updateHUD(Math.pow(10, parseFloat(slider.value)));
    loop();
});
