'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LuChevronLeft,
  LuChevronRight,
  LuSearch,
} from 'react-icons/lu';
import { useAppLocale } from '@/lib/i18n/LocaleProvider';

const AUTO_INTERVAL = 6200;
const TRANSITION_MS = 1500;

type RippleCenter = {
  x: number;
  y: number;
};

const heroImages = [
  { image: 'hero0cover-1.webp', altKey: 'slide1Alt' as const },
  { image: 'hero0cover-2.webp', altKey: 'slide2Alt' as const },
  { image: 'hero0cover-4.webp', altKey: 'slide3Alt' as const },
];

const autoRippleCenters: RippleCenter[] = [
  { x: 0.18, y: 0.28 },
  { x: 0.78, y: 0.34 },
  { x: 0.56, y: 0.72 },
];

type WebGlHeroSliderProps = {
  images: typeof heroImages;
  enabled: boolean;
  visible: boolean;
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
  const float PUSH_AMOUNT = 0.11;

  vec2 coverUv(vec2 uv, vec2 imageResolution) {
    vec2 scale = u_resolution / imageResolution;
    float cover = max(scale.x, scale.y);
    vec2 displaySize = imageResolution * cover;
    vec2 offset = (displaySize - u_resolution) / (2.0 * displaySize);
    vec2 ratio = u_resolution / displaySize;
    return uv * ratio + offset;
  }

  void main() {
    vec2 uv = v_uv;
    vec2 p = uv - u_center;
    float aspect = u_resolution.x / u_resolution.y;
    p.x *= aspect;

    float distanceFromCenter = length(p);
    float maxDistance = length(vec2(max(u_center.x, 1.0 - u_center.x) * aspect, max(u_center.y, 1.0 - u_center.y)));
    float normalizedDistance = clamp(distanceFromCenter / maxDistance, 0.0, 1.0);

    // A pair of broad waves keeps the organic edge without 32 noise hashes per pixel.
    float organicWave = sin(p.x * 17.0 + u_progress * 4.0) * sin(p.y * 13.0 - u_progress * 3.0);
    float warpedDistance = normalizedDistance + organicWave * 0.027 * smoothstep(0.0, 0.08, u_progress);

    float waveFront = u_progress * WAVE_SPEED;
    float delta = warpedDistance - waveFront;
    float baseEnvelope = 1.0 - smoothstep(0.0, WAVE_WIDTH * 2.0, abs(delta));
    float rippleBands = 0.62 + 0.38 * max(0.0, cos(delta * WAVE_FREQ));
    float envelope = baseEnvelope * rippleBands;
    envelope *= smoothstep(0.0, 0.07, u_progress) * (1.0 - smoothstep(0.84, 1.0, u_progress));

    vec2 direction = distanceFromCenter > 0.001 ? normalize(p) : vec2(0.0);
    vec2 offset = direction * envelope * PUSH_AMOUNT;
    offset.x /= aspect;

    vec4 fromColor = texture2D(u_from, coverUv(uv - offset * 0.45, u_fromResolution));
    vec4 toColor = texture2D(u_to, coverUv(uv - offset, u_toResolution));

    float feather = 0.065;
    float reveal = 1.0 - smoothstep(waveFront - feather, waveFront + feather, warpedDistance);
    reveal *= smoothstep(0.0, 0.05, u_progress);

    vec4 color = mix(fromColor, toColor, reveal);
    color.rgb += vec3(0.92, 0.76, 0.34) * envelope * 0.12;
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
    if (vertexShader) gl.deleteShader(vertexShader);
    if (fragmentShader) gl.deleteShader(fragmentShader);
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

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
  enabled,
  visible,
  fromIndex,
  toIndex,
  transitionId,
  rippleCenter,
  reducedMotion,
}: WebGlHeroSliderProps) => {
  const tHero = useTranslations('hero');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

    if (!canvas || reducedMotion || !enabled) {
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
      gl.deleteProgram(program);
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
          image.src = `/${slide.image}`;
        }),
    );

    let textures: WebGLTexture[] = [];
    let resizeObserver: ResizeObserver | undefined;

    Promise.all(imagePromises)
      .then((loadedImages) => {
        if (cancelled) {
          return;
        }

        const uploadedTextures = loadedImages.map((image) => createTexture(gl, image));

        if (uploadedTextures.some((texture) => !texture)) {
          uploadedTextures.forEach((texture) => { if (texture) gl.deleteTexture(texture); });
          return;
        }
        textures = uploadedTextures as WebGLTexture[];

        const resize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 0.85 : 1);
          const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
          const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));

          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);
            renderRef.current?.(1, latestIndices.current.to, latestIndices.current.to, latestRippleCenter.current);
          }
        };
        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        renderRef.current = (progress, from, to, center) => {
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
      resizeObserver?.disconnect();
      renderRef.current = null;
      textures.forEach((texture) => gl.deleteTexture(texture));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      setWebGlReady(false);
    };
  }, [enabled, images, reducedMotion]);

  useEffect(() => {
    if (!renderRef.current || reducedMotion) {
      return undefined;
    }

    if (!visible || transitionId === 0) {
      renderRef.current(1, toIndex, toIndex, rippleCenter);
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
  }, [fromIndex, reducedMotion, rippleCenter, toIndex, transitionId, visible]);

  return (
    <>
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          webGlReady && !reducedMotion ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url(/${images[toIndex].image})` }}
        role="img"
        aria-label={tHero(images[toIndex].altKey)}
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
  const t = useTranslations('hero');
  const { locale } = useAppLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fromIndex, setFromIndex] = useState(0);
  const [transitionId, setTransitionId] = useState(0);
  const [rippleCenter, setRippleCenter] = useState<RippleCenter>(autoRippleCenters[0]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [effectsEnabled, setEffectsEnabled] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);

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
    if (prefersReducedMotion || effectsEnabled || !isHeroVisible) return;
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => setEffectsEnabled(true));
      return () => window.cancelIdleCallback(idleId);
    }
    const timeoutId = setTimeout(() => setEffectsEnabled(true), 2500);
    return () => clearTimeout(timeoutId);
  }, [effectsEnabled, isHeroVisible, prefersReducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setIsHeroVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsPageVisible(document.visibilityState === 'visible');
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  const autoAdvance = !prefersReducedMotion && effectsEnabled && isHeroVisible && isPageVisible;

  useEffect(() => {
    if (!autoAdvance) {
      return undefined;
    }

    const interval = setInterval(() => {
      goToSlide(activeIndex + 1);
    }, AUTO_INTERVAL);

    return () => clearInterval(interval);
  }, [activeIndex, autoAdvance, goToSlide]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#082F50]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="corner-frame relative min-h-[clamp(34rem,72dvh,46rem)] w-full overflow-hidden bg-[#082F50] shadow-[0_24px_72px_rgba(8,47,80,0.18)]">
        <WebGlHeroSlider
          images={heroImages}
          enabled={effectsEnabled}
          visible={isHeroVisible && isPageVisible}
          fromIndex={fromIndex}
          toIndex={activeIndex}
          transitionId={transitionId}
          rippleCenter={rippleCenter}
          reducedMotion={prefersReducedMotion}
        />

        <div className="hero-image-overlay pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-1.5 brass-gradient" aria-hidden />

        <div className="relative z-10 mx-auto grid min-h-[clamp(34rem,72dvh,46rem)] max-w-6xl items-end gap-8 px-5 pb-20 pt-6 sm:items-center sm:px-8 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">

          <div className="hero-copy w-full max-w-[38rem] justify-self-start text-start text-white">
            <div className="mb-2 flex items-center gap-3 sm:mb-6">
              <Image
                src="/logo-3d-3d.png"
                alt={t('logoAlt')}
                width={420}
                height={420}
                className="h-12 w-12 object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)] sm:h-20 sm:w-24"
                priority
              />
            </div>

            <div className="w-full max-w-full">
              <h1 className="font-academic text-[clamp(1.5rem,3.3vw,3rem)] font-bold leading-[1.2] whitespace-nowrap text-white">
                <span className="text-[#F2D37A]">{t('titleAccent')}</span>
                <span className="ms-2">{t('titleRest')}</span>
              </h1>

              <p className="mt-2 max-w-[58ch] text-pretty font-academic text-sm leading-6 text-white/95 sm:mt-5 sm:text-lg sm:leading-[1.65] lg:text-xl">
                {t('subtitle')}
              </p>
            </div>

            <div className="mt-5 flex flex-col items-start gap-2 sm:mt-8 sm:flex-row sm:items-stretch sm:gap-3">
              <Link
                href="#latest-pub"
                className="engraved brass-gradient inline-flex h-12 w-full max-w-[15rem] cursor-pointer items-center justify-center gap-3 rounded-full border border-[#C29C41] px-5 text-center text-sm font-bold text-[#082F50] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_22px_rgba(194,156,65,0.22)] transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#082F50] sm:w-auto sm:max-w-none sm:px-7"
              >
                {t('browsePublications')}
                <LuChevronLeft className="h-4 w-4" />
              </Link>

              <Link
                href="#projects"
                className="inline-flex h-12 w-full max-w-[15rem] cursor-pointer items-center justify-center gap-3 rounded-full border border-white/65 bg-[#082F50]/35 px-5 text-center text-sm font-bold text-white transition duration-300 hover:border-[#E8C96A] hover:bg-[#082F50]/60 focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#082F50] sm:w-auto sm:max-w-none sm:px-7"
              >
                {t('searchBySector')}
                <LuSearch className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-5 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-between gap-4 sm:flex">
          <button
            type="button"
            aria-label={t('prevSlide')}
            onClick={() => goToSlide(activeIndex - 1, { x: 0.16, y: 0.5 })}
            className="pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-white/14 text-white backdrop-blur-md transition duration-300 hover:border-[#C29C41] hover:bg-white/24 focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <LuChevronRight className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label={t('nextSlide')}
            onClick={() => goToSlide(activeIndex + 1, { x: 0.84, y: 0.5 })}
            className="pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-white/14 text-white backdrop-blur-md transition duration-300 hover:border-[#C29C41] hover:bg-white/24 focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
          >
            <LuChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-center gap-4">

          <button
            type="button"
            aria-label={t('prevSlide')}
            onClick={() => goToSlide(activeIndex - 1, { x: 0.16, y: 0.5 })}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-white/14 text-white backdrop-blur-md transition duration-300 hover:border-[#C29C41] hover:bg-white/24 focus:outline-none focus:ring-2 focus:ring-[#C29C41] sm:hidden"
          >
            <LuChevronRight className="h-5 w-5" />
          </button>


          <div className="flex w-full max-w-md items-center justify-center gap-2 px-2 sm:px-6" aria-label={t('slidesLabel')}>
            {heroImages.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                aria-label={`${t('showSlide')} ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => goToSlide(index, { x: 0.5, y: 0.9 })}
                className="hero-progress-segment h-1.5 max-w-28 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/24 transition duration-300 hover:bg-white/38 focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
              >
                <span
                  key={`${transitionId}-${index}`}
                  className={index === activeIndex ? (autoAdvance ? 'hero-progress-fill is-active' : 'hero-progress-fill is-selected') : 'hero-progress-fill'}
                  style={{ animationDuration: `${AUTO_INTERVAL}ms` }}
                />
              </button>
            ))}
          </div>
              <button
            type="button"
            aria-label={t('nextSlide')}
            onClick={() => goToSlide(activeIndex + 1, { x: 0.84, y: 0.5 })}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-white/14 text-white backdrop-blur-md transition duration-300 hover:border-[#C29C41] hover:bg-white/24 focus:outline-none focus:ring-2 focus:ring-[#C29C41] sm:hidden"
          >
            <LuChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
