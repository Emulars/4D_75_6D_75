// Matrix Rain Effect with Heart Shape Formation
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Matrix characters - including binary, hexadecimal, and special chars
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]()♥';
        this.fontSize = 14;
        this.columns = Math.floor(this.canvas.width / this.fontSize);

        // Initialize drops
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = {
                y: Math.random() * -100,
                speed: Math.random() * 0.5 + 0.3,
                chars: []
            };
        }

        // Heart shape parameters
        this.heartCenter = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
        this.heartSize = Math.min(this.canvas.width, this.canvas.height) * 0.25;
        this.heartIntensity = 0;
        this.heartPulse = 0;

        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.heartCenter = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
        this.heartSize = Math.min(this.canvas.width, this.canvas.height) * 0.25;
    }

    // Heart shape formula (parametric)
    isInHeart(x, y) {
        const cx = this.heartCenter.x;
        const cy = this.heartCenter.y;

        // Translate to heart center
        const dx = (x - cx) / this.heartSize;
        const dy = -(y - cy) / this.heartSize;

        // Heart equation: (x^2 + y^2 - 1)^3 - x^2 * y^3 = 0
        const equation = Math.pow(dx * dx + dy * dy - 1, 3) - dx * dx * Math.pow(dy, 3);

        // Add some thickness and pulsing effect
        const pulse = Math.sin(this.heartPulse) * 0.1;
        return equation < 0.1 + pulse;
    }

    getHeartIntensity(x, y) {
        if (!this.isInHeart(x, y)) return 0;

        const cx = this.heartCenter.x;
        const cy = this.heartCenter.y;
        const distance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        const maxDistance = this.heartSize * 2;

        // Intensity based on distance from center
        return 1 - (distance / maxDistance);
    }

    draw() {
        // Semi-transparent black to create trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update heart pulse
        this.heartPulse += 0.05;

        // Draw falling characters
        for (let i = 0; i < this.drops.length; i++) {
            const x = i * this.fontSize;
            const drop = this.drops[i];

            // Get character for this position
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];

            // Check if position is in heart
            const heartIntensity = this.getHeartIntensity(x, drop.y);

            // Calculate color based on heart position and intensity
            let opacity = 1;
            let color = '#00ff00';

            if (heartIntensity > 0) {
                // Inside heart - brighter green with glow
                const brightness = Math.floor(200 + heartIntensity * 55);
                opacity = 0.8 + heartIntensity * 0.2;
                color = `rgb(0, ${brightness}, 0)`;

                // Add glow effect for heart
                this.ctx.shadowBlur = 10 + heartIntensity * 20;
                this.ctx.shadowColor = color;
            } else {
                // Outside heart - normal matrix rain
                const brightness = Math.floor(150 + Math.random() * 100);
                opacity = 0.5 + Math.random() * 0.3;
                color = `rgb(0, ${brightness}, 0)`;
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = color;
            }

            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = opacity;
            this.ctx.font = `${this.fontSize}px monospace`;
            this.ctx.fillText(char, x, drop.y);

            // Reset shadow
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;

            // Move drop down
            drop.y += drop.speed * this.fontSize;

            // Slow down drops in heart area for better visibility
            if (heartIntensity > 0) {
                drop.y += (1 - heartIntensity) * drop.speed * this.fontSize;
            }

            // Reset drop to top when it reaches bottom
            if (drop.y > this.canvas.height) {
                drop.y = Math.random() * -100;
                drop.speed = Math.random() * 0.5 + 0.3;
            }
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    // Increase heart visibility (called after user interaction)
    emphasizeHeart() {
        this.heartIntensity = 1;

        // Add more drops for denser effect
        if (this.drops.length < this.columns * 1.5) {
            for (let i = this.columns; i < this.columns * 1.5; i++) {
                this.drops[i] = {
                    y: Math.random() * -100,
                    speed: Math.random() * 0.5 + 0.3,
                    chars: []
                };
            }
        }
    }
}

// Initialize Matrix Rain when DOM is loaded
let matrixRain;
document.addEventListener('DOMContentLoaded', () => {
    matrixRain = new MatrixRain();
});
