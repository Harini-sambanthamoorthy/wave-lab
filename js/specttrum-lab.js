// Universal Spectrum Laboratory Engine v5.0 - Minimalist Spectrum Simulation
document.addEventListener('DOMContentLoaded', () => {
    const mainCanvas = document.getElementById('unifiedCanvas');
    const interCanvas = document.getElementById('interactionCanvas');
    if (!mainCanvas || !interCanvas) return;

    const ctx = mainCanvas.getContext('2d');
    const iCtx = interCanvas.getContext('2d');

    const slider = document.getElementById('masterFrequencySlider');
    const freqDisp = document.getElementById('freqDisplay');
    const waveDisp = document.getElementById('waveDisplay');
    const energyDisp = document.getElementById('energyDisplay');
    const regimeDisp = document.getElementById('regimeDisplay');
    const modeTag = document.getElementById('modeTag');
    const physicsLog = document.getElementById('physicsLog');

    const C = 299792458;
    const H = 4.135667696e-15;

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
            modeTag.innerText = "Wave Propagation";
            physicsLog.innerText = "Microwave: straight line propagation, simple demonstration.";
        } else if (f < 3e12) {
            regimeDisp.innerText = "THz GAP";
            regimeDisp.style.color = "var(--primary-amber)";
            modeTag.innerText = "Wave Propagation";
            physicsLog.innerText = "THz: straight line propagation, simple demonstration.";
        } else {
            regimeDisp.innerText = "INFRARED";
            regimeDisp.style.color = "var(--primary-magenta)";
            modeTag.innerText = "Wave Propagation";
            physicsLog.innerText = "Infrared: straight line propagation, simple demonstration.";
        }
    }

    // Minimalist wave drawing
    function drawSimulation(f) {
        const w = mainCanvas.width = mainCanvas.offsetWidth;
        const h = mainCanvas.height = 300;
        ctx.clearRect(0, 0, w, h);

        const time = Date.now() * 0.002;
        const steps = 200;

        // Determine wave color by regime
        const color = f < 3e11 ? '#22d3ee' : f < 3e12 ? '#fbbf24' : '#f472b6';

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10; ctx.shadowColor = color;

        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const px = t * w;
            const py = h / 2 + Math.sin(t * 20 * Math.log10(f) - time * 10) * 40;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
    }

    // Interaction simulation (moving dots)
    function drawInteractionSimulation(f) {
        const w = interCanvas.width = interCanvas.offsetWidth;
        const h = interCanvas.height = 150;
        iCtx.clearRect(0, 0, w, h);
        iCtx.fillStyle = '#020617';
        iCtx.fillRect(0, 0, w, h);

        const time = Date.now() * 0.005;

        const color = f < 3e11 ? '#22d3ee' : f < 3e12 ? '#fbbf24' : '#f472b6';
        iCtx.fillStyle = color;

        for (let i = 0; i < 10; i++) {
            const x = (i * 60 + time * 50) % w;
            const y = h / 2 + Math.sin(time + i) * 20;
            iCtx.beginPath(); iCtx.arc(x, y, 5, 0, Math.PI * 2); iCtx.fill();
        }
    }

    slider.addEventListener('input', (e) => {
        const f = Math.pow(10, parseFloat(e.target.value));
        updateHUD(f);
    });

    function loop() {
        const f = Math.pow(10, parseFloat(slider.value));
        drawSimulation(f);
        drawInteractionSimulation(f);
        requestAnimationFrame(loop);
    }

    updateHUD(Math.pow(10, parseFloat(slider.value)));
    loop();
});
