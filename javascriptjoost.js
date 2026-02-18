(function () {
    const container = document.getElementById('joost-text');
    container.querySelectorAll('.joost-text-line').forEach(line => {
        const text = line.textContent;
        line.textContent = '';
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.className = 'joost-char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.visibility = 'hidden';
            line.appendChild(span);
        });
    });

    // AI Code (could not be asked to do math)
    requestAnimationFrame(() => requestAnimationFrame(() => {
        const chars = [...container.querySelectorAll('.joost-char')];
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        
        const keyframes = [
            { p: 0.00, ox:  0.55 * vw, oy: -0.75 * vh },
            { p: 0.10, ox:  0.40 * vw, oy: -0.50 * vh },
            { p: 0.50, ox: -0.35 * vw, oy:  0         },
            { p: 0.90, ox:  0.40 * vw, oy:  0.50 * vh },
            { p: 1.00, ox:  0.55 * vw, oy:  0.75 * vh },
        ];

        function moonAt(p) {
            // Find surrounding keyframes and lerp
            let a = keyframes[0], b = keyframes[keyframes.length - 1];
            for (let k = 0; k < keyframes.length - 1; k++) {
                if (p >= keyframes[k].p && p <= keyframes[k + 1].p) {
                    a = keyframes[k];
                    b = keyframes[k + 1];
                    break;
                }
            }
            const t = (b.p === a.p) ? 0 : (p - a.p) / (b.p - a.p);
            return {
                x: vw / 2 + a.ox + t * (b.ox - a.ox),
                y: vh / 2 + a.oy + t * (b.oy - a.oy),
            };
        }

        const total = chars.length;
        const revealStart = 25, revealEnd = 65;

        const scene = document.querySelector('.joost-scene');
        const sceneRect = scene.getBoundingClientRect();
        const scrollOffsetY = -sceneRect.top;
        const scrollOffsetX = -sceneRect.left;

        chars.forEach((span, i) => {
            const r  = span.getBoundingClientRect();
            const cx = r.left + r.width  / 2 + scrollOffsetX;
            const cy = r.top  + r.height / 2 + scrollOffsetY;
            const p    = revealStart + (i / (total - 1)) * (revealEnd - revealStart);
            const moon = moonAt(p / 100);
            span.style.setProperty('--dx', `${(moon.x - cx).toFixed(1)}px`);
            span.style.setProperty('--dy', `${(moon.y - cy).toFixed(1)}px`);
            span.style.setProperty('--i', i);
            span.style.visibility = '';
        });

        container.style.setProperty('--total', total);
    }));
})();