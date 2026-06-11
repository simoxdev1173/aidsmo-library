'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LuChevronLeft,
  LuChevronRight,
  LuSearch,
} from 'react-icons/lu';

const AUTO_INTERVAL = 6200;
const TRANSITION_MS = 1500;

type RippleCenter = {
  x: number;
  y: number;
};

const heroContent = {
  
  title: 'المكتبة الرقمية الذكية',
  subtitle:
    'منصة رقمية عربية متخصصة تعنى بجمع وتنظيم وإتاحة الدراسات الفنية والأبحاث العلمية التي تزخر بها المنظمة في مجالات الصناعة والتقييس والتعدين.',
};

const heroImages = [
  {
    image:
      'hero0cover-1.png',
    alt: 'رفوف مكتبة حديثة مليئة بالكتب',
  },
  {
    image:
      'hero0cover-2.png',
    alt: 'ممر مكتبة جامعية مع رفوف كتب عالية',
  },
  {
    image:
      'hero0cover-4.png',
    alt: 'كتاب مفتوح على مكتب بحث هادئ',
  },
];

const autoRippleCenters: RippleCenter[] = [
  { x: 0.18, y: 0.28 },
  { x: 0.78, y: 0.34 },
  { x: 0.56, y: 0.72 },
];

type WebGlHeroSliderProps = {
  images: typeof heroImages;
  fromIndex: number;
  toIndex: number;
  transitionId: number;
  rippleCenter: RippleCenter;
  reducedMotion: boolean;
};

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = vec2((a_position.x + 1.0) * 0.5, 1.0 - ((a_position.y + 1.0) * 0.5));
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform sampler2D u_from;
  uniform sampler2D u_to;
  uniform vec2 u_resolution;
  uniform vec2 u_fromResolution;
  uniform vec2 u_toResolution;
  uniform vec2 u_center;
  uniform float u_progress;
  varying vec2 v_uv;

  const float WAVE_SPEED = 1.62;
  const float WAVE_WIDTH = 0.15;
  const float WAVE_FREQ = 30.0;
  const float PUSH_AMOUNT = 0.12;
  const float CA_STRENGTH = 0.018;
  const float GLOW_AMOUNT = 0.58;
  const float NOISE_WARP = 0.34;

  vec2 coverUv(vec2 uv, vec2 imageResolution) {
    vec2 scale = u_resolution / imageResolution;
    float cover = max(scale.x, scale.y);
    vec2 displaySize = imageResolution * cover;
    vec2 offset = (displaySize - u_resolution) / (2.0 * displaySize);
    vec2 ratio = u_resolution / displaySize;
    return uv * ratio + offset;
  }

  float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 4; i++) {
      value += amplitude * vnoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = v_uv;
    vec2 p = uv - u_center;
    float aspect = u_resolution.x / u_resolution.y;
    p.x *= aspect;

    float distanceFromCenter = length(p);
    float maxDistance = length(vec2(max(u_center.x, 1.0 - u_center.x) * aspect, max(u_center.y, 1.0 - u_center.y)));
    float normalizedDistance = clamp(distanceFromCenter / maxDistance, 0.0, 1.0);

    float noiseLarge = fbm(p * 4.0 + vec2(u_progress, u_progress * 0.5));
    float noiseSmall = fbm(p * 13.0 + vec2(u_progress * 2.0, -u_progress * 1.45));
    float warpScale = smoothstep(0.0, 0.06, u_progress);
    float warpedDistance = normalizedDistance
      + (noiseLarge - 0.5) * NOISE_WARP * warpScale
      + (noiseSmall - 0.5) * NOISE_WARP * 0.72 * warpScale;

    float waveFront = u_progress * WAVE_SPEED;
    float delta = warpedDistance - waveFront;
    float baseEnvelope = exp(-(delta * delta) / (2.0 * WAVE_WIDTH * WAVE_WIDTH));
    float rippleBands = 0.62 + 0.38 * max(0.0, cos(delta * WAVE_FREQ));
    float envelope = baseEnvelope * rippleBands;
    envelope *= smoothstep(0.0, 0.07, u_progress) * (1.0 - smoothstep(0.84, 1.0, u_progress));

    vec2 direction = distanceFromCenter > 0.001 ? normalize(p) : vec2(0.0);
    vec2 offset = direction * envelope * PUSH_AMOUNT;
    offset.x /= aspect;

    vec2 chromaOffset = direction * envelope * CA_STRENGTH;
    chromaOffset.x /= aspect;

    vec2 fromUvR = coverUv(uv - offset * 0.45 - chromaOffset * 0.32, u_fromResolution);
    vec2 fromUvG = coverUv(uv - offset * 0.45, u_fromResolution);
    vec2 fromUvB = coverUv(uv - offset * 0.45 + chromaOffset * 0.32, u_fromResolution);
    vec2 toUvR = coverUv(uv - offset - chromaOffset, u_toResolution);
    vec2 toUvG = coverUv(uv - offset, u_toResolution);
    vec2 toUvB = coverUv(uv - offset + chromaOffset, u_toResolution);

    vec4 fromColor = vec4(
      texture2D(u_from, fromUvR).r,
      texture2D(u_from, fromUvG).g,
      texture2D(u_from, fromUvB).b,
      1.0
    );
    vec4 toColor = vec4(
      texture2D(u_to, toUvR).r,
      texture2D(u_to, toUvG).g,
      texture2D(u_to, toUvB).b,
      1.0
    );

    float feather = 0.045 + 0.045 * noiseLarge;
    float reveal = 1.0 - smoothstep(waveFront - feather, waveFront + feather, warpedDistance);
    reveal *= smoothstep(0.0, 0.05, u_progress);

    vec4 color = mix(fromColor, toColor, reveal);
    float glow = envelope * GLOW_AMOUNT;
    color.rgb = clamp(color.rgb / max(1.0 - glow, 0.01), 0.0, 1.0);
    color.rgb += vec3(0.92, 0.76, 0.34) * envelope * 0.08;
    gl_FragColor = vec4(clamp(color.rgb, 0.0, 1.0), 1.0);
  }
`;

function easeInOutQuad(progress: number) {
  return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function createTexture(gl: WebGLRenderingContext, image: HTMLImageElement) {
  const texture = gl.createTexture();

  if (!texture) {
    return null;
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  return texture;
}

const WebGlHeroSlider = ({
  images,
  fromIndex,
  toIndex,
  transitionId,
  rippleCenter,
  reducedMotion,
}: WebGlHeroSliderProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const renderRef = useRef<((progress: number, from: number, to: number, center: RippleCenter) => void) | null>(null);
  const animationFrame = useRef<number | null>(null);
  const latestIndices = useRef({ from: fromIndex, to: toIndex });
  const latestRippleCenter = useRef(rippleCenter);
  const [webGlReady, setWebGlReady] = useState(false);

  latestIndices.current = { from: fromIndex, to: toIndex };
  latestRippleCenter.current = rippleCenter;

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;

    if (!canvas || reducedMotion) {
      return undefined;
    }

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });

    if (!gl) {
      return undefined;
    }

    const program = createProgram(gl);

    if (!program) {
      return undefined;
    }

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const progressLocation = gl.getUniformLocation(program, 'u_progress');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const fromResolutionLocation = gl.getUniformLocation(program, 'u_fromResolution');
    const toResolutionLocation = gl.getUniformLocation(program, 'u_toResolution');
    const centerLocation = gl.getUniformLocation(program, 'u_center');
    const fromLocation = gl.getUniformLocation(program, 'u_from');
    const toLocation = gl.getUniformLocation(program, 'u_to');
    const buffer = gl.createBuffer();

    if (!buffer) {
      return undefined;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const imagePromises = images.map(
      (slide) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new window.Image();
          image.crossOrigin = 'anonymous';
          image.decoding = 'async';
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = slide.image;
        }),
    );

    Promise.all(imagePromises)
      .then((loadedImages) => {
        if (cancelled) {
          return;
        }

        const textures = loadedImages.map((image) => createTexture(gl, image));

        if (textures.some((texture) => !texture)) {
          return;
        }

        const resize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
          const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));

          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }

          gl.viewport(0, 0, width, height);
        };

        renderRef.current = (progress, from, to, center) => {
          resize();
          gl.useProgram(program);
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.enableVertexAttribArray(positionLocation);
          gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
          gl.uniform1f(progressLocation, progress);
          gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
          gl.uniform2f(fromResolutionLocation, loadedImages[from].naturalWidth, loadedImages[from].naturalHeight);
          gl.uniform2f(toResolutionLocation, loadedImages[to].naturalWidth, loadedImages[to].naturalHeight);
          gl.uniform2f(centerLocation, center.x, center.y);
          gl.uniform1i(fromLocation, 0);
          gl.uniform1i(toLocation, 1);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, textures[from]);
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, textures[to]);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        };

        glRef.current = gl;
        renderRef.current(1, latestIndices.current.to, latestIndices.current.to, latestRippleCenter.current);
        setWebGlReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setWebGlReady(false);
        }
      });

    return () => {
      cancelled = true;

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [images, reducedMotion]);

  useEffect(() => {
    if (!renderRef.current || reducedMotion) {
      return undefined;
    }

    const start = performance.now();

    const animate = (now: number) => {
      const linearProgress = Math.min((now - start) / TRANSITION_MS, 1);
      const progress = easeInOutQuad(linearProgress);
      renderRef.current?.(progress, fromIndex, toIndex, rippleCenter);

      if (linearProgress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [fromIndex, reducedMotion, rippleCenter, toIndex, transitionId]);

  return (
    <>
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          webGlReady && !reducedMotion ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url(${images[toIndex].image})` }}
        role="img"
        aria-label={images[toIndex].alt}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full ${webGlReady && !reducedMotion ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />
    </>
  );
};

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fromIndex, setFromIndex] = useState(0);
  const [transitionId, setTransitionId] = useState(0);
  const [rippleCenter, setRippleCenter] = useState<RippleCenter>(autoRippleCenters[0]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const goToSlide = useCallback(
    (targetIndex: number, center?: RippleCenter) => {
      const nextIndex = (targetIndex + heroImages.length) % heroImages.length;

      if (nextIndex === activeIndex) {
        return;
      }

      setFromIndex(activeIndex);
      setRippleCenter(center ?? autoRippleCenters[nextIndex % autoRippleCenters.length]);
      setActiveIndex(nextIndex);
      setTransitionId((current) => current + 1);
    },
    [activeIndex],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined;
    }

    const interval = setInterval(() => {
      goToSlide(activeIndex + 1);
    }, AUTO_INTERVAL);

    return () => clearInterval(interval);
  }, [activeIndex, goToSlide, prefersReducedMotion]);

  return (
    <section className="relative overflow-hidden bg-[#0A2540] pt-24 md:pt-28" dir="rtl">
      <div className="corner-frame relative min-h-[760px] w-full overflow-hidden bg-[#0A2540] shadow-[0_28px_90px_rgba(10,37,64,0.2)]">
        <WebGlHeroSlider
          images={heroImages}
          fromIndex={fromIndex}
          toIndex={activeIndex}
          transitionId={transitionId}
          rippleCenter={rippleCenter}
          reducedMotion={prefersReducedMotion}
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,37,64,0.04)_0%,rgba(10,37,64,0.42)_44%,rgba(10,37,64,0.78)_100%)]" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(232,201,106,0.2),transparent_28%),radial-gradient(circle_at_76%_82%,rgba(14,165,233,0.1),transparent_30%)]" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-1.5 brass-gradient" aria-hidden />

        <div className="relative z-10 mx-auto grid min-h-[760px] max-w-7xl items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-14">
     
          <div className="max-w-2xl justify-self-end text-white">
            <div className="mb-8 flex items-center gap-4">
              <Image
                src="/logo-4.png"
                alt="المكتبة الرقمية"
                width={120}
                height={120}
                className="h-20 w-20 object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)] md:h-24 md:w-24"
                priority
              />
           
              
            </div>

            <h1 className="font-academic text-5xl font-bold leading-[1.1] text-white md:text-6xl lg:text-7xl">
             
             <div className='text-nowrap'>
               <span className=" text-[#E8C96A]">المكتبة الرقمية</span>
              <span className="text-white pr-3">الذكية</span>
              </div>
            </h1>

            <p className="mt-8 max-w-2xl font-academic text-xl leading-[2.05] text-white/86 md:text-2xl">
              {heroContent.subtitle}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#latest-pub"
                className="engraved brass-gradient inline-flex h-12 cursor-pointer items-center justify-center gap-3 rounded-full border border-[#C29C41] px-7 text-sm font-bold text-[#0A2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_22px_rgba(194,156,65,0.22)] transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#0A2540]"
              >
                تصفح الإصدارات
                <LuChevronLeft className="h-4 w-4" />
              </Link>

              <Link
                href="#about"
                className="inline-flex h-12 cursor-pointer items-center justify-center gap-3 rounded-full border-2 border-white/42 bg-white/12 px-7 text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:border-[#C29C41] hover:bg-white/22 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#0A2540]"
              >
                البحث حسب القطاع
                <LuSearch className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-5 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between gap-4">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goToSlide(activeIndex - 1, { x: 0.16, y: 0.5 })}
            className="pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-white/14 text-white backdrop-blur-md transition duration-300 hover:border-[#C29C41] hover:bg-white/24 focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <LuChevronRight className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goToSlide(activeIndex + 1, { x: 0.84, y: 0.5 })}
            className="pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-white/14 text-white backdrop-blur-md transition duration-300 hover:border-[#C29C41] hover:bg-white/24 focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <LuChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-center gap-4">
          
          <button
            type="button"
            aria-label="الشريحة السابقة"
            onClick={() => goToSlide(activeIndex - 1, { x: 0.16, y: 0.5 })}
            className="hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-white/14 text-white backdrop-blur-md transition duration-300 hover:border-[#C29C41] hover:bg-white/24 focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <LuChevronRight className="h-5 w-5" />
          </button>
        

          <div className="flex w-full max-w-md items-center justify-center gap-2 px-2 sm:px-6" aria-label="شرائح العرض">
            {heroImages.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                aria-label={`عرض الصورة ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => goToSlide(index, { x: 0.5, y: 0.9 })}
                className="hero-progress-segment h-1.5 max-w-28 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/24 transition duration-300 hover:bg-white/38 focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
              >
                <span
                  key={`${transitionId}-${index}`}
                  className={index === activeIndex ? 'hero-progress-fill is-active' : 'hero-progress-fill'}
                  style={{ animationDuration: `${AUTO_INTERVAL}ms` }}
                />
              </button>
            ))}
          </div>
              <button
            type="button"
            aria-label="الشريحة التالية"
            onClick={() => goToSlide(activeIndex + 1, { x: 0.84, y: 0.5 })}
            className="hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-white/14 text-white backdrop-blur-md transition duration-300 hover:border-[#C29C41] hover:bg-white/24 focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <LuChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
