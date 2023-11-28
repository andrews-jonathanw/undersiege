'use client';
import { useRef, useEffect, useState } from 'react';

const getRandomPosition = (canvas, objectWidth, objectHeight, excludeArea) => {
  let x, y;
  do {
    x = Math.random() * (canvas.width * 2.5 - objectWidth);
    y = Math.random() * (canvas.height * 2.5 - objectHeight);
  } while (
    x > excludeArea.x - objectWidth - 20 &&
    x < excludeArea.x + excludeArea.width + 20 &&
    y > excludeArea.y - objectHeight - 20 &&
    y < excludeArea.y + excludeArea.height + 20
  );
  return { x, y };
};

const drawResourceNode = (ctx, node) => {
  ctx.fillStyle = node.color;
  ctx.beginPath();
  if (node.type === 'forest') {
    ctx.arc(node.position.x, node.position.y, 15, 0, 2 * Math.PI);
  } else {
    ctx.rect(node.position.x, node.position.y, 20, 20);
  }
  ctx.fill();
};

const drawCastle = (ctx, canvas) => {
  const castleWidth = 140;
  const castleHeight = 80;
  const x = (canvas.width * 2 - castleWidth) / 2;
  const y = (canvas.height * 2 - castleHeight) / 2;
  ctx.fillStyle = 'gray';
  ctx.fillRect(x, y, castleWidth, castleHeight);
};

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const [resourceNodes, setResourceNodes] = useState([]);
  const maxCanvasWidth = 1600;
  const maxCanvasHeight = 900;
  const [translation, setTranslation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(.5); // Zoom state

  const drawResources = (ctx, nodes) => {
    nodes.forEach(node => {
      drawResourceNode(ctx, node);
    });
  };

  const initResourceNodes = () => {
    const nodes = [];
    const canvas = canvasRef.current;
    const castleArea = { x: canvas.width / 2 - 50, y: canvas.height / 2 - 30, width: 100, height: 60 };
    for (let i = 0; i < 2; i++) {
      nodes.push({
        type: 'forest',
        position: getRandomPosition(canvas, 30, 30, castleArea),
        color: 'green',
        depleted: false,
        quantity: 100,
      });
      nodes.push({
        type: 'rock',
        position: getRandomPosition(canvas, 20, 20, castleArea),
        color: 'brown',
        depleted: false,
        quantity: 100,
      });
      nodes.push({
        type: 'iron',
        position: getRandomPosition(canvas, 20, 20, castleArea),
        color: 'silver',
        depleted: false,
        quantity: 100,
      })
      nodes.push({
        type: 'vegatables',
        position: getRandomPosition(canvas, 20, 20, castleArea),
        color: 'yellow',
        depleted: false,
        quantity: 100,
      })
      nodes.push({
        type: 'meat',
        position: getRandomPosition(canvas, 20, 20, castleArea),
        color: 'red',
        depleted: false,
        quantity: 100,
      })
      nodes.push({
        type: 'water',
        position: getRandomPosition(canvas, 20, 20, castleArea),
        color: 'blue',
        depleted: false,
        quantity: 100,
      })
    }
    return nodes;
  };

  useEffect(() => {
    setResourceNodes(initResourceNodes());
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = maxCanvasWidth;
      canvas.height = maxCanvasHeight;
      drawResources(ctx, resourceNodes);
      drawCastle(ctx, canvas);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resourceNodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const gameLoop = () => {
      // Reset transformations and clear the canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply translation and zoom transformations
      ctx.translate(translation.x, translation.y);
      ctx.scale(zoom, zoom);

      // Draw your resources and castle
      drawResources(ctx, resourceNodes);
      drawCastle(ctx, canvas);
      requestAnimationFrame(gameLoop);
    };
    requestAnimationFrame(gameLoop);
  }, [translation, zoom, resourceNodes]);

  const handleKeyDown = (e) => {
    const stepSize = 100; // Smaller step for smoother movement
    const zoomStep = 0.1; // Control the rate of zoom
    switch (e.key) {
      case 'ArrowUp':
        setTranslation(t => ({ x: t.x, y: t.y + stepSize }));
        break;
      case 'ArrowDown':
        setTranslation(t => ({ x: t.x, y: t.y - stepSize }));
        break;
      case 'ArrowLeft':
        setTranslation(t => ({ x: t.x + stepSize, y: t.y }));
        break;
      case 'ArrowRight':
        setTranslation(t => ({ x: t.x - stepSize, y: t.y }));
        break;
      case 'z': // Zoom in
        setZoom(z => Math.min(z + zoomStep, 5)); // Limit maximum zoom
        break;
      case 'x': // Zoom out
        setZoom(z => Math.max(z - zoomStep, 0.5)); // Limit minimum zoom
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        maxWidth: `${maxCanvasWidth}px`,
        maxHeight: `${maxCanvasHeight}px`,
      }}
    />
  );
};

export default GameCanvas;


