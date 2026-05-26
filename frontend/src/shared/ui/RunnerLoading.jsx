import { useEffect, useRef } from "react";

export function RunnerLoader({ text = "메뉴 정보를 가져오는 중입니다" }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function drawRunner(x, y, phase) {
      const s = 1.4;
      const legSwing = Math.sin(phase) * 0.7;
      const armSwing = Math.sin(phase) * 0.55;
      const bobY = Math.abs(Math.sin(phase)) * -6;
      ctx.save();
      ctx.translate(x, y + bobY);
      ctx.rotate(0.15);
      const skin = "#F5C5A3",
        shirt = "#FF6B35",
        pants = "#444",
        shoe = "#222",
        hair = "#222";
      const thighLen = 22 * s,
        shinLen = 20 * s,
        upperLen = 14 * s,
        foreLen = 12 * s;
      const hip = { x: 0, y: 10 * s };
      const thighAF = legSwing + 0.1,
        thighAB = -legSwing + 0.1;
      const shinAF = thighAF - 0.55,
        shinAB = thighAB - 0.55;
      const kneeFx = hip.x + Math.sin(thighAF) * thighLen,
        kneeFy = hip.y + Math.cos(thighAF) * thighLen;
      const footFx = kneeFx + Math.sin(shinAF) * shinLen,
        footFy = kneeFy + Math.cos(shinAF) * shinLen;
      const kneeBx = hip.x + Math.sin(thighAB) * thighLen,
        kneeBy = hip.y + Math.cos(thighAB) * thighLen;
      const footBx = kneeBx + Math.sin(shinAB) * shinLen,
        footBy = kneeBy + Math.cos(shinAB) * shinLen;
      const shoulder = { x: 0, y: -24 * s };
      const upperAF = armSwing - 0.3,
        upperAB = -armSwing - 0.3;
      const foreAF = upperAF + 0.6,
        foreAB = upperAB - 0.6;
      const elbowFx = shoulder.x + Math.sin(upperAF) * upperLen,
        elbowFy = shoulder.y + Math.cos(upperAF) * upperLen;
      const handFx = elbowFx + Math.sin(foreAF) * foreLen,
        handFy = elbowFy + Math.cos(foreAF) * foreLen;
      const elbowBx = shoulder.x + Math.sin(upperAB) * upperLen,
        elbowBy = shoulder.y + Math.cos(upperAB) * upperLen;
      const handBx = elbowBx + Math.sin(foreAB) * foreLen,
        handBy = elbowBy + Math.cos(foreAB) * foreLen;

      // 뒷다리
      ctx.strokeStyle = pants;
      ctx.lineWidth = 7 * s;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(hip.x, hip.y);
      ctx.lineTo(kneeBx, kneeBy);
      ctx.stroke();
      ctx.lineWidth = 6 * s;
      ctx.beginPath();
      ctx.moveTo(kneeBx, kneeBy);
      ctx.lineTo(footBx, footBy);
      ctx.stroke();
      ctx.fillStyle = shoe;
      ctx.beginPath();
      ctx.ellipse(
        footBx + 5 * s,
        footBy + 2 * s,
        9 * s,
        4 * s,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // 뒷팔
      ctx.strokeStyle = skin;
      ctx.lineWidth = 5 * s;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(shoulder.x, shoulder.y);
      ctx.lineTo(elbowBx, elbowBy);
      ctx.stroke();
      ctx.lineWidth = 4.5 * s;
      ctx.beginPath();
      ctx.moveTo(elbowBx, elbowBy);
      ctx.lineTo(handBx, handBy);
      ctx.stroke();

      // 몸통
      ctx.strokeStyle = shirt;
      ctx.lineWidth = 16 * s;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, hip.y);
      ctx.lineTo(0, -30 * s);
      ctx.stroke();

      // 앞다리
      ctx.strokeStyle = pants;
      ctx.lineWidth = 7 * s;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(hip.x, hip.y);
      ctx.lineTo(kneeFx, kneeFy);
      ctx.stroke();
      ctx.lineWidth = 6 * s;
      ctx.beginPath();
      ctx.moveTo(kneeFx, kneeFy);
      ctx.lineTo(footFx, footFy);
      ctx.stroke();
      ctx.fillStyle = shoe;
      ctx.beginPath();
      ctx.ellipse(
        footFx + 6 * s,
        footFy + 2 * s,
        9 * s,
        4 * s,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // 앞팔
      ctx.strokeStyle = skin;
      ctx.lineWidth = 5 * s;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(shoulder.x, shoulder.y);
      ctx.lineTo(elbowFx, elbowFy);
      ctx.stroke();
      ctx.lineWidth = 4.5 * s;
      ctx.beginPath();
      ctx.moveTo(elbowFx, elbowFy);
      ctx.lineTo(handFx, handFy);
      ctx.stroke();

      // 목
      ctx.strokeStyle = skin;
      ctx.lineWidth = 7 * s;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, -30 * s);
      ctx.lineTo(0, -36 * s);
      ctx.stroke();

      // 머리
      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.arc(0, -44 * s, 12 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hair;
      ctx.beginPath();
      ctx.arc(0, -47 * s, 12 * s, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-12 * s, -47 * s, 24 * s, 5 * s);
      ctx.restore();
    }

    function drawBurger(x, y, phase) {
      const bob = Math.sin(phase * 0.7) * 6;
      ctx.save();
      ctx.translate(x, y + bob);
      ctx.rotate(Math.sin(phase * 0.7) * 0.1);
      ctx.fillStyle = "#D4922E";
      ctx.beginPath();
      ctx.ellipse(0, -22, 30, 16, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = "#F5DEB3";
      [
        [-8, -28],
        [0, -30],
        [8, -28],
        [-4, -26],
        [4, -26],
      ].forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.ellipse(sx, sy, 2.5, 1.5, 0.3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = "#8B4513";
      ctx.beginPath();
      ctx.ellipse(0, -14, 28, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6DBF5A";
      ctx.beginPath();
      ctx.ellipse(0, -8, 30, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#E74C3C";
      ctx.beginPath();
      ctx.ellipse(0, -4, 26, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#D4922E";
      ctx.beginPath();
      ctx.ellipse(0, 2, 28, 8, 0, 0, Math.PI);
      ctx.fill();
      ctx.restore();
    }

    function loop() {
      ctx.clearRect(0, 0, 680, 280);
      tRef.current += 0.1;
      drawRunner(240, 190, tRef.current);
      drawBurger(400, 175, tRef.current);
      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);

    // 언마운트 시 애니메이션 정지
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <canvas
        ref={canvasRef}
        width={680}
        height={280}
        style={{ width: "100%", maxWidth: "340px" }}
      />
      <p className="text-sm text-gray-400 mt-2">{text}</p>
    </div>
  );
}
