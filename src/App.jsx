import { useState, useEffect, useCallback, useRef } from "react";

// ─── Sound System using Web Audio API ───
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
const getCtx = () => {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
};

const playCorrectSound = () => {
  try {
    const ctx = getCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.25);
    });
  } catch (e) {}
};

const playWrongSound = () => {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};

const playLevelUpSound = () => {
  try {
    const ctx = getCtx();
    const melody = [440, 554.37, 659.25, 880, 1108.73, 1318.5];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.35);
    });
  } catch (e) {}
};

const playCreeperHiss = () => {
  try {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 3000;
    filter.Q.value = 2;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};

const playClickSound = () => {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (e) {}
};

// ─── Pixel Art Creeper Face Component ───
const CreeperFace = ({ size = 32, style = {}, onClick, className = "" }) => {
  const px = size / 8;
  const grid = [
    [0,1,0,1,1,0,1,0],
    [0,1,0,1,1,0,1,0],
    [1,0,2,2,2,2,0,1],
    [0,2,2,1,1,2,2,0],
    [0,0,2,2,2,2,0,0],
    [0,0,2,0,0,2,0,0],
    [0,1,2,0,0,2,1,0],
    [1,0,0,0,0,0,0,1],
  ];
  const colors = ["#5CB332", "#3D8220", "#1A1A1A"];
  return (
    <div onClick={onClick} className={className}
      style={{ width: size, height: size, display: "grid", gridTemplateColumns: `repeat(8, ${px}px)`, gridTemplateRows: `repeat(8, ${px}px)`, imageRendering: "pixelated", flexShrink: 0, ...style }}>
      {grid.flat().map((c, i) => (
        <div key={i} style={{ background: colors[c], width: px, height: px }} />
      ))}
    </div>
  );
};

// ─── Creeper Full Body ───
const CreeperBody = ({ size = 48, style = {}, flipped = false, className = "" }) => {
  const px = size / 8;
  const fullGrid = [
    [0,1,0,1,1,0,1,0],
    [0,1,0,1,1,0,1,0],
    [1,0,2,2,2,2,0,1],
    [0,2,2,1,1,2,2,0],
    [0,0,2,2,2,2,0,0],
    [0,0,2,0,0,2,0,0],
    [0,1,2,0,0,2,1,0],
    [1,0,0,0,0,0,0,1],
    [3,3,0,1,1,0,3,3],
    [3,3,1,0,0,1,3,3],
    [3,3,0,1,1,0,3,3],
    [3,3,0,1,1,0,3,3],
    [3,0,0,3,3,0,0,3],
    [3,1,1,3,3,1,1,3],
    [3,0,0,3,3,0,0,3],
    [3,1,1,3,3,1,1,3],
  ];
  const colors = ["#5CB332", "#3D8220", "#1A1A1A", "transparent"];
  return (
    <div className={className}
      style={{ width: size, height: size * 2, display: "grid", gridTemplateColumns: `repeat(8, ${px}px)`, gridTemplateRows: `repeat(16, ${px}px)`, imageRendering: "pixelated", flexShrink: 0, transform: flipped ? "scaleX(-1)" : "none", ...style }}>
      {fullGrid.flat().map((c, i) => (
        <div key={i} style={{ background: colors[c], width: px, height: px }} />
      ))}
    </div>
  );
};

// ─── Floating Creeper Decorations ───
const FloatingCreepers = ({ count = 6 }) => {
  const creepers = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i, x: 5 + Math.random() * 85, y: 10 + Math.random() * 70,
      size: 20 + Math.random() * 24, delay: Math.random() * 4,
      duration: 3 + Math.random() * 3, opacity: 0.12 + Math.random() * 0.15,
      rotation: -15 + Math.random() * 30,
    }))
  ).current;
  return (
    <>
      {creepers.map((c) => (
        <CreeperFace key={c.id} size={c.size}
          style={{ position: "absolute", left: `${c.x}%`, top: `${c.y}%`, opacity: c.opacity, transform: `rotate(${c.rotation}deg)`, animation: `creeper-bob ${c.duration}s ease-in-out infinite`, animationDelay: `${c.delay}s`, zIndex: 0, pointerEvents: "none", filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.2))" }} />
      ))}
    </>
  );
};

// ─── Ground Creepers (walking) ───
const GroundCreepers = ({ count = 3 }) => {
  const creepers = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i, delay: i * 8 + Math.random() * 4, duration: 15 + Math.random() * 10,
      size: 28 + Math.random() * 16, flipped: Math.random() > 0.5,
    }))
  ).current;
  return (
    <>
      {creepers.map((c) => (
        <CreeperBody key={c.id} size={c.size} flipped={c.flipped}
          style={{ position: "absolute", bottom: 84, animation: `creeper-walk ${c.duration}s linear infinite`, animationDelay: `${c.delay}s`, zIndex: 2, filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.3))" }} />
      ))}
    </>
  );
};

// ─── Creeper Corner Decorations ───
const CreeperCorners = () => (
  <>
    <CreeperFace size={28} style={{ position: "absolute", top: -10, left: -10, opacity: 0.6, transform: "rotate(-12deg)" }} />
    <CreeperFace size={24} style={{ position: "absolute", top: -8, right: -8, opacity: 0.6, transform: "rotate(15deg)" }} />
    <CreeperFace size={20} style={{ position: "absolute", bottom: -8, left: -6, opacity: 0.5, transform: "rotate(8deg)" }} />
    <CreeperFace size={22} style={{ position: "absolute", bottom: -8, right: -8, opacity: 0.5, transform: "rotate(-10deg)" }} />
  </>
);

// ─── Level Definitions ───
const LEVELS = [
  { name: "みならい", desc: "たしざん 1〜5", maxNum: 5, ops: ["+"], icon: "🪨" },
  { name: "ほりし", desc: "たしざん 1〜10", maxNum: 10, ops: ["+"], icon: "⛏️" },
  { name: "たんけんか", desc: "ひきざん 1〜5", maxNum: 5, ops: ["-"], icon: "🗺️" },
  { name: "けんちくか", desc: "ひきざん 1〜10", maxNum: 10, ops: ["-"], icon: "🏗️" },
  { name: "ぼうけんか", desc: "まぜまぜ 1〜10", maxNum: 10, ops: ["+", "-"], icon: "⚔️" },
  { name: "ゆうしゃ", desc: "たしざん 〜20", maxNum: 20, ops: ["+"], icon: "🛡️" },
  { name: "まほうつかい", desc: "ひきざん 〜20", maxNum: 20, ops: ["-"], icon: "✨" },
  { name: "エンダードラゴン", desc: "まぜまぜ 〜20", maxNum: 20, ops: ["+", "-"], icon: "🐉" },
];

const generateProblem = (level) => {
  const cfg = LEVELS[level];
  const op = cfg.ops[Math.floor(Math.random() * cfg.ops.length)];
  let a, b;
  if (op === "+") {
    a = Math.floor(Math.random() * cfg.maxNum) + 1;
    b = Math.floor(Math.random() * (cfg.maxNum - a)) + (cfg.maxNum > 5 ? 0 : 1);
    if (b === 0 && cfg.maxNum <= 5) b = 1;
    return { a, b, op, answer: a + b };
  } else {
    a = Math.floor(Math.random() * cfg.maxNum) + 1;
    b = Math.floor(Math.random() * a) + (a > 1 ? 1 : 0);
    if (b === 0) b = 1;
    if (b > a) [a, b] = [b, a];
    return { a, b, op, answer: a - b };
  }
};

// ─── Particles ───
const Particles = ({ show }) => {
  if (!show) return null;
  const colors = ["#5CB332", "#3D8220", "#FFD700", "#4CAF50", "#81C784", "#1A1A1A"];
  return (
    <div style={{ position: "fixed", left: "50%", top: "40%", pointerEvents: "none", zIndex: 9999 }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const size = 4 + Math.random() * 10;
        return <div key={i} style={{ position: "absolute", width: size, height: size, background: colors[i % colors.length], imageRendering: "pixelated", animation: `particle-fly-${i % 4} 0.6s ease-out forwards` }} />;
      })}
    </div>
  );
};

// ─── CSS ───
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes title-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes particle-fly-0 { to { transform: translate(-50px, -60px); opacity: 0; } }
  @keyframes particle-fly-1 { to { transform: translate(50px, -40px); opacity: 0; } }
  @keyframes particle-fly-2 { to { transform: translate(-30px, 50px); opacity: 0; } }
  @keyframes particle-fly-3 { to { transform: translate(40px, 30px); opacity: 0; } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
  @keyframes level-up-in { 0%{transform:scale(0) rotate(-10deg);opacity:0} 60%{transform:scale(1.2) rotate(3deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes xp-pop { 0%{transform:scale(0.5);opacity:0} 50%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
  @keyframes cloud { 0%{transform:translateX(-200px)} 100%{transform:translateX(calc(100vw + 200px))} }
  @keyframes creeper-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes creeper-walk { 0%{left:-60px} 100%{left:calc(100% + 60px)} }
  @keyframes creeper-peek { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-20px)} 60%{transform:translateY(-20px)} }
  @keyframes creeper-sway { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
  @keyframes explode-shake { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1) rotate(2deg)} }
  button:active { transform: translateY(2px) !important; }
  input:focus { outline: none; }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  input[type=number] { -moz-appearance: textfield; }
`;

// ─── Main App ───
export default function MathCraftApp() {
  const [screen, setScreen] = useState("title");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [unlockedLevel, setUnlockedLevel] = useState(0);
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalQ, setTotalQ] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showParticles, setShowParticles] = useState(false);
  const [levelProgress, setLevelProgress] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [xp, setXp] = useState(0);
  const [creeperTapCount, setCreeperTapCount] = useState(0);

  const [testConfig, setTestConfig] = useState({ count: 10, level: 0 });
  const [testProblems, setTestProblems] = useState([]);
  const [testIndex, setTestIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState([]);
  const [testStartTime, setTestStartTime] = useState(null);

  const inputRef = useRef(null);
  const LEVEL_UP_THRESHOLD = 5;

  const newProblem = useCallback((lvl) => {
    const p = generateProblem(lvl ?? currentLevel);
    setProblem(p);
    setUserAnswer("");
    setFeedback(null);
  }, [currentLevel]);

  const startGame = (lvl) => {
    setCurrentLevel(lvl); setScore(0); setStreak(0); setTotalQ(0); setLevelProgress(0);
    setScreen("game");
    setProblem(generateProblem(lvl)); setUserAnswer(""); setFeedback(null);
  };

  const checkAnswer = () => {
    if (userAnswer === "") return;
    const ans = parseInt(userAnswer, 10);
    setTotalQ((t) => t + 1);
    if (ans === problem.answer) {
      playCorrectSound(); setFeedback("correct"); setScore((s) => s + 1);
      setStreak((s) => s + 1); setBestStreak((b) => Math.max(b, streak + 1));
      setShowParticles(true); setXp(xp + 10 + streak * 2);
      const newProgress = levelProgress + 1;
      setLevelProgress(newProgress);
      if (newProgress >= LEVEL_UP_THRESHOLD && currentLevel < LEVELS.length - 1) {
        setTimeout(() => {
          playLevelUpSound(); setShowLevelUp(true);
          const nextLvl = currentLevel + 1;
          setCurrentLevel(nextLvl);
          if (nextLvl > unlockedLevel) setUnlockedLevel(nextLvl);
          setLevelProgress(0);
          setTimeout(() => { setShowLevelUp(false); setProblem(generateProblem(nextLvl)); setUserAnswer(""); setFeedback(null); }, 2000);
        }, 600);
      } else {
        setTimeout(() => { setShowParticles(false); newProblem(); }, 600);
      }
    } else {
      playWrongSound(); setFeedback("wrong"); setStreak(0);
      setTimeout(() => { setUserAnswer(""); setFeedback(null); }, 800);
    }
  };

  const startTest = () => {
    const problems = Array.from({ length: testConfig.count }, () => generateProblem(testConfig.level));
    setTestProblems(problems); setTestIndex(0); setTestAnswers([]); setTestStartTime(Date.now());
    setUserAnswer(""); setFeedback(null); setScreen("test");
  };

  const submitTestAnswer = () => {
    if (userAnswer === "") return;
    const ans = parseInt(userAnswer, 10);
    const correct = ans === testProblems[testIndex].answer;
    if (correct) playCorrectSound(); else playWrongSound();
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setShowParticles(true);
    const newAnswers = [...testAnswers, { ...testProblems[testIndex], userAnswer: ans, correct }];
    setTestAnswers(newAnswers);
    setTimeout(() => {
      setShowParticles(false); setFeedback(null); setUserAnswer("");
      if (testIndex + 1 >= testProblems.length) setScreen("results");
      else setTestIndex(testIndex + 1);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { if (screen === "game") checkAnswer(); else if (screen === "test") submitTestAnswer(); }
  };

  const handleCreeperTap = () => { playCreeperHiss(); setCreeperTapCount((c) => c + 1); };

  useEffect(() => {
    if ((screen === "game" || screen === "test") && inputRef.current) inputRef.current.focus();
  }, [screen, problem, testIndex, feedback]);

  const mcBtn = (color = "#4a4a4a", hover = "#5a5a5a") => ({
    fontFamily: "'Press Start 2P', monospace", fontSize: 11, padding: "12px 20px",
    background: `linear-gradient(180deg, ${hover} 0%, ${color} 100%)`, color: "#fff",
    border: "3px solid #222", borderBottom: "4px solid #111", borderRight: "4px solid #111",
    borderTop: "3px solid #777", borderLeft: "3px solid #777", cursor: "pointer",
    imageRendering: "pixelated", textShadow: "2px 2px 0 #111", letterSpacing: 1, userSelect: "none",
  });

  const containerStyle = {
    minHeight: "100vh", background: "linear-gradient(180deg, #87CEEB 0%, #5BA3D9 40%, #4A8C2A 40%, #3B7A1F 100%)",
    fontFamily: "'Press Start 2P', monospace", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden", position: "relative",
  };

  const panelStyle = {
    background: "linear-gradient(180deg, #8B8B8B 0%, #6B6B6B 100%)",
    border: "4px solid #444", borderTop: "4px solid #aaa", borderLeft: "4px solid #aaa",
    borderBottom: "4px solid #333", borderRight: "4px solid #333",
    padding: 24, imageRendering: "pixelated", position: "relative", overflow: "visible",
  };

  const inputStyle = {
    fontFamily: "'Press Start 2P', monospace", fontSize: 28, width: 120, padding: "8px 12px", textAlign: "center",
    background: "#222", color: "#5BDB3F", border: "3px solid #555", borderTop: "3px solid #333",
    borderLeft: "3px solid #333", borderBottom: "3px solid #888", borderRight: "3px solid #888",
  };

  const dirtBlock = { position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "repeating-linear-gradient(90deg, #6B4226 0px, #6B4226 16px, #5C3820 16px, #5C3820 32px)", borderTop: "4px solid #4A2D14", zIndex: 0 };
  const grassBlock = { position: "absolute", bottom: 76, left: 0, right: 0, height: 16, background: "repeating-linear-gradient(90deg, #5B8731 0px, #5B8731 16px, #4A7228 16px, #4A7228 32px)", zIndex: 1 };

  // ─── Number Pad ───
  const NumPad = ({ disabled }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginTop: 16, maxWidth: 280, margin: "16px auto 0" }}>
      {[1,2,3,4,5,6,7,8,9,0].map((n) => (
        <button key={n} disabled={disabled} onClick={() => { playClickSound(); setUserAnswer((prev) => prev + String(n)); }}
          style={{ ...mcBtn(), fontSize: 14, padding: "10px 6px" }}>{n}</button>
      ))}
    </div>
  );

  // ─── TITLE SCREEN ───
  if (screen === "title") {
    return (
      <div style={containerStyle}>
        <style>{GLOBAL_CSS}</style>
        <FloatingCreepers count={8} />
        {[0,1,2].map((i) => (
          <div key={i} style={{ position: "absolute", top: 30 + i * 50, fontSize: 40 + i * 10, animation: `cloud ${18 + i * 7}s linear infinite`, animationDelay: `${i * -6}s`, opacity: 0.7, zIndex: 1 }}>☁️</div>
        ))}

        <div style={{ marginTop: 50, textAlign: "center", zIndex: 3 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
            <CreeperFace size={32} style={{ animation: "creeper-sway 2s ease-in-out infinite", cursor: "pointer" }} onClick={handleCreeperTap} />
            <div style={{ fontSize: 16, color: "#FFD700", textShadow: "3px 3px 0 #8B6914" }}>さんすうクラフト</div>
            <CreeperFace size={32} style={{ animation: "creeper-sway 2s ease-in-out infinite 0.5s", cursor: "pointer" }} onClick={handleCreeperTap} />
          </div>
          <div style={{ fontSize: 30, color: "#fff", textShadow: "4px 4px 0 #333, -2px -2px 0 #333", animation: "title-bob 2s ease-in-out infinite", marginBottom: 8 }}>MATH CRAFT</div>
          <div style={{ fontSize: 9, color: "#E8E8E8", textShadow: "2px 2px 0 #555" }}>けいさんマスターになろう！</div>
          {creeperTapCount > 0 && <div style={{ fontSize: 7, color: "#5CB332", marginTop: 4, animation: "xp-pop 0.3s ease-out" }}>💥 クリーパーを {creeperTapCount}かい タップした！</div>}
        </div>

        <div style={{ ...panelStyle, marginTop: 32, display: "flex", flexDirection: "column", gap: 16, minWidth: 300, zIndex: 3 }}>
          <CreeperCorners />
          <button style={{ ...mcBtn("#4A7A2E", "#5B8C3F"), fontSize: 13 }} onClick={() => { playClickSound(); setScreen("levelSelect"); }}>🎮 ぼうけんモード</button>
          <button style={{ ...mcBtn("#2E5A7A", "#3F6B8C"), fontSize: 13 }} onClick={() => { playClickSound(); setScreen("testSetup"); }}>📝 テストモード</button>
        </div>

        <div style={{ marginTop: 20, fontSize: 9, color: "#E8E8E8", textShadow: "1px 1px 0 #444", zIndex: 3 }}>🏆 さいこうレベル: {LEVELS[unlockedLevel].icon} {LEVELS[unlockedLevel].name}</div>

        <GroundCreepers count={4} />
        <div style={{ position: "absolute", bottom: 60, left: 20, zIndex: 3, animation: "creeper-peek 4s ease-in-out infinite" }}>
          <CreeperBody size={36} style={{ cursor: "pointer" }} onClick={handleCreeperTap} />
        </div>
        <div style={{ position: "absolute", bottom: 70, right: 15, zIndex: 3, animation: "creeper-peek 4s ease-in-out infinite 2s" }}>
          <CreeperBody size={28} flipped style={{ cursor: "pointer" }} onClick={handleCreeperTap} />
        </div>
        <div style={grassBlock} />
        <div style={dirtBlock} />
      </div>
    );
  }

  // ─── LEVEL SELECT ───
  if (screen === "levelSelect") {
    return (
      <div style={containerStyle}>
        <style>{GLOBAL_CSS}</style>
        <FloatingCreepers count={6} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24, zIndex: 3 }}>
          <CreeperFace size={24} />
          <div style={{ fontSize: 14, color: "#FFD700", textShadow: "2px 2px 0 #8B6914" }}>レベルをえらぼう</div>
          <CreeperFace size={24} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 16, maxWidth: 360, width: "100%", marginTop: 16, zIndex: 3 }}>
          {LEVELS.map((lvl, i) => {
            const locked = i > unlockedLevel;
            return (
              <button key={i} disabled={locked} onClick={() => { playClickSound(); startGame(i); }}
                style={{ ...mcBtn(locked ? "#555" : i === unlockedLevel ? "#4A7A2E" : "#4a4a4a", locked ? "#666" : i === unlockedLevel ? "#5B8C3F" : "#5a5a5a"), opacity: locked ? 0.5 : 1, fontSize: 9, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
                {i === unlockedLevel && !locked && <CreeperFace size={14} style={{ position: "absolute", top: -6, right: -6, animation: "creeper-sway 1.5s ease-in-out infinite" }} />}
                <span style={{ fontSize: 22 }}>{locked ? "🔒" : lvl.icon}</span>
                <span>{lvl.name}</span>
                <span style={{ fontSize: 7, color: locked ? "#888" : "#ccc", textShadow: "none" }}>{lvl.desc}</span>
              </button>
            );
          })}
        </div>
        <button style={{ ...mcBtn("#7A2E2E", "#8C3F3F"), marginTop: 12, zIndex: 3, fontSize: 10 }} onClick={() => { playClickSound(); setScreen("title"); }}>← もどる</button>
        <GroundCreepers count={3} />
        <div style={grassBlock} />
        <div style={dirtBlock} />
      </div>
    );
  }

  // ─── GAME MODE ───
  if (screen === "game") {
    const lvl = LEVELS[currentLevel];
    return (
      <div style={containerStyle}>
        <style>{GLOBAL_CSS}</style>
        <Particles show={showParticles} />
        <FloatingCreepers count={5} />

        {showLevelUp && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
            <div style={{ animation: "level-up-in 0.6s ease-out", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16 }}>
                <CreeperFace size={48} style={{ animation: "creeper-sway 1s ease-in-out infinite" }} />
                <div style={{ fontSize: 50 }}>{LEVELS[Math.min(currentLevel + 1, LEVELS.length - 1)].icon}</div>
                <CreeperFace size={48} style={{ animation: "creeper-sway 1s ease-in-out infinite 0.3s" }} />
              </div>
              <div style={{ fontSize: 16, color: "#FFD700", textShadow: "3px 3px 0 #8B6914", fontFamily: "'Press Start 2P', monospace" }}>レベルアップ！</div>
              <div style={{ fontSize: 12, color: "#fff", marginTop: 12, textShadow: "2px 2px 0 #333", fontFamily: "'Press Start 2P', monospace" }}>{LEVELS[Math.min(currentLevel + 1, LEVELS.length - 1)].name}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                {[0,1,2,3,4].map(i => <CreeperFace key={i} size={20} style={{ animation: `creeper-bob 0.5s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }} />)}
              </div>
            </div>
          </div>
        )}

        <div style={{ ...panelStyle, width: "100%", maxWidth: 400, padding: "10px 16px", marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 9, zIndex: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><CreeperFace size={16} /> Lv.{currentLevel + 1}</div>
          <div style={{ color: "#FFD700" }}>⭐ {score}</div>
          <div>🔥 {streak}</div>
        </div>

        <div style={{ width: "100%", maxWidth: 400, marginTop: 8, padding: "0 12px", zIndex: 3 }}>
          <div style={{ background: "#333", border: "2px solid #555", height: 16, overflow: "hidden", position: "relative" }}>
            <div style={{ background: "linear-gradient(180deg, #5BDB3F 0%, #3BA520 100%)", height: "100%", width: `${(levelProgress / LEVEL_UP_THRESHOLD) * 100}%`, transition: "width 0.3s" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontFamily: "'Press Start 2P', monospace", textShadow: "1px 1px 0 #000" }}>{levelProgress}/{LEVEL_UP_THRESHOLD} → レベルアップ</div>
          </div>
        </div>

        <div style={{
          ...panelStyle, marginTop: 20, minWidth: 300, textAlign: "center", zIndex: 3,
          animation: feedback === "wrong" ? "shake 0.3s ease" : feedback === "correct" ? "explode-shake 0.3s ease" : undefined,
          background: feedback === "correct" ? "linear-gradient(180deg, #5B8731 0%, #4A7228 100%)" : feedback === "wrong" ? "linear-gradient(180deg, #8B3131 0%, #6B2828 100%)" : panelStyle.background,
        }}>
          <CreeperCorners />

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <CreeperFace size={feedback ? 44 : 36} style={{
              transition: "all 0.2s", cursor: "pointer",
              filter: feedback === "wrong" ? "hue-rotate(320deg) brightness(1.2)" : feedback === "correct" ? "brightness(1.3) drop-shadow(0 0 8px #5BDB3F)" : "none",
              animation: feedback === "correct" ? "creeper-bob 0.3s ease-in-out 2" : feedback === "wrong" ? "shake 0.3s ease" : "creeper-sway 3s ease-in-out infinite",
            }} onClick={handleCreeperTap} />
          </div>

          {problem && (
            <>
              <div style={{ fontSize: 36, marginBottom: 16, textShadow: "3px 3px 0 #333" }}>
                {problem.a} {problem.op === "+" ? "＋" : "−"} {problem.b} ＝ ？
              </div>
              <input ref={inputRef} type="number" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} onKeyDown={handleKeyDown} disabled={feedback !== null} style={inputStyle} />
              <NumPad disabled={feedback !== null} />
              <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
                <button onClick={() => { playClickSound(); setUserAnswer(""); }} style={{ ...mcBtn("#7A5A2E", "#8C6B3F"), fontSize: 10, padding: "10px 16px" }}>けす</button>
                <button onClick={checkAnswer} disabled={feedback !== null || userAnswer === ""} style={{ ...mcBtn("#4A7A2E", "#5B8C3F"), fontSize: 10, padding: "10px 24px", opacity: feedback !== null || userAnswer === "" ? 0.5 : 1 }}>こたえる！</button>
              </div>
              {feedback === "correct" && (
                <div style={{ marginTop: 12, fontSize: 14, color: "#5BDB3F", textShadow: "2px 2px 0 #222", animation: "xp-pop 0.3s ease-out", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <CreeperFace size={16} /> せいかい！ +{10 + (streak - 1) * 2} XP <CreeperFace size={16} />
                </div>
              )}
              {feedback === "wrong" && <div style={{ marginTop: 12, fontSize: 11, color: "#FF6B6B", textShadow: "2px 2px 0 #222" }}>💥 こたえは {problem.answer} だよ！</div>}
            </>
          )}
        </div>

        {streak >= 3 && (
          <div style={{ display: "flex", gap: 4, marginTop: 8, zIndex: 3 }}>
            {Array.from({ length: Math.min(streak, 10) }).map((_, i) => (
              <CreeperFace key={i} size={16} style={{ animation: `creeper-bob 0.5s ease-in-out infinite`, animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        )}

        <button style={{ ...mcBtn("#7A2E2E", "#8C3F3F"), marginTop: 12, zIndex: 3, fontSize: 9 }} onClick={() => { playClickSound(); setScreen("title"); }}>← やめる</button>
        <GroundCreepers count={2} />
        <div style={grassBlock} />
        <div style={dirtBlock} />
      </div>
    );
  }

  // ─── TEST SETUP ───
  if (screen === "testSetup") {
    return (
      <div style={containerStyle}>
        <style>{GLOBAL_CSS}</style>
        <FloatingCreepers count={5} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 30, zIndex: 3 }}>
          <CreeperFace size={24} />
          <div style={{ fontSize: 14, color: "#FFD700", textShadow: "2px 2px 0 #8B6914" }}>テストのせってい</div>
          <CreeperFace size={24} />
        </div>
        <div style={{ ...panelStyle, marginTop: 24, minWidth: 300, zIndex: 3 }}>
          <CreeperCorners />
          <div style={{ fontSize: 10, marginBottom: 12 }}>もんだいのかず</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
            {[5, 10, 20].map((n) => (
              <button key={n} onClick={() => { playClickSound(); setTestConfig((c) => ({ ...c, count: n })); }}
                style={{ ...mcBtn(testConfig.count === n ? "#4A7A2E" : "#4a4a4a", testConfig.count === n ? "#5B8C3F" : "#5a5a5a"), fontSize: 12 }}>{n}もん</button>
            ))}
          </div>
          <div style={{ fontSize: 10, marginBottom: 12 }}>レベル</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {LEVELS.slice(0, unlockedLevel + 1).map((lvl, i) => (
              <button key={i} onClick={() => { playClickSound(); setTestConfig((c) => ({ ...c, level: i })); }}
                style={{ ...mcBtn(testConfig.level === i ? "#2E5A7A" : "#4a4a4a", testConfig.level === i ? "#3F6B8C" : "#5a5a5a"), fontSize: 8, padding: "8px 6px" }}>{lvl.icon} {lvl.name}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20, zIndex: 3 }}>
          <button style={{ ...mcBtn("#7A2E2E", "#8C3F3F"), fontSize: 10 }} onClick={() => { playClickSound(); setScreen("title"); }}>← もどる</button>
          <button style={{ ...mcBtn("#4A7A2E", "#5B8C3F"), fontSize: 10 }} onClick={() => { playClickSound(); startTest(); }}>スタート！ →</button>
        </div>
        <GroundCreepers count={3} />
        <div style={grassBlock} />
        <div style={dirtBlock} />
      </div>
    );
  }

  // ─── TEST MODE ───
  if (screen === "test") {
    const tp = testProblems[testIndex];
    return (
      <div style={containerStyle}>
        <style>{GLOBAL_CSS}</style>
        <Particles show={showParticles} />
        <FloatingCreepers count={4} />
        <div style={{ ...panelStyle, width: "100%", maxWidth: 400, padding: "10px 16px", marginTop: 12, fontSize: 10, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><CreeperFace size={14} /> テスト</div>
          <div>{testIndex + 1} / {testProblems.length}</div>
        </div>
        <div style={{ width: "100%", maxWidth: 400, marginTop: 8, padding: "0 12px", zIndex: 3 }}>
          <div style={{ background: "#333", border: "2px solid #555", height: 12, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(180deg, #3FA5DB 0%, #2080B0 100%)", height: "100%", width: `${((testIndex + 1) / testProblems.length) * 100}%`, transition: "width 0.3s" }} />
          </div>
        </div>
        <div style={{
          ...panelStyle, marginTop: 20, minWidth: 300, textAlign: "center", zIndex: 3,
          animation: feedback === "wrong" ? "shake 0.3s ease" : undefined,
          background: feedback === "correct" ? "linear-gradient(180deg, #5B8731 0%, #4A7228 100%)" : feedback === "wrong" ? "linear-gradient(180deg, #8B3131 0%, #6B2828 100%)" : panelStyle.background,
        }}>
          <CreeperCorners />
          <CreeperFace size={32} style={{ margin: "0 auto 12px", animation: "creeper-sway 3s ease-in-out infinite", cursor: "pointer" }} onClick={handleCreeperTap} />
          <div style={{ fontSize: 36, marginBottom: 16, textShadow: "3px 3px 0 #333" }}>{tp.a} {tp.op === "+" ? "＋" : "−"} {tp.b} ＝ ？</div>
          <input ref={inputRef} type="number" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} onKeyDown={handleKeyDown} disabled={feedback !== null} style={inputStyle} />
          <NumPad disabled={feedback !== null} />
          <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
            <button onClick={() => { playClickSound(); setUserAnswer(""); }} style={{ ...mcBtn("#7A5A2E", "#8C6B3F"), fontSize: 10, padding: "10px 16px" }}>けす</button>
            <button onClick={submitTestAnswer} disabled={feedback !== null || userAnswer === ""} style={{ ...mcBtn("#2E5A7A", "#3F6B8C"), fontSize: 10, padding: "10px 24px", opacity: feedback !== null || userAnswer === "" ? 0.5 : 1 }}>つぎへ →</button>
          </div>
        </div>
        <GroundCreepers count={2} />
        <div style={grassBlock} />
        <div style={dirtBlock} />
      </div>
    );
  }

  // ─── RESULTS ───
  if (screen === "results") {
    const correctCount = testAnswers.filter((a) => a.correct).length;
    const totalTime = Math.round((Date.now() - testStartTime) / 1000);
    const pct = Math.round((correctCount / testAnswers.length) * 100);
    const grade = pct === 100 ? { text: "かんぺき！", icon: "🐉", color: "#FFD700" } : pct >= 80 ? { text: "すごい！", icon: "⚔️", color: "#5BDB3F" } : pct >= 60 ? { text: "がんばった！", icon: "⛏️", color: "#3FA5DB" } : { text: "もうちょっと！", icon: "🪨", color: "#FF9800" };
    const celebrationCount = pct === 100 ? 8 : pct >= 80 ? 6 : pct >= 60 ? 4 : 2;

    return (
      <div style={containerStyle}>
        <style>{GLOBAL_CSS}</style>
        <FloatingCreepers count={7} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 30, zIndex: 3 }}>
          <CreeperFace size={24} />
          <div style={{ fontSize: 14, color: "#FFD700", textShadow: "2px 2px 0 #8B6914" }}>テストけっか</div>
          <CreeperFace size={24} />
        </div>
        <div style={{ ...panelStyle, marginTop: 20, minWidth: 320, textAlign: "center", zIndex: 3, animation: "level-up-in 0.5s ease-out" }}>
          <CreeperCorners />
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
            {Array.from({ length: celebrationCount }).map((_, i) => (
              <CreeperFace key={i} size={18} style={{ animation: `creeper-bob 0.6s ease-in-out infinite`, animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
          <div style={{ fontSize: 50, marginBottom: 8 }}>{grade.icon}</div>
          <div style={{ fontSize: 14, color: grade.color, textShadow: "2px 2px 0 #222", marginBottom: 16 }}>{grade.text}</div>
          <div style={{ fontSize: 28, color: "#FFD700", textShadow: "3px 3px 0 #8B6914", marginBottom: 8 }}>{correctCount} / {testAnswers.length}</div>
          <div style={{ fontSize: 9, color: "#ccc", marginBottom: 4 }}>せいかいりつ: {pct}%</div>
          <div style={{ fontSize: 9, color: "#ccc" }}>じかん: {Math.floor(totalTime / 60)}ぷん {totalTime % 60}びょう</div>
        </div>
        <div style={{ ...panelStyle, marginTop: 12, minWidth: 320, maxHeight: 200, overflowY: "auto", zIndex: 3, padding: 12 }}>
          {testAnswers.map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 4px", fontSize: 9, borderBottom: i < testAnswers.length - 1 ? "2px solid #555" : "none", color: a.correct ? "#5BDB3F" : "#FF6B6B" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {a.correct && <CreeperFace size={10} />}
                {a.a} {a.op === "+" ? "＋" : "−"} {a.b} ＝ {a.userAnswer}
              </span>
              <span>{a.correct ? "⭐" : `💥 → ${a.answer}`}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16, zIndex: 3 }}>
          <button style={{ ...mcBtn("#7A2E2E", "#8C3F3F"), fontSize: 10 }} onClick={() => { playClickSound(); setScreen("title"); }}>← タイトル</button>
          <button style={{ ...mcBtn("#2E5A7A", "#3F6B8C"), fontSize: 10 }} onClick={() => { playClickSound(); startTest(); }}>もういちど →</button>
        </div>
        <GroundCreepers count={4} />
        <div style={grassBlock} />
        <div style={dirtBlock} />
      </div>
    );
  }
  return null;
}
