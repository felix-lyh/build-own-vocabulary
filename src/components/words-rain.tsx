'use client';
import { useEffect, useRef } from 'react';

// Vocabulary-flavoured words for the rain — fitting for a vocabulary learning app
const WORDS = [
    'serendipity', 'ephemeral', 'ubiquitous', 'eloquent', 'resilient', 'pragmatic',
    'meticulous', 'ambiguous', 'lucid', 'coherent', 'tenacious', 'candid',
    'fervent', 'benign', 'astute', 'profound', 'vivid', 'quaint', 'brisk',
    'somber', 'nimble', 'ornate', 'stark', 'serene', 'lexicon', 'syntax',
    'syllable', 'phoneme', 'grammar', 'idiom', 'fluent', 'accent', 'dialect',
    'etymology', 'semantics', 'rhetoric', 'prose', 'verse', 'mnemonic',
    'cognition', 'memorize', 'recall', 'repeat', 'practice', 'focus', 'learn',
    'words', 'vocab', 'phrase', 'verb', 'noun', 'adjective', 'tense',
    'neural', 'synapse', 'cortex', 'matrix', 'cyber', 'nexus', 'quantum',
    'cipher', 'vector', 'plasma', 'nebula', 'orbit', 'pulse', 'glitch',
    'binary', 'delta', 'sigma', 'theta', 'omega', 'node', 'stream',
    'access', 'encrypt', 'decode', 'signal', 'kernel', 'daemon', 'buffer',
    'compile', 'render', 'dynamic', 'static', 'logic', 'array', 'loop',
];

const FONT_SIZE = 13;
const LINE_HEIGHT = FONT_SIZE * 2.1;
const COLUMN_MIN_WIDTH = 120;
const MAX_COLUMNS = 26;
const HEAD_COLOR = '#CFFFF1';
const TRAIL_COLOR = '26, 188, 156'; // rgb triplet for rgba() composition

interface RainColumn {
    centerX: number;
    row: number;
    speed: number; // rows per second
    alpha: number;
    word: string;
}

export default function WordsRain({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let width = 0;
        let height = 0;
        let columns: RainColumn[] = [];
        let rafId = 0;
        let lastTime = 0;
        let running = false;

        const pickWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

        const drawWord = (col: RainColumn, y: number, isHead: boolean) => {
            const metrics = ctx.measureText(col.word);
            const x = col.centerX - metrics.width / 2;
            if (isHead) {
                ctx.shadowColor = `rgba(${TRAIL_COLOR}, 0.9)`;
                ctx.shadowBlur = 12;
                ctx.fillStyle = HEAD_COLOR;
            } else {
                ctx.shadowBlur = 0;
                ctx.fillStyle = `rgba(${TRAIL_COLOR}, ${col.alpha})`;
            }
            ctx.fillText(col.word, x, y);
            ctx.shadowBlur = 0;
        };

        const setup = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.max(1, Math.floor(width * dpr));
            canvas.height = Math.max(1, Math.floor(height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.font = `600 ${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
            ctx.textBaseline = 'top';

            // paint base background
            ctx.fillStyle = '#040c0a';
            ctx.fillRect(0, 0, width, height);

            const count = Math.max(6, Math.min(MAX_COLUMNS, Math.ceil(width / COLUMN_MIN_WIDTH)));
            columns = Array.from({ length: count }, (_, i) => ({
                centerX: ((i + 0.5) / count) * width + (Math.random() * 24 - 12),
                row: -Math.floor(Math.random() * 34),
                speed: 1.6 + Math.random() * 3.2,
                alpha: 0.4 + Math.random() * 0.5,
                word: pickWord(),
            }));

            if (prefersReducedMotion) {
                // render a single static field instead of animating
                for (const col of columns) {
                    let y = Math.random() * height;
                    for (let r = 0; r < 10; r++) {
                        y += LINE_HEIGHT * (1.5 + Math.random());
                        if (y > height) break;
                        col.word = pickWord();
                        drawWord(col, y, false);
                    }
                }
            }
        };

        const tick = (time: number) => {
            if (!running) return;
            const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0.016;
            lastTime = time;

            // translucent fill creates the fading trail
            ctx.fillStyle = 'rgba(4, 12, 10, 0.16)';
            ctx.fillRect(0, 0, width, height);

            for (const col of columns) {
                const previousRow = Math.floor(col.row);
                col.row += col.speed * dt;
                const currentRow = Math.floor(col.row);

                if (currentRow !== previousRow) {
                    const y = currentRow * LINE_HEIGHT;
                    if (Math.random() < 0.35) col.word = pickWord();
                    drawWord(col, y, true);

                    if (y > height + LINE_HEIGHT * 8) {
                        col.row = -Math.floor(Math.random() * 14) - 2;
                        col.speed = 1.6 + Math.random() * 3.2;
                        col.alpha = 0.4 + Math.random() * 0.5;
                    }
                }
            }
            rafId = requestAnimationFrame(tick);
        };

        const start = () => {
            if (running || prefersReducedMotion) return;
            running = true;
            lastTime = 0;
            rafId = requestAnimationFrame(tick);
        };

        const stop = () => {
            running = false;
            cancelAnimationFrame(rafId);
        };

        const handleVisibility = () => {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        };

        let resizeTimer: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                stop();
                setup();
                start();
            }, 150);
        };

        setup();
        start();
        window.addEventListener('resize', handleResize);
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            stop();
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={className ?? 'absolute inset-0 h-full w-full'}
        />
    );
}
