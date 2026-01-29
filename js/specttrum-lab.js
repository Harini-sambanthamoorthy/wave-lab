// ===============================
// Spectrum Lab JS - v1.0
// Enhanced Wave & Communication Simulator
// ===============================

class Wave {
    constructor(x, y, frequency, color, type) {
        this.x = x;
        this.y = y;
        this.frequency = frequency;
        this.color = color;
        this.type = type; // "Tower-Tower", "Satellite-Tower", "Device-Device"
        this.radius = 0;
    }

    propagate() {
        // Propagation speed affected by frequency
        this.radius += 0.5 + this.frequency * 0.1;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Obstacle {
    constructor(x, y, width, height, attenuation = 0.5) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.attenuation = attenuation; // reduces wave radius
    }

    draw(ctx) {
        ctx.fillStyle = "rgba(200,0,0,0.5)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    interact(wave) {
        // simple collision check
        const dx = wave.x - Math.max(this.x, Math.min(wave.x, this.x + this.width));
        const dy = wave.y - Math.max(this.y, Math.min(wave.y, this.y + this.height));
        if (dx * dx + dy * dy < wave.radius * wave.radius) {
            wave.radius *= this.attenuation; // reduce propagation
        }
    }
}

class SpectrumLab {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.waves = [];
        this.obstacles = [];
        this.frequency = 1;
        this.scenarioColors = {
            "Tower-Tower": "blue",
            "Satellite-Tower": "green",
            "Device-Device": "orange"
        };
        this.scenario = "Tower-Tower";
        this.init();
    }

    init() {
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    addWave(x, y) {
        const wave = new Wave(
            x, 
            y, 
            this.frequency, 
            this.scenarioColors[this.scenario], 
            this.scenario
        );
        this.waves.push(wave);
    }

    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
    }

    setFrequency(f) {
        this.frequency = f;
    }

    setScenario(scenario) {
        if (this.scenarioColors[scenario]) {
            this.scenario = scenario;
        }
    }

    animate() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw obstacles
        this.obstacles.forEach(ob => ob.draw(ctx));

        // Update and draw waves
        this.waves.forEach(wave => {
            wave.propagate();
            this.obstacles.forEach(ob => ob.interact(wave));
            wave.draw(ctx);
        });

        requestAnimationFrame(this.animate);
    }
}

// Make SpectrumLab globally accessible
window.SpectrumLab = SpectrumLab;
window.Wave = Wave;
window.Obstacle = Obstacle;
