// ===============================
// Network Propagation Simulator
// Universal Spectrum Lab v9.0 (Educational Edition)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("unifiedCanvas");
    const ctx = canvas.getContext("2d");

    const slider = document.getElementById("masterFrequencySlider");
    const freqDisp = document.getElementById("freqDisplay");
    const waveDisp = document.getElementById("waveDisplay");
    const energyDisp = document.getElementById("energyDisplay");
    const regimeDisp = document.getElementById("regimeDisplay");
    const physicsLog = document.getElementById("physicsLog");
    const modeTag = document.getElementById("modeTag");

    const insightTitle = document.getElementById("insightTitle");
    const insightText = document.getElementById("insightText");
    const conceptFormula = document.getElementById("conceptFormula");

    // Physical constants
    const C = 299792458;         // Speed of light (m/s)
    const H = 4.135667696e-15;   // Planck constant (eV·s)

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = 500;
    }
    resize();
    window.addEventListener("resize", resize);

    // World objects
    const tx = { x: 100, y: 250 };
    const rx = { x: canvas.width - 100, y: 250 };

    let obstacle = { x: 450, y: 180, w: 60, h: 140 };

    // Drag obstacle
    let dragging = false;
    canvas.addEventListener("mousedown", (e) => {
        const r = canvas.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        if (mx > obstacle.x && mx < obstacle.x + obstacle.w && my > obstacle.y && my < obstacle.y + obstacle.h) {
            dragging = true;
        }
    });
    canvas.addEventListener("mouseup", () => dragging = false);
    canvas.addEventListener("mouseleave", () => dragging = false);
    canvas.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const r = canvas.getBoundingClientRect();
        obstacle.x = e.clientX - r.left - obstacle.w / 2;
        obstacle.y = e.clientY - r.top - obstacle.h / 2;
    });

    // Signal packets
    let packets = [];

    function spawnPacket() {
        packets.push({
            x: tx.x,
            y: tx.y,
            power: 1,
            dy: (Math.random() - 0.5) * 0.6  // for diffraction effect
        });
    }
    setInterval(spawnPacket, 100);

    function intersects(obs, x, y) {
        return x > obs.x && x < obs.x + obs.w && y > obs.y && y < obs.y + obs.h;
    }

    // ===============================
    // Frequency Band Classification
    // ===============================
    function getMode(f) {
        if (f < 30e9) return "MICROWAVE (TERRESTRIAL)";
        if (f < 300e9) return "MICROWAVE (SATELLITE)";
        return "INFRARED / OPTICAL";
    }

    // ===============================
    // Update HUD + Explanation Panel
    // ===============================
    function updateHUD(f) {
        // Frequency display
        if (f < 1e12) freqDisp.innerText = (f / 1e9).toFixed(2) + " GHz";
        else freqDisp.innerText = (f / 1e12).toFixed(2) + " THz";

        // Wavelength display
        const lambda = C / f;
        if (lambda > 0.01) waveDisp.innerText = (lambda * 100).toFixed(2) + " cm";
        else if (lambda > 1e-6) waveDisp.innerText = (lambda * 1e6).toFixed(2) + " μm";
        else waveDisp.innerText = (lambda * 1e9).toFixed(2) + " nm";

        // Energy display
        const energy = H * f;
        energyDisp.innerText = (energy < 1e-3) ? (energy * 1e6).toFixed(2) + " μeV" : energy.toFixed(3) + " eV";

        const mode = getMode(f);
        regimeDisp.innerText = mode;
        modeTag.innerText = "LINK MODE: " + mode;

        // Explanation switch
        if (mode.includes("TERRESTRIAL")) {
            physicsLog.innerText = "Low-frequency microwaves diffract around obstacles and partially penetrate buildings.";
            insightTitle.innerText = "Terrestrial Microwave Communication";
            insightText.innerText = "Because wavelength is comparable to buildings, waves bend (diffraction) and scatter.";
            conceptFormula.innerText = "λ = c / f";

        } else if (mode.includes("SATELLITE")) {
            physicsLog.innerText = "Higher microwave frequencies travel mostly in straight lines and require line-of-sight.";
            insightTitle.innerText = "Satellite Microwave Communication";
            insightText.innerText = "Less diffraction, more directional. Small obstacles are ignored but big ones block.";
            conceptFormula.innerText = "Free Space Path Loss ∝ f²";

        } else {
            physicsLog.innerText = "Infrared behaves like light: strict line-of-sight. Any obstacle fully blocks it.";
            insightTitle.innerText = "Infrared / Optical Communication";
            insightText.innerText = "Very small wavelength, no diffraction. Works like laser or optical fiber.";
            conceptFormula.innerText = "E = h f";
        }
    }

    // ===============================
    // Physics Simulation
    // ===============================
    function updatePackets(f) {
        const mode = getMode(f);
        const speed = 7;

        packets.forEach(p => {
            p.x += speed;

            // Diffraction effect only for low-frequency microwaves
            if (mode.includes("TERRESTRIAL")) p.y += p.dy;

            if (intersects(obstacle, p.x, p.y)) {
                if (mode.includes("INFRARED")) {
                    p.power = 0; // complete blockage
                } else if (mode.includes("SATELLITE")) {
                    // mostly ignores small obstacle
                    p.power *= 0.95;
                } else {
                    // TERRESTRIAL MICROWAVE: attenuate + bend
                    p.power *= 0.6;
                    p.y += (Math.random() - 0.5) * 15;
                }
            }
        });

        packets = packets.filter(p => p.power > 0 && p.x < canvas.width);
    }

    // ===============================
    // Drawing
    // ===============================
    function drawWorld(f) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // TX
        ctx.fillStyle = "#22d3ee";
        ctx.beginPath();
        ctx.arc(tx.x, tx.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText("TX", tx.x - 10, tx.y - 20);

        // RX
        ctx.fillStyle = "#f472b6";
        ctx.beginPath();
        ctx.arc(rx.x, rx.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText("RX", rx.x - 10, rx.y - 20);

        // Obstacle
        ctx.fillStyle = "#334155";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        ctx.fillStyle = "#fff";
        ctx.fillText("Obstacle", obstacle.x - 10, obstacle.y - 10);

        // Packets
        packets.forEach(p => {
            ctx.fillStyle = `rgba(34,211,238,${p.power})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Received power
        const received = packets.filter(p => Math.abs(p.x - rx.x) < 10).length;
        ctx.fillStyle = "#fff";
        ctx.fillText("Received Signal Packets: " + received, 20, 30);
    }

    // ===============================
    // Preset Buttons
    // ===============================
    window.setLinkMode = function (mode) {
        if (mode === "terrestrial") slider.value = Math.log10(10e9);
        if (mode === "satellite") slider.value = Math.log10(100e9);
        if (mode === "infrared") slider.value = Math.log10(400e12);
    }

    // ===============================
    // Main Loop
    // ===============================
    function loop() {
        const f = Math.pow(10, parseFloat(slider.value));
        updateHUD(f);
        updatePackets(f);
        drawWorld(f);
        requestAnimationFrame(loop);
    }

    loop();
});
