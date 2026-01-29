WaveLab | Interactive Virtual Wave Laboratory

WaveLab is a professional-grade, interactive educational platform for exploring unguided transmission media, specifically focusing on Microwaves and Infrared signals. It bridges theory and practical visualization to help learners understand wave propagation, network effects, and real-world applications.

🚀 Key Features

Universal Spectrum Lab: Sweep frequencies from 1 GHz (Microwaves) up to 400 THz (Infrared) with real-time visual feedback.

Interactive Link Modes:

Terrestrial Microwave: Line-of-sight, moderate path loss, short to medium distance.

Satellite Microwave: Long-range coverage, high path loss, low interference.

Infrared: Short-range indoor, secure, high-bandwidth communication.

Spectrum HUD: Live telemetry data including:

Frequency ($f$)

Wavelength ($\lambda$)

Photon Energy ($E$)

Wave Regime (Microwave / Infrared)

Computer Networks Metrics Panel: Real-time metrics for:

Path Loss

Propagation Delay

Noise Level

Bandwidth

Dynamic Canvas Visualization: High-frequency signal rendering for each link type using HTML5 Canvas.

Comprehensive Theory Section: Detailed specifications of terrestrial and satellite microwave systems and IR behavior.

Interactive Assessment: 10-question quiz with immediate feedback, scoring, and performance evaluation.

🛠️ Technology Stack

Structure: Semantic HTML5

Design: Vanilla CSS3 (Glassmorphism, CRT effects, custom variables)

Logic: JavaScript ES6+

Graphics: HTML5 Canvas API for signal propagation animation

📂 Project Structure
├── css/
│   └── style.css            # Core design system and animations
├── js/
│   ├── spectrum-lab.js      # Unified simulation logic
│   ├── microwave-sim.js     # Microwave link dynamics
│   ├── infrared-sim.js      # Infrared link dynamics
│   └── quiz.js              # Assessment engine
├── index.html               # Lab gateway / homepage
├── theory.html              # Engineering knowledge base
├── experiments.html         # Interactive DIY Lab
├── applications.html        # Real-world use cases
└── quiz.html                # Assessment interface

🚥 Getting Started

Clone or download the repository.

Open index.html in any modern browser (no build tools required).

Explore the Engineering Lab to generate signals, switch link modes, and observe physical interactions.

Test your knowledge in the Quiz section with instant feedback.

🧪 Simulation Physics

The lab uses realistic physics formulas for its visualizations:

Wavelength: λ=fc​

where 
𝑐
=
3
×
10
8
 
m/s
c=3×10
8
m/s and 
𝑓
f is the frequency in Hz.

Created with ♥ for DIY Learners | © 2026 WaveLab Aerospace
