'use client';

import confetti from 'canvas-confetti';

export function useConfetti() {
  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d3cbc2', '#b8af9f', '#22c55e', '#fbbf24'],
    });
  };

  const fireSuccessConfetti = () => {
    const end = Date.now() + 500;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#d3cbc2', '#22c55e'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#d3cbc2', '#22c55e'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  return { fireConfetti, fireSuccessConfetti };
}
