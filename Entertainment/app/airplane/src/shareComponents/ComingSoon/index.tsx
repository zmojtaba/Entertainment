import React, { useEffect, useRef } from 'react';
import classes from './style.module.scss';
import comingSoon from '@assets/images/soon.png';

function ComingSoon() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // تنظیم اندازه canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // آرایه دانه‌های برف
        interface Snowflake {
            x: number;
            y: number;
            radius: number;
            speed: number;
            opacity: number;
            wind: number;
        }

        const snowflakes: Snowflake[] = [];

        const createSnowflakes = () => {
            const count = Math.min(180, Math.floor(window.innerWidth / 8)); // تعداد مناسب برای موبایل
            snowflakes.length = 0; // پاک کردن قبلی‌ها

            for (let i = 0; i < count; i++) {
                snowflakes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.7 - canvas.height * 0.3, // پخش در بالا
                    radius: Math.random() * 2.8 + 0.8,
                    speed: Math.random() * 0.9 + 0.4,
                    opacity: Math.random() * 1,
                    wind: Math.random() * 0.4, // کمی به چپ و راست
                });
            }
        };

        createSnowflakes();

        let lastTime = performance.now();
        let rafId: number | null = null;

        const animate = (currentTime: number) => {
            rafId = requestAnimationFrame(animate);

            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            // محدود کردن delta برای جلوگیری از پرش زیاد بعد از مکث طولانی
            const delta = Math.min(deltaTime, 120); // حداکثر ~۸ فریم جبران

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // رسم دانه‌های برف
            snowflakes.forEach(flake => {
                // حرکت با توجه به زمان گذشته (delta)
                flake.y += flake.speed * (delta / 16.67); // نرمال‌سازی به ~60fps
                flake.x += flake.wind * (delta / 16.67);

                // برگرداندن به بالا وقتی از پایین خارج شد
                if (flake.y > canvas.height + flake.radius * 2) {
                    flake.y = -flake.radius * 2;
                    flake.x = Math.random() * canvas.width;
                }

                // چرخش افقی (wrap around)
                if (flake.x > canvas.width + flake.radius) flake.x = -flake.radius;
                if (flake.x < -flake.radius) flake.x = canvas.width + flake.radius;

                // رسم
                ctx.globalAlpha = flake.opacity;
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fill();
            });

            ctx.globalAlpha = 1;
        };

        // شروع انیمیشن
        rafId = requestAnimationFrame(animate);

        // مدیریت visibility change (وقتی صفحه دوباره دیده شد)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                lastTime = performance.now(); // جلوگیری از پرش بزرگ
                if (rafId === null) {
                    rafId = requestAnimationFrame(animate);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // cleanup
        return () => {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            window.removeEventListener('resize', resizeCanvas);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} className={classes.snow} />
            <div className={classes.container}>
                <img src={comingSoon} alt="Coming Soon" />
            </div>
        </>
    );
}

export default ComingSoon;