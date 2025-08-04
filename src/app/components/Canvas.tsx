"use client";
import { useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://draw-together-r7ne.onrender.com";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startDrawing = (e: MouseEvent) => {
      drawing.current = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      // Отправляем начало линии
      socketRef.current?.emit("draw", {
        type: "begin",
        x: e.offsetX,
        y: e.offsetY,
      });
    };
    const draw = (e: MouseEvent) => {
      if (!drawing.current) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      // Отправляем координаты линии
      socketRef.current?.emit("draw", {
        type: "draw",
        x: e.offsetX,
        y: e.offsetY,
      });
    };
    const stopDrawing = () => {
      drawing.current = false;
      ctx.closePath();
      // Можно отправить событие окончания линии (опционально)
    };
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    // Получаем события от других пользователей
    const handleRemoteDraw = (data: any) => {
      if (!ctx) return;
      if (data.type === "begin") {
        ctx.beginPath();
        ctx.moveTo(data.x, data.y);
      } else if (data.type === "draw") {
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
      }
    };
    socketRef.current?.on("draw", handleRemoteDraw);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      socketRef.current?.off("draw", handleRemoteDraw);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border border-gray-300 bg-white rounded shadow"
    />
  );
};

export default Canvas;
