// Valentine's Interactive Script
document.addEventListener('DOMContentLoaded', () => {
    const outputText = document.getElementById('output-text');
    const valentineMessage = document.getElementById('valentine-message');
    const responseText = document.getElementById('response-text');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    // Typing animation text
    const bootSequence = `
Initializing Valentine Protocol...
[████████████████████████████████] 100%

Loading emotional_core.dat.............. OK
Loading heart_module.sys................. OK
Loading cupid_algorithm.exe.............. OK

Scanning for compatible valentine...
> Target detected!
> Initiating connection sequence...
> Preparing special message...

System Ready.
=====================================
`;

    let charIndex = 0;
    let isTyping = true;

    // Typing effect
    function typeText() {
        if (charIndex < bootSequence.length) {
            outputText.textContent = bootSequence.substring(0, charIndex + 1);
            charIndex++;

            // Variable speed for more realistic typing
            const delay = bootSequence[charIndex] === '\n' ? 100 : Math.random() * 30 + 20;
            setTimeout(typeText, delay);
        } else {
            isTyping = false;
            outputText.classList.remove('typing-output');

            // Show valentine message after typing completes
            setTimeout(() => {
                showValentineMessage();
            }, 500);
        }
    }

    // Show the valentine question
    function showValentineMessage() {
        valentineMessage.classList.remove('hidden');
        valentineMessage.style.animation = 'fadeInScale 0.8s ease-out';

        // Emphasize heart in matrix background
        if (window.matrixRain) {
            matrixRain.emphasizeHeart();
        }
    }

    // Handle YES button click
    yesBtn.addEventListener('click', () => {
        handleResponse('yes');
    });

    // Handle NO button click (with fun interaction)
    let noClickCount = 0;
    noBtn.addEventListener('click', (e) => {
        noClickCount++;

        if (noClickCount === 1) {
            noBtn.querySelector('.btn-text').textContent = 'ARE YOU SURE?';
            shakeElement(noBtn);
        } else if (noClickCount === 2) {
            noBtn.querySelector('.btn-text').textContent = 'REALLY?';
            noBtn.style.transform = `scale(${0.9 - noClickCount * 0.1})`;
            shakeElement(noBtn);
        } else if (noClickCount === 3) {
            noBtn.querySelector('.btn-text').textContent = 'THINK AGAIN...';
            noBtn.style.transform = `scale(${0.9 - noClickCount * 0.1})`;
            moveButtonRandomly(noBtn);
        } else {
            // Button runs away
            moveButtonRandomly(noBtn);
            setTimeout(() => {
                noBtn.style.transform = `scale(${Math.max(0.3, 0.9 - noClickCount * 0.05)})`;
            }, 300);
        }
    });

    // Handle response
    function handleResponse(answer) {
        valentineMessage.classList.add('hidden');

        let message = '';
        let celebration = '';

        if (answer === 'yes') {
            message = `
╔════════════════════════════════════════╗
║                                        ║
║   💚 BEST DECISION EVER! 💚            ║
║                                        ║
║   You just made me the happiest        ║
║   person in the world! ✨              ║
║                                        ║
║   Happy Valentine's Day! 💕            ║
║                                        ║
╚════════════════════════════════════════╝

Deploying happiness.exe...
> Spreading joy to all systems...
> ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥

STATUS: LOVE OVERFLOW! 💚💚💚
`;
            celebration = 'yes';
            createHeartExplosion();
        } else {
            message = `
╔════════════════════════════════════════╗
║                                        ║
║   Maybe next time? 💚                  ║
║                                        ║
║   (But the YES button is still here    ║
║    if you change your mind... 😊)      ║
║                                        ║
╚════════════════════════════════════════╝
`;
        }

        responseText.textContent = message;
        responseText.classList.remove('hidden');

        // Trigger special celebration for YES
        if (celebration === 'yes') {
            triggerCelebration();
        }
    }

    // Shake animation
    function shakeElement(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'shake 0.5s';
        }, 10);
    }

    // Move button randomly
    function moveButtonRandomly(button) {
        const container = button.parentElement;
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        const maxX = containerRect.width - buttonRect.width;
        const maxY = containerRect.height - buttonRect.height;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        button.style.position = 'absolute';
        button.style.left = randomX + 'px';
        button.style.top = randomY + 'px';
        button.style.transition = 'all 0.3s ease-out';
    }

    // Create heart explosion effect
    function createHeartExplosion() {
        const container = document.querySelector('.container');

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '💚';
                heart.style.position = 'fixed';
                heart.style.left = '50%';
                heart.style.top = '50%';
                heart.style.fontSize = Math.random() * 30 + 20 + 'px';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '9999';
                heart.style.animation = `heartFloat ${Math.random() * 2 + 2}s ease-out forwards`;

                const angle = (Math.PI * 2 * i) / 30;
                const velocity = Math.random() * 200 + 100;

                heart.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
                heart.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');

                document.body.appendChild(heart);

                setTimeout(() => {
                    heart.remove();
                }, 4000);
            }, i * 50);
        }
    }

    // Celebration effect
    function triggerCelebration() {
        // Make matrix rain more intense
        if (window.matrixRain) {
            matrixRain.emphasizeHeart();
        }

        // Add glitch effect to terminal
        const terminal = document.querySelector('.terminal-window');
        terminal.style.animation = 'terminalGlitch 0.3s infinite';

        setTimeout(() => {
            terminal.style.animation = '';
        }, 2000);
    }

    // Start the typing animation
    setTimeout(() => {
        typeText();
    }, 500);
});

// Additional CSS animations injected via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-10px) rotate(-5deg); }
        75% { transform: translateX(10px) rotate(5deg); }
    }

    @keyframes heartFloat {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
            opacity: 0;
        }
    }

    @keyframes terminalGlitch {
        0%, 100% { transform: translate(0); }
        25% { transform: translate(-2px, 2px); filter: hue-rotate(0deg);}
        50% { transform: translate(2px, -2px); filter: hue-rotate(90deg);}
        75% { transform: translate(-2px, -2px); filter: hue-rotate(180deg);}
    }
`;
document.head.appendChild(style);
