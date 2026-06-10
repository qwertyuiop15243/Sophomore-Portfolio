const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

let starsArray = [];
let spaceObjectsArray = []; 
const numStars = 150;
const numObjects = 70; // High object count for a dense cosmic background

const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Star blueprint
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseRadius = Math.random() * 1.5 + 0.5;
        this.radius = this.baseRadius;
        this.twinkleSpeed = Math.random() * 0.05 + 0.01;
        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        this.angle += this.twinkleSpeed;
        this.radius = this.baseRadius + Math.sin(this.angle) * 0.5;

        const dx = (mouse.x - canvas.width / 2) * 0.03;
        const dy = (mouse.y - canvas.height / 2) * 0.03;
        
        this.currentX = this.x - dx;
        this.currentY = this.y - dy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.currentX, this.currentY, Math.abs(this.radius), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(235, 245, 255, 0.9)';
        ctx.fill();
    }
}

// Advanced Space Object Blueprint
class SpaceObject {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // 4% chance for a black hole, otherwise random from the rest
        const spawnChance = Math.random();
        if (spawnChance < 0.04) {
            this.type = 'blackhole';
        } else {
            const types = ['nebula', 'planet', 'asteroid', 'galaxy', 'comet'];
            this.type = types[Math.floor(Math.random() * types.length)];
        }

        this.initTypeAttributes();
    }

    initTypeAttributes() {
        if (this.type === 'nebula') {
            this.radius = Math.random() * 50 + 40; 
            this.speedX = (Math.random() - 0.5) * 0.05; 
            this.speedY = (Math.random() - 0.5) * 0.05;
            this.parallaxFactor = 0.01;
            
            // Generate multiple overlapping clouds for a gas effect
            this.clouds = [];
            const numClouds = Math.floor(Math.random() * 3) + 3;
            for(let i = 0; i < numClouds; i++) {
                const r = Math.floor(Math.random() * 50);
                const g = Math.floor(Math.random() * 150 + 50);
                const b = Math.floor(Math.random() * 155 + 100);
                this.clouds.push({
                    dx: (Math.random() - 0.5) * this.radius,
                    dy: (Math.random() - 0.5) * this.radius,
                    size: this.radius * (0.5 + Math.random()),
                    color: `rgba(${r}, ${g}, ${b}, 0.04)`
                });
            }
        } else if (this.type === 'planet') {
            this.radius = Math.random() * 12 + 8; 
            this.speedX = (Math.random() - 0.5) * 0.15;
            this.speedY = (Math.random() - 0.5) * 0.15;
            this.parallaxFactor = 0.02;
            this.hasRing = Math.random() > 0.6; // Only some planets have rings
            this.tilt = (Math.random() - 0.5) * 0.5;
            
            // Pick a random planet hue (blue, red, or purple/gray)
            const hues = [
                { base: 'rgba(50, 100, 200, 1)', shadow: 'rgba(10, 20, 50, 1)' }, // Blue/Water
                { base: 'rgba(200, 80, 50, 1)', shadow: 'rgba(50, 15, 10, 1)' },  // Mars/Red
                { base: 'rgba(120, 100, 180, 1)', shadow: 'rgba(30, 20, 50, 1)' } // Purple/Gas
            ];
            this.colors = hues[Math.floor(Math.random() * hues.length)];

        } else if (this.type === 'asteroid') {
            this.radius = Math.random() * 4 + 2; 
            this.speedX = (Math.random() - 0.5) * 0.4 + 0.2; 
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.parallaxFactor = 0.025;
            this.angle = 0;
            this.angleSpeed = (Math.random() - 0.5) * 0.05;
            
            // Generate random jagged vertices for the asteroid shape
            this.vertices = [];
            const points = Math.floor(Math.random() * 4) + 5; // 5 to 8 points
            for (let i = 0; i < points; i++) {
                const a = (i / points) * Math.PI * 2;
                const r = this.radius * (0.6 + Math.random() * 0.5); // Randomize radius per point
                this.vertices.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
            }
        } else if (this.type === 'galaxy') {
            this.radius = Math.random() * 25 + 15; 
            this.speedX = (Math.random() - 0.5) * 0.08;
            this.speedY = (Math.random() - 0.5) * 0.08;
            this.parallaxFactor = 0.015;
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = (Math.random() - 0.5) * 0.005; // Slow rotation
        } else if (this.type === 'comet') {
            this.radius = Math.random() * 1.5 + 1; 
            // Comets move fast and in a clear trajectory
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            this.speedX = Math.cos(angle) * speed;
            this.speedY = Math.sin(angle) * speed;
            this.parallaxFactor = 0.03;
        } else if (this.type === 'blackhole') {
            this.radius = Math.random() * 12 + 8; 
            this.speedX = (Math.random() - 0.5) * 0.02; 
            this.speedY = (Math.random() - 0.5) * 0.02;
            this.parallaxFactor = 0.01;
            this.tilt = Math.random() * Math.PI; 
            this.angle = 0; 
            this.angleSpeed = (Math.random() - 0.5) * 0.02; 
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrapping logic (generous padding so objects don't pop in/out)
        const padding = this.radius * 5 + 50;
        if (this.x < -padding) this.x = canvas.width + padding;
        if (this.x > canvas.width + padding) this.x = -padding;
        if (this.y < -padding) this.y = canvas.height + padding;
        if (this.y > canvas.height + padding) this.y = -padding;

        // Rotation logic for objects that spin
        if (this.type === 'blackhole' || this.type === 'galaxy' || this.type === 'asteroid') {
            this.angle += this.angleSpeed;
        }

        const dx = (mouse.x - canvas.width / 2) * this.parallaxFactor;
        const dy = (mouse.y - canvas.height / 2) * this.parallaxFactor;
        
        this.currentX = this.x - dx;
        this.currentY = this.y - dy;
    }

    draw() {
        ctx.save();
        
        if (this.type === 'nebula') {
            // Draw overlapping fuzzy gradients
            this.clouds.forEach(cloud => {
                const cx = this.currentX + cloud.dx;
                const cy = this.currentY + cloud.dy;
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cloud.size);
                grad.addColorStop(0, cloud.color);
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                
                ctx.beginPath();
                ctx.arc(cx, cy, cloud.size, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            });

        } else if (this.type === 'galaxy') {
            ctx.translate(this.currentX, this.currentY);
            ctx.rotate(this.angle);

            // Bright core
            const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 0.5);
            coreGrad.addColorStop(0, 'rgba(255, 230, 255, 0.4)');
            coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = coreGrad;
            ctx.fill();

            // Spiral arms (overlapping rotated ellipses with gradients)
            for(let i = 0; i < 2; i++) {
                ctx.rotate(Math.PI); // Draw opposite arms
                const armGrad = ctx.createRadialGradient(0, 0, this.radius * 0.2, 0, 0, this.radius * 1.5);
                armGrad.addColorStop(0, 'rgba(100, 50, 200, 0.1)');
                armGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.beginPath();
                ctx.ellipse(this.radius * 0.4, 0, this.radius * 1.2, this.radius * 0.4, 0.2, 0, Math.PI * 2);
                ctx.fillStyle = armGrad;
                ctx.fill();
            }

        } else if (this.type === 'comet') {
            // Calculate tail direction (opposite of movement)
            const speedMag = Math.sqrt(this.speedX ** 2 + this.speedY ** 2);
            const dirX = this.speedX / speedMag;
            const dirY = this.speedY / speedMag;
            const tailLength = this.radius * 15;
            
            const tailEndX = this.currentX - dirX * tailLength;
            const tailEndY = this.currentY - dirY * tailLength;

            // Fading glowing tail
            const grad = ctx.createLinearGradient(this.currentX, this.currentY, tailEndX, tailEndY);
            grad.addColorStop(0, 'rgba(200, 255, 255, 0.6)');
            grad.addColorStop(1, 'rgba(200, 255, 255, 0)');

            ctx.beginPath();
            ctx.moveTo(this.currentX + dirY * this.radius, this.currentY - dirX * this.radius);
            ctx.lineTo(tailEndX, tailEndY);
            ctx.lineTo(this.currentX - dirY * this.radius, this.currentY + dirX * this.radius);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();
            
            // Bright Comet Head
            ctx.beginPath();
            ctx.arc(this.currentX, this.currentY, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fill();

        } else if (this.type === 'asteroid') {
            // Draw polygon based on generated vertices
            ctx.translate(this.currentX, this.currentY);
            ctx.rotate(this.angle);
            
            ctx.beginPath();
            ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
            for(let i = 1; i < this.vertices.length; i++) {
                ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(120, 120, 130, 0.4)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(180, 180, 190, 0.2)';
            ctx.lineWidth = 0.5;
            ctx.stroke();

        } else if (this.type === 'planet') {
            // 3D Spherical lighting effect
            const pGrad = ctx.createRadialGradient(
                this.currentX - this.radius * 0.3, this.currentY - this.radius * 0.3, this.radius * 0.1,
                this.currentX, this.currentY, this.radius
            );
            pGrad.addColorStop(0, this.colors.base); 
            pGrad.addColorStop(1, this.colors.shadow); 

            ctx.beginPath();
            ctx.arc(this.currentX, this.currentY, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = pGrad;
            ctx.fill();

            // Ring (only for some planets)
            if (this.hasRing) {
                ctx.beginPath();
                ctx.ellipse(this.currentX, this.currentY, this.radius * 2, this.radius * 0.4, this.tilt, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(200, 200, 220, 0.15)';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Add a second faint inner ring
                ctx.beginPath();
                ctx.ellipse(this.currentX, this.currentY, this.radius * 1.6, this.radius * 0.3, this.tilt, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(200, 200, 220, 0.08)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

        } else if (this.type === 'blackhole') {
            ctx.translate(this.currentX, this.currentY);
            
            // Accretion Disk (Gradient)
            ctx.save();
            ctx.rotate(this.tilt);
            ctx.beginPath();
            ctx.ellipse(0, 0, this.radius * 2.5, this.radius * 0.5, 0, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(0, 0, this.radius, 0, 0, this.radius * 2.5);
            gradient.addColorStop(0, 'rgba(255, 80, 0, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 80, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
            
            // Solid Black Center
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.fill();

            // Spinning Gas Lanes inside the disk
            ctx.save();
            ctx.rotate(this.angle); 
            const structureCount = 8;
            const colors = ['rgba(255, 140, 50, 0.04)', 'rgba(255, 100, 20, 0.02)'];

            for (let j = 0; j < structureCount; j++) {
                ctx.beginPath();
                const startAngle = (j / structureCount) * Math.PI * 2;
                const endAngle = startAngle + Math.PI * (Math.random() * 0.4 + 0.1);
                ctx.ellipse(0, 0, (this.radius * (1.1 + j * 0.08)) * 2.5, (this.radius * (1.1 + j * 0.08)) * 0.5, 0, startAngle, endAngle);
                ctx.strokeStyle = colors[j % colors.length];
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
            ctx.restore();
        }
        
        ctx.restore();
    }
}

function initSpace() {
    starsArray = [];
    spaceObjectsArray = [];
    
    for (let i = 0; i < numStars; i++) {
        starsArray.push(new Star());
    }
    for (let i = 0; i < numObjects; i++) {
        spaceObjectsArray.push(new SpaceObject());
    }
}
initSpace();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < spaceObjectsArray.length; i++) {
        spaceObjectsArray[i].update();
        spaceObjectsArray[i].draw();
    }

    for (let i = 0; i < starsArray.length; i++) {
        starsArray[i].update();
        starsArray[i].draw();
    }
    
    requestAnimationFrame(animate);
}
animate();