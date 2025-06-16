document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION & ELEMENTS ---
    const centralWen = document.getElementById('central-Wen');
    const bubbleContainer = document.getElementById('bubble-container');
    const centralWenRect = centralWen.getBoundingClientRect();
    const BUBBLE_COUNT = 10;
    // BUBBLE_SPEED is now a base multiplier, not a constant speed

    const statements = [
        "Wen Did I Jeet", "Wen Did I Sell", "Wen Did I Buy The Top", "Wen Did I Ape In",
        "Wen Didn't I Ape In", "Wen Is It Pumping", "Wen Is It Dumping", "Wen The Pizza",
        "Wen The Rug Pull", "Wen Is Gas So High", "Wen Did My Tx Fail", "Wen Am I Still Poor",
        "Wen No Lambo", "Wen Did I Listen To CT", "Wen Didn't I Buy More", "Wen Is It Crabbing",
        "Wen No Volume", "Wen Did The Dev Go Silent", "Wen Was The LP Pulled", "Wen Did I Paperhand",
        "Wen Did I Diamondhand", "Wen Is My Wallet Drained", "Wen Did I Click The Link", "Wen Did He Block Me",
        "Wen Is The Chart Ugly", "Wen Another Green Dildo", "Wen Another Red Dildo", "Wen Didn't I Take Profit",
        "Wen Did I Go All In", "Wen Did I FOMO", "Wen Is The Floor So Thin", "Wen Did I Fat Finger",
        "Wen Did The Buy Bot Stop", "Wen Did SBF Lie", "Wen Did I Trust The Influencer", "Wen Did I Buy This Dip",
        "Wen Didn't It Bounce", "Wen Did I Get Liquidated", "Wen Use 100x Leverage", "Wen Did I Tell My Wife",
        "Wen Is Everyone Rich But Me", "Wen Was The Telegram Deleted", "Wen The Dog With A Hat",
        "Wen Did My Stop Loss Hit", "Wen No Parabolic Run", "Wen Did I Fall For It Again",
        "Wen Is This So Addictive", "Wen Is It Always China Wake Up", "Wen Didn't I Bridge Sooner",
        "Wen Is My Portfolio All Red"
    ];

    const statementsWithQuestionMarks = statements.map(s => s + '?');
    let availableStatements = [...statementsWithQuestionMarks];
    let activeBubbles = [];

    // --- HELPER FUNCTIONS ---

    function getUniqueStatement() {
        if (availableStatements.length === 0) availableStatements = [...statementsWithQuestionMarks];
        const index = Math.floor(Math.random() * availableStatements.length);
        return availableStatements.splice(index, 1)[0];
    }

    function getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    // --- BUBBLE CREATION ---

    function createBubble(isInitial = false) {
        const statement = getUniqueStatement();
        const element = document.createElement('div');
        element.classList.add('bubble');
        element.textContent = statement;

        // NEW: Natural Look #3 - Start transparent for fade-in effect
        element.style.opacity = '0';
        bubbleContainer.appendChild(element);

        // NEW: Natural Look #1 - Varying sizes
        const radius = Math.random() * 60 + 60; // Sizes between 40px and 100px radius
        element.style.width = `${radius * 2}px`;
        element.style.height = `${radius * 2}px`;

        // NEW: Natural Look #1 - Varying speeds (smaller bubbles are faster)
        const speed = (1 - (radius - 40) / 60) * 0.5 + 0.2; // Speed between 0.2 and 0.7
        const angle = Math.random() * 2 * Math.PI;
        
        const bubble = {
            element, text: statement, radius, speed,
            x: isInitial ? Math.random() * window.innerWidth : window.innerWidth / 2,
            y: isInitial ? Math.random() * window.innerHeight : window.innerHeight / 2,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            opacity: 0, // For programmatic fade-in
            fadingOut: false
        };

        // RE-ENABLED: Prevent initial bubbles from spawning on the central text
        if (isInitial) {
             while (getDistance(bubble.x, bubble.y, centralWenRect.left + centralWenRect.width/2, centralWenRect.top + centralWenRect.height/2) < bubble.radius + centralWenRect.width/2 + 20) {
                 bubble.x = Math.random() * window.innerWidth;
                 bubble.y = Math.random() * window.innerHeight;
             }
        }
        
        activeBubbles.push(bubble);
    }

    function resolveCollision(p1, p2) {
        const xVelocityDiff = p1.dx - p2.dx;
        const yVelocityDiff = p1.dy - p2.dy;
        const xDist = p2.x - p1.x;
        const yDist = p2.y - p1.y;

        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
            const angle = -Math.atan2(yDist, xDist);
            const m1 = p1.radius; const m2 = p2.radius; // Mass based on radius

            const u1 = { x: p1.dx * Math.cos(angle) - p1.dy * Math.sin(angle), y: p1.dx * Math.sin(angle) + p1.dy * Math.cos(angle) };
            const u2 = { x: p2.dx * Math.cos(angle) - p2.dy * Math.sin(angle), y: p2.dx * Math.sin(angle) + p2.dy * Math.cos(angle) };

            const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
            const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };

            p1.dx = v1.x * Math.cos(-angle) - v1.y * Math.sin(-angle);
            p1.dy = v1.x * Math.sin(-angle) + v1.y * Math.cos(-angle);
            p2.dx = v2.x * Math.cos(-angle) - v2.y * Math.sin(-angle);
            p2.dy = v2.x * Math.sin(-angle) + v2.y * Math.cos(-angle);
        }
    }


    // --- PHYSICS & ANIMATION LOOP ---

    function update() {
        activeBubbles.forEach((bubble, i) => {
            if (bubble.fadingOut) return;

            // NEW: Natural Look #3 - Gently fade in new bubbles
            if (bubble.opacity < 1) {
                bubble.opacity += 0.02;
                bubble.element.style.opacity = bubble.opacity;
            }

            // NEW: Natural Look #2 - Organic Drift Motion
            bubble.dx += (Math.random() - 0.5) * 0.01;
            bubble.dy += (Math.random() - 0.5) * 0.01;
            
            // Normalize speed to prevent drift from making it too fast
            const currentSpeed = Math.sqrt(bubble.dx * bubble.dx + bubble.dy * bubble.dy);
            if (currentSpeed > bubble.speed) {
                bubble.dx = (bubble.dx / currentSpeed) * bubble.speed;
                bubble.dy = (bubble.dy / currentSpeed) * bubble.speed;
            }

            bubble.x += bubble.dx;
            bubble.y += bubble.dy;

            if (bubble.x - bubble.radius < 0) { bubble.dx *= -1; bubble.x = bubble.radius; } 
            else if (bubble.x + bubble.radius > window.innerWidth) { bubble.dx *= -1; bubble.x = window.innerWidth - bubble.radius; }
            if (bubble.y - bubble.radius < 0) { bubble.dy *= -1; bubble.y = bubble.radius; } 
            else if (bubble.y + bubble.radius > window.innerHeight) { bubble.dy *= -1; bubble.y = window.innerHeight - bubble.radius; }

            for (let j = i + 1; j < activeBubbles.length; j++) {
                const otherBubble = activeBubbles[j];
                const distance = getDistance(bubble.x, bubble.y, otherBubble.x, otherBubble.y);
                const minDistance = bubble.radius + otherBubble.radius;
                if (distance < minDistance) {
                    const angle = Math.atan2(bubble.y - otherBubble.y, bubble.x - otherBubble.x);
                    const overlap = (minDistance - distance);
                    bubble.x += Math.cos(angle) * overlap / 2;
                    bubble.y += Math.sin(angle) * overlap / 2;
                    otherBubble.x -= Math.cos(angle) * overlap / 2;
                    otherBubble.y -= Math.sin(angle) * overlap / 2;
                    resolveCollision(bubble, otherBubble);
                }
            }

            // RE-ENABLED: Collision with the central "$Wen?" text
            const distWen = getDistance(bubble.x, bubble.y, centralWenRect.left + centralWenRect.width / 2, centralWenRect.top + centralWenRect.height / 2);
            if (distWen < bubble.radius + centralWenRect.width / 2) {
                 const angle = Math.atan2(bubble.y - (centralWenRect.top + centralWenRect.height / 2), bubble.x - (centralWenRect.left + centralWenRect.width / 2));
                 bubble.dx = Math.cos(angle) * bubble.speed;
                 bubble.dy = Math.sin(angle) * bubble.speed;
                 const overlap = (bubble.radius + centralWenRect.width / 2) - distWen;
                 bubble.x += Math.cos(angle) * overlap;
                 bubble.y += Math.sin(angle) * overlap;
            }
            
            bubble.element.style.left = `${bubble.x}px`;
            bubble.element.style.top = `${bubble.y}px`;
        });
        requestAnimationFrame(update);
    }

    // --- EVENT HANDLERS & INITIALIZATION ---

    centralWen.addEventListener('click', () => {
        document.querySelector("#info").style.display = "none";
        if (activeBubbles.length > 0) {
            const indexToRemove = Math.floor(Math.random() * activeBubbles.length);
            const bubbleToRemove = activeBubbles[indexToRemove];
            
            if (!bubbleToRemove.fadingOut) {
                bubbleToRemove.fadingOut = true;
                bubbleToRemove.element.style.opacity = '0';
                bubbleToRemove.element.style.transform += ' scale(0.5)';
                
                setTimeout(() => {
                    if (bubbleContainer.contains(bubbleToRemove.element)) bubbleContainer.removeChild(bubbleToRemove.element);
                    const stillActiveIndex = activeBubbles.findIndex(b => b === bubbleToRemove);
                    if (stillActiveIndex > -1) activeBubbles.splice(stillActiveIndex, 1);
                }, 500);
            }
        }
        setTimeout(() => createBubble(), 100);
    });
    
    const caContainer = document.getElementById('ca-container');
    const caText = document.getElementById('ca-text');
    const tooltip = document.getElementById('copy-tooltip');
    const contractAddress = "nsrsZP383CGbSh5Rhux2S6epv81R9xE77oMTHd4pump"; // <-- IMPORTANT: REPLACE THIS

    caText.textContent = contractAddress;

    caContainer.addEventListener('click', () => {
        navigator.clipboard.writeText(contractAddress).then(() => {
            tooltip.classList.add('visible');
            setTimeout(() => tooltip.classList.remove('visible'), 2000);
        }).catch(err => console.error('Failed to copy text: ', err));
    });

    // --- START EVERYTHING ---
    for (let i = 0; i < BUBBLE_COUNT; i++) {
        createBubble(true);
    }
    update();
});
