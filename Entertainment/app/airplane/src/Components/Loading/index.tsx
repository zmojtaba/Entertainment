import classes from "./style.module.scss";
import animationData from "@assets/lottieFiles/loading.json";
import Lottie from "lottie-react";
import FluidCanvas2 from "./Components/Smook";
import { useEffect, useRef } from "react";
import FluidCanvas from "./Components/Smooks";

type propsType = {
  loading: boolean;
  message?: string;
};

function LoadingComponets(props: propsType) {
  const { loading, message = "Please wait ..." } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // تنظیم سایز canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ایجاد دانه‌های برف
    const snowflakes: Array<{
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
      wind: number;
    }> = [];

    const createSnowflakes = () => {
      const count = Math.min(200, Math.floor(window.innerWidth / 10));
      for (let i = 0; i < count; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3,
          speed: Math.random() * 1 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          wind: Math.random() * 0.5,
        });
      }
    };
    createSnowflakes();

    // انیمیشن برف
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // تنظیم پس‌زمینه مشکی
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // رسم دانه‌های برف
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

      snowflakes.forEach((flake) => {
        // حرکت برف
        flake.y += flake.speed;
        flake.x += flake.wind * 0.5;

        // اگر از صفحه خارج شد، از بالا برگردد
        if (flake.y > canvas.height) {
          flake.y = 0;
          flake.x = Math.random() * canvas.width;
        }

        // اگر از چپ/راست خارج شد
        if (flake.x > canvas.width) flake.x = 0;
        if (flake.x < 0) flake.x = canvas.width;

        // رسم دانه برف
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      {loading ? (
        <>
          <canvas ref={canvasRef} className={classes.snow} />
          <div className={classes.container}>
            <div className={classes.panel}>
              <div className={classes.smook}>
                <FluidCanvas2 />
                {/* <FluidCanvas /> */}
              </div>
              <div className={classes.logo}>
                <Lottie
                  size={window.innerWidth <= 896 ? 50 : 100}
                  animationData={animationData}
                  loop
                  autoPlay
                />
                <span>{message}</span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default LoadingComponets;
