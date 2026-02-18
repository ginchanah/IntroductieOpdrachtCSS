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

            // Mirror joost-x keyframe: moon position at a given cover progress 0-1
            function moonAt(p) {
                let mx, my;
                if (p <= 0.5) {
                    const t = p * 2;
                    mx = (1 - t) * 0.35 * vw + t * -0.35 * vw;
                    my = (1 - t) * -0.50 * vh;
                } else {
                    const t = (p - 0.5) * 2;
                    mx = (1 - t) * -0.35 * vw + t * 0.35 * vw;
                    my = t * 0.50 * vh;
                }
                return { x: vw / 2 + mx, y: vh / 2 + my };
            }

            const total = chars.length;
            const revealStart = 15, revealEnd = 75;

            chars.forEach((span, i) => {
                const r    = span.getBoundingClientRect();
                const cx   = r.left + r.width  / 2;
                const cy   = r.top  + r.height / 2;
                const p    = revealStart + (i / (total - 1)) * (revealEnd - revealStart);
                const moon = moonAt(p / 100);

                // Set position offset as CSS custom properties
                span.style.setProperty('--dx', `${(moon.x - cx).toFixed(1)}px`);
                span.style.setProperty('--dy', `${(moon.y - cy).toFixed(1)}px`);
                span.style.setProperty('--i', i);
                span.style.visibility = '';
            });

            // Write total char count to container so CSS calc() can use it
            container.style.setProperty('--total', total);
        }));
    })();