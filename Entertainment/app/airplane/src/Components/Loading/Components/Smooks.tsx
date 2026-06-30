// // @ts-nocheck
// import React, { useRef, useEffect } from "react";

// const FluidCanvas = () => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     canvas.width = canvas.clientWidth;
//     canvas.height = canvas.clientHeight;

//     const config = {
//       TEXTURE_DOWNSAMPLE: 1,
//       DENSITY_DISSIPATION: 0.965,     // دود غلیظ‌تر و ماندگارتر
//       VELOCITY_DISSIPATION: 0.98,
//       PRESSURE_DISSIPATION: 0.8,
//       PRESSURE_ITERATIONS: 40,
//       CURL: 15,                       // завихрения (حرکات چرخشی طبیعی)
//       SPLAT_RADIUS: 0.0011,
//     };

//     let pointers = [];
//     let splatStack = [];

//     // WebGL context
//     let gl, ext, support_linear_float;
//     ({ gl, ext, support_linear_float } = getWebGLContext(canvas));

//     function getWebGLContext(canvas) {
//       const params = { alpha: false, depth: false, stencil: false, antialias: false };
//       let gl = canvas.getContext("webgl2", params) || canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params);

//       let halfFloat = gl.getExtension("OES_texture_half_float");
//       support_linear_float = gl.getExtension("OES_texture_half_float_linear");

//       if (gl instanceof WebGL2RenderingContext) {
//         gl.getExtension("EXT_color_buffer_float");
//         support_linear_float = gl.getExtension("OES_texture_float_linear");
//       }

//       gl.clearColor(0.0, 0.0, 0.0, 1.0);
//       const isWebGL2 = gl instanceof WebGL2RenderingContext;
//       let internalFormat = isWebGL2 ? gl.RGBA16F : gl.RGBA;
//       let internalFormatRG = isWebGL2 ? gl.RG16F : gl.RGBA;
//       let formatRG = isWebGL2 ? gl.RG : gl.RGBA;
//       let texType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;

//       return { gl, ext: { internalFormat, internalFormatRG, formatRG, texType }, support_linear_float };
//     }

//     // Pointer Class (چند pointer)
//     class Pointer {
//       constructor() {
//         this.x = canvas.width * Math.random();
//         this.y = canvas.height * Math.random();
//         this.dx = 0;
//         this.dy = 0;
//         this.vx = 0;
//         this.vy = 0;
//         this.moved = true;
//         this.color = [1.0, 0.65 + Math.random() * 0.35, 0.25 + Math.random() * 0.3];
//       }
//     }

//     // ایجاد ۵ pointer رندوم
//     for (let i = 0; i < 5; i++) {
//       pointers.push(new Pointer());
//     }

//     // بقیه کد shader ها دقیقاً مثل کد خودت (کپی کن از کد اصلیت)
//     // برای کوتاه شدن، اینجا فقط تغییرات مهم رو می‌ذارم. 
//     // لطفاً تمام بخش‌های shader، GLProgram، createFBO و ... رو از کد اصلی خودت کپی کن.

//     // ... [تمام shaderها و برنامه‌ها مثل baseVertexShader تا gradientSubtractProgram] ...

//     // Framebuffers
//     let textureWidth, textureHeight, density, velocity, divergence, curl, pressure;
//     // ... توابع createFBO و createDoubleFBO و initFramebuffers مثل کد اصلیت ...

//     initFramebuffers();

//     const blit =0 /* ... همان blit کد اصلیت ... */;

//     // ==================== حرکت رندوم جدید (جایگزین بخش قدیمی) ====================
//     let lastTime = Date.now();
//     let simTime = 0;

//     function updatePointers(dt) {
//       pointers.forEach(p => {
//         // ترکیب نویز سینوسی + رندوم (طبیعی مثل دود)
//         const noiseX = Math.sin(simTime * 1.15 + p.x * 0.008) * 0.8 + (Math.random() - 0.5) * 0.7;
//         const noiseY = Math.cos(simTime * 1.45 + p.y * 0.009) * 0.75 + (Math.random() - 0.5) * 0.65;

//         p.vx += noiseX * 720 * dt;
//         p.vy += noiseY * 720 * dt;

//         p.vx *= 0.885;   // damping
//         p.vy *= 0.885;

//         p.x += p.vx * dt * 1.15;
//         p.y += p.vy * dt * 1.15;

//         // Bounce نرم از لبه‌ها
//         if (p.x < 0 || p.x > canvas.width) {
//           p.vx *= -0.75;
//           p.x = Math.max(20, Math.min(canvas.width - 20, p.x));
//         }
//         if (p.y < 0 || p.y > canvas.height) {
//           p.vy *= -0.75;
//           p.y = Math.max(20, Math.min(canvas.height - 20, p.y));
//         }

//         p.dx = p.vx * 9.5;
//         p.dy = p.vy * 9.5;
//         p.moved = true;
//       });
//     }

//     // Splat بهبود یافته
//     function splat(x, y, dx, dy, color) {
//       splatProgram.bind();
//       gl.uniform1i(splatProgram.uniforms.uTarget, velocity.first[2]);
//       gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
//       gl.uniform2f(splatProgram.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
//       gl.uniform3f(splatProgram.uniforms.color, dx * 1.8, -dy * 2.6, 0);
//       gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS * (0.7 + Math.random() * 0.8));
//       blit(velocity.second[1]);
//       velocity.swap();

//       // دود
//       gl.uniform1i(splatProgram.uniforms.uTarget, density.first[2]);
//       gl.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2]);
//       blit(density.second[1]);
//       density.swap();
//     }

//     // ==================== Main Loop ====================
//     function update() {
//       resizeCanvas();

//       const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
//       lastTime = Date.now();
//       simTime += dt;

//       gl.viewport(0, 0, textureWidth, textureHeight);

//       updatePointers(dt);   // ← حرکت رندوم جدید

//       // اعمال splat ها
//       pointers.forEach(p => {
//         if (p.moved) {
//           splat(p.x, p.y, p.dx, p.dy, p.color);
//           p.moved = Math.random() > 0.08; // کمی فاصله برای طبیعی‌تر شدن
//         }
//       });

//       // بقیه pipeline (advection, curl, vorticity, pressure و ...) 
//       // دقیقاً مثل کد اصلی خودت کپی کن

//       // display
//       gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
//       displayProgram.bind();
//       gl.uniform1i(displayProgram.uniforms.uTexture, density.first[2]);
//       blit(null);

//       requestAnimationFrame(update);
//     }

//     update();

//     return () => cancelAnimationFrame(update);
//   }, []);

//   return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
// };

// export default FluidCanvas;
import React from 'react'

function Smooks() {
  return (
    <div>Smooks</div>
  )
}

export default Smooks