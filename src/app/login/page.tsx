"use client";

import { login } from "@/request/user";
import { FormEvent, useEffect, useRef, useState } from "react";

const rainWords = [
	["curiosity", 4, 4, 0], ["immerse", 18, 14, 1.8], ["fluency", 34, 6, 3.4], ["remember", 51, 18, 5.2],
	["語彙", 68, 5, 2.1], ["discover", 84, 15, 4.7], ["listen", 94, 31, 1.2], ["context", 8, 29, 4],
	["表达", 25, 38, 6.4], ["meaning", 43, 31, 2.8], ["practice", 61, 43, 5.8], ["language", 78, 35, 7.1],
	["speak", 2, 53, 6.8], ["読み", 15, 61, 3.1], ["connect", 32, 55, 8.4], ["vocabulary", 53, 65, 1.7],
	["words", 72, 57, 4.2], ["理解", 91, 67, 6.2], ["learn", 6, 78, 2.4], ["旅", 25, 84, 7.6],
	["recall", 43, 76, 5.1], ["progress", 64, 86, 3.7], ["new", 83, 77, 8.9], ["表达", 96, 91, 1.1],
	["focus", 12, 96, 9.8], ["bonjour", 37, 94, 6.9], ["hola", 57, 97, 4.8], ["hello", 76, 93, 0.6],
] as const;

const styles = `
	@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800&family=Space+Mono:wght@400;700&display=swap');
	* { box-sizing: border-box; }
	body { margin: 0; }
	.login-shell { min-height: 100vh; display: grid; place-items: center; padding: 24px; color: #e6fbff; background: #050816; font-family: 'Space Mono', monospace; position: relative; overflow: hidden; }
	.login-shell:before { content: ''; position: absolute; inset: 0; opacity: .32; background-image: linear-gradient(rgba(61, 224, 255, .08) 1px, transparent 1px), linear-gradient(90deg, rgba(61, 224, 255, .08) 1px, transparent 1px); background-size: 42px 42px; transform: perspective(500px) rotateX(55deg) scale(2); transform-origin: bottom; }
	.glow { position: absolute; width: 340px; height: 340px; border-radius: 50%; background: #7c3aed; filter: blur(110px); opacity: .22; top: 5%; right: 8%; }
	.card { width: min(100%, 460px); position: relative; padding: clamp(28px, 7vw, 52px); border: 1px solid rgba(87, 224, 255, .42); border-radius: 20px; background: rgba(8, 17, 39, .86); box-shadow: 0 0 45px rgba(0, 217, 255, .13), inset 0 0 35px rgba(61, 224, 255, .04); backdrop-filter: blur(14px); }
	.eyebrow { color: #4de8ff; letter-spacing: .18em; font-size: .68rem; margin: 0 0 18px; }
	h1 { font-family: Orbitron, sans-serif; font-size: clamp(1.7rem, 6vw, 2.35rem); letter-spacing: .06em; margin: 0 0 10px; }
	.subtitle { color: #8eaec4; font-size: .78rem; line-height: 1.7; margin: 0 0 30px; }
	label { display: block; color: #b9d5e3; font-size: .72rem; margin: 18px 0 8px; }
	input { width: 100%; border: 1px solid #284b68; border-radius: 8px; padding: 14px; color: #effcff; background: #081226; font: inherit; font-size: .8rem; outline: none; transition: .2s; }
	input:focus { border-color: #4de8ff; box-shadow: 0 0 0 3px rgba(77, 232, 255, .12); }
	button { width: 100%; margin-top: 26px; padding: 15px; border: 0; border-radius: 8px; color: #03101b; background: linear-gradient(100deg, #4de8ff, #b5ffda); font-family: Orbitron, sans-serif; font-weight: 800; letter-spacing: .1em; cursor: pointer; box-shadow: 0 0 22px rgba(77, 232, 255, .25); }
	button:disabled { cursor: wait; opacity: .65; }
	.message { margin: 18px 0 0; padding: 13px; border-radius: 8px; font-size: .72rem; line-height: 1.6; }
	.error { color: #ffb9c4; border: 1px solid #9b3e62; background: rgba(117, 20, 59, .2); }
	.success { color: #b9ffd8; border: 1px solid #35a97d; background: rgba(17, 105, 74, .2); }
	.tips { margin: 10px 0 0; padding-left: 18px; color: #ffd59a; }
	.tips li { margin: 5px 0; }
	.status { margin-top: 25px; color: #66869c; font-size: .62rem; letter-spacing: .08em; text-align: center; }
	.word-rain { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
	.rain-word { position: absolute; top: -8%; color: rgba(114, 223, 239, .24); font-size: clamp(.65rem, 1.3vw, .86rem); white-space: nowrap; animation: word-fall var(--fall-time) linear infinite; animation-delay: var(--fall-delay); }
	.rain-word > span { display: block; transition: color .2s, text-shadow .2s, opacity .2s; will-change: transform; }
	@keyframes word-fall { from { transform: translate3d(0, -12vh, 0) rotate(-8deg); } to { transform: translate3d(3vw, 120vh, 0) rotate(8deg); } }
	@media (prefers-reduced-motion: reduce) { .rain-word { animation-play-state: paused; } .rain-word > span { transition: none; } }
	@media (max-width: 420px) { .login-shell { padding: 14px; } .card { padding: 28px 22px; } }
`;

export default function LoginPage() {
	const [account, setAccount] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState<"error" | "success" | "">("");
	const [busy, setBusy] = useState(false);
	const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

	useEffect(() => {
		const shell = document.querySelector<HTMLElement>(".login-shell");
		if (!shell) return;

		let frame = 0;
		let pointerX = -1000;
		let pointerY = -1000;
		const updateWords = () => {
			const bounds = shell.getBoundingClientRect();
			wordRefs.current.forEach((word) => {
				if (!word) return;
				const wordBounds = word.getBoundingClientRect();
				const distance = Math.hypot(pointerX - (wordBounds.left + wordBounds.width / 2), pointerY - (wordBounds.top + wordBounds.height / 2));
				const influence = Math.max(0, 1 - distance / 180);
				word.style.transform = `translate(${(pointerX - bounds.left) * influence * 0.035}px, ${influence * -12}px) scale(${1 + influence * 0.22})`;
				word.style.color = `rgba(181, 255, 218, ${0.24 + influence * 0.7})`;
				word.style.textShadow = influence ? `0 0 ${influence * 18}px rgba(77, 232, 255, ${influence * 0.8})` : "none";
			});
			frame = 0;
		};
		const onPointerMove = (event: PointerEvent) => {
			pointerX = event.clientX;
			pointerY = event.clientY;
			if (!frame) frame = requestAnimationFrame(updateWords);
		};
		const onPointerLeave = () => {
			pointerX = -1000;
			pointerY = -1000;
			if (!frame) frame = requestAnimationFrame(updateWords);
		};

		shell.addEventListener("pointermove", onPointerMove);
		shell.addEventListener("pointerleave", onPointerLeave);
		return () => {
			shell.removeEventListener("pointermove", onPointerMove);
			shell.removeEventListener("pointerleave", onPointerLeave);
			if (frame) cancelAnimationFrame(frame);
		};
	}, []);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setMessage("");
		setBusy(true);
		login(account, password).then((user) => {
			setMessage("success");
		}).catch((error) => {
			console.error(error);
			setMessage("error");
		}).finally(() => {
			setBusy(false);
		});
	}

	return (
		<main className="login-shell">
			<style>{styles}</style>
			<div className="word-rain" aria-hidden="true">
				{rainWords.map(([word, left, top, delay], index) => (
					<span className="rain-word" key={`${word}-${index}`} style={{ left: `${left}%`, top: `${top}%`, "--fall-delay": `${-delay}s`, "--fall-time": `${13 + (index % 5) * 2}s` } as React.CSSProperties}>
						<span ref={(element) => { wordRefs.current[index] = element; }}>{word}</span>
					</span>
				))}
			</div>
			<div className="glow" aria-hidden="true" />
			<section className="card" aria-labelledby="login-title">
				<h1 id="login-title">Welcome back</h1>
				<p className="subtitle">Authenticate your identity to access the vocabulary command deck.</p>
				<form onSubmit={handleSubmit}>
					<label htmlFor="account">ACCOUNT ID</label>
					<input id="account" type="text" autoComplete="username" value={account} onChange={(e) => setAccount(e.target.value)} placeholder="enter your account" required />
					<label htmlFor="password">ACCESS CODE</label>
					<input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="enter your password" required />
					<button type="submit" disabled={busy}>{busy ? "VERIFYING..." : "INITIALIZE LOGIN"}</button>
				</form>
				{message === "error" && <div className="message error" role="alert"><strong>ACCESS DENIED.</strong> Account and password do not match.<ul className="tips"><li>Check spelling and capitalization.</li><li>Make sure Caps Lock is off.</li><li>Try resetting your password if needed.</li></ul></div>}
				{message === "success" && <div className="message success" role="status"><strong>ACCESS GRANTED.</strong> Welcome aboard, {account}.</div>}
			</section>
		</main>
	);
}
