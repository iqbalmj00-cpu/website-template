"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export type DumpTrailerLoadKey = "eighth" | "quarter" | "half" | "threeQuarter" | "full" | "multi";

type VisualLoadKey = Exclude<DumpTrailerLoadKey, "multi">;

export type TrailerDimensions = {
  length: string;
  width: string;
  height: string;
  capacity?: string;
};

export type DumpTrailerLoadVisualizerProps = {
  selectedLoad: DumpTrailerLoadKey;
  companyName: string;
  brandColor: string;
  textColor?: string;
  trailerDimensions: TrailerDimensions;
  modelUrl: string;
  dracoDecoderPath?: string;
  multiLoadBadgeText?: string;
  className?: string;
  style?: CSSProperties;
};

type LoadOption = {
  key: VisualLoadKey;
  prefix: string;
};

type ViewOption = {
  key: "orbit" | "side" | "fullRig" | "rear" | "hitch" | "top";
  position: [number, number, number];
  target: [number, number, number];
};

type RuntimeLabelConfig = {
  companyName: string;
  brandColor: string;
  textColor: string;
  dimensions: TrailerDimensions;
};

const VISUAL_LOAD_OPTIONS: LoadOption[] = [
  { key: "eighth", prefix: "Junk_Eighth_Load" },
  { key: "quarter", prefix: "Junk_Quarter_Load" },
  { key: "half", prefix: "Junk_Half_Load" },
  { key: "threeQuarter", prefix: "Junk_ThreeQuarter_Load" },
  { key: "full", prefix: "Junk_Full_Load" },
];

const VIEW_OPTIONS: ViewOption[] = [
  { key: "orbit", position: [8.0, 3.3, 5.15], target: [3.55, 1.03, 0] },
  { key: "side", position: [3.75, 2.2, 7.6], target: [3.75, 1.04, 0] },
  { key: "fullRig", position: [0.0, 2.75, 20.0], target: [0.1, 1.0, 0] },
  { key: "rear", position: [7.45, 2.25, 1.25], target: [5.85, 1.0, 0] },
  { key: "hitch", position: [-0.45, 1.45, 4.3], target: [-0.35, 0.58, 0] },
  { key: "top", position: [0.8, 11.3, 0.2], target: [0.8, 0.25, 0] },
];

const VIEW_BY_KEY = Object.fromEntries(VIEW_OPTIONS.map((view) => [view.key, view])) as Record<ViewOption["key"], ViewOption>;

const DESKTOP_CAMERA_DISTANCE_SCALE: Record<ViewOption["key"], number> = {
  orbit: 1.16,
  side: 1.42,
  fullRig: 1.24,
  rear: 1.22,
  hitch: 1.14,
  top: 1.2,
};

const COMPACT_CAMERA_DISTANCE_SCALE: Record<ViewOption["key"], number> = {
  orbit: 1.26,
  side: 1.24,
  fullRig: 1.06,
  rear: 1.12,
  hitch: 1.08,
  top: 1.08,
};

const TRAILER_DIMENSIONS = {
  floorY: 0.72,
  wallHeight: 1.2192,
  sideZ: 1.23,
  lengthMeters: 4.8768,
  widthMeters: 2.1336,
};

function normalizeColor(value: string, fallback: string) {
  return /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim() : fallback;
}

function visualLoadFor(load: DumpTrailerLoadKey): VisualLoadKey {
  return load === "multi" ? "full" : load;
}

function pullCameraBack(position: THREE.Vector3, target: THREE.Vector3, scale: number) {
  const offset = position.clone().sub(target).multiplyScalar(scale);
  position.copy(target).add(offset);
}

function getCameraPose(compact: boolean) {
  const view = VIEW_BY_KEY.orbit;
  const position = new THREE.Vector3(...view.position);
  const target = new THREE.Vector3(...view.target);

  if (compact) {
    position.x *= 1.34;
    position.z *= 1.34;
    position.y = position.y * 1.08 + 0.35;
    target.y = Math.max(0.28, target.y - 0.48);
    pullCameraBack(position, target, COMPACT_CAMERA_DISTANCE_SCALE.orbit);
  } else {
    pullCameraBack(position, target, DESKTOP_CAMERA_DISTANCE_SCALE.orbit);
  }

  return { position, target };
}

function applyLoadVisibility(root: THREE.Object3D, loadKey: VisualLoadKey) {
  root.traverse((object) => {
    const matchedLoad = VISUAL_LOAD_OPTIONS.find((load) => object.name.includes(load.prefix));
    if (matchedLoad) {
      object.visible = matchedLoad.key === loadKey;
    }
  });
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function createDimensionLabelTexture(text: string, config: RuntimeLabelConfig) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 144;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 250, 241, 0.94)";
  ctx.strokeStyle = config.brandColor;
  ctx.lineWidth = 5;
  drawRoundedRect(ctx, 14, 16, canvas.width - 28, canvas.height - 32, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#102018";
  ctx.font = "900 76px Aptos, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createCompanyNameTexture(text: string, config: RuntimeLabelConfig) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = config.textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;

  let fontSize = 100;
  const maxWidth = 980;
  do {
    ctx.font = `800 ${fontSize}px Aptos, Segoe UI, sans-serif`;
    fontSize -= 2;
  } while (ctx.measureText(text).width > maxWidth && fontSize > 42);

  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createGuideBar(
  name: string,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
) {
  const bar = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  bar.name = name;
  bar.position.set(...position);
  bar.renderOrder = 12;
  return bar;
}

function createDimensionSprite(
  name: string,
  text: string,
  position: [number, number, number],
  scale: [number, number, number],
  config: RuntimeLabelConfig,
) {
  const material = new THREE.SpriteMaterial({
    map: createDimensionLabelTexture(text, config),
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  material.name = "Material_Dimension_Text";
  const sprite = new THREE.Sprite(material);
  sprite.name = name;
  sprite.position.set(...position);
  sprite.scale.set(...scale);
  sprite.renderOrder = 18;
  return sprite;
}

function createCompanyNameDecal(config: RuntimeLabelConfig) {
  const group = new THREE.Group();
  group.name = "Decal_Back_CompanyName_Runtime";
  const companyName = config.companyName.trim();

  if (!companyName) {
    return group;
  }

  const textMaterial = new THREE.MeshBasicMaterial({
    map: createCompanyNameTexture(companyName, config),
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  textMaterial.name = "Material_Company_Text";

  const textPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.98, 0.5), textMaterial);
  textPlane.name = "Decal_Back_CompanyName_RuntimeText";
  textPlane.position.set(
    TRAILER_DIMENSIONS.lengthMeters / 2 + 0.13,
    TRAILER_DIMENSIONS.floorY + TRAILER_DIMENSIONS.wallHeight * 0.54,
    0.04,
  );
  textPlane.rotation.y = Math.PI / 2;
  textPlane.renderOrder = 19;
  group.add(textPlane);

  return group;
}

function createTrailerDimensionGuides(config: RuntimeLabelConfig) {
  const group = new THREE.Group();
  group.name = "Trailer_Exterior_Dimension_Guides";

  const lineMaterial = new THREE.MeshBasicMaterial({
    color: "#102018",
    transparent: true,
    opacity: 0.82,
    depthTest: false,
    depthWrite: false,
  });
  lineMaterial.name = "Material_Dimension_Text";

  const accentMaterial = new THREE.MeshBasicMaterial({
    color: config.brandColor,
    transparent: true,
    opacity: 0.96,
    depthTest: false,
    depthWrite: false,
  });
  accentMaterial.name = "Material_Dimension_Accent";

  const length = TRAILER_DIMENSIONS.lengthMeters;
  const width = TRAILER_DIMENSIONS.widthMeters;
  const halfLength = length / 2;
  const halfWidth = width / 2;
  const sideOffsetZ = TRAILER_DIMENSIONS.sideZ + 0.36;
  const rearOffsetX = halfLength + 0.32;
  const guideBaseY = TRAILER_DIMENSIONS.floorY - 0.14;
  const heightTopY = TRAILER_DIMENSIONS.floorY + TRAILER_DIMENSIONS.wallHeight;
  const heightCenterY = TRAILER_DIMENSIONS.floorY + TRAILER_DIMENSIONS.wallHeight / 2;

  group.add(createGuideBar("Dimension_Length_Line", [length, 0.018, 0.018], [0, guideBaseY, sideOffsetZ], lineMaterial));
  group.add(createGuideBar("Dimension_Length_Left_Tick", [0.018, 0.32, 0.018], [-halfLength, guideBaseY, sideOffsetZ], accentMaterial));
  group.add(createGuideBar("Dimension_Length_Right_Tick", [0.018, 0.32, 0.018], [halfLength, guideBaseY, sideOffsetZ], accentMaterial));
  group.add(createDimensionSprite("Dimension_Label_Length_RuntimeText", config.dimensions.length, [0, guideBaseY + 0.27, sideOffsetZ + 0.1], [1.05, 0.295, 1], config));

  group.add(createGuideBar("Dimension_Width_Line", [0.018, 0.018, width], [rearOffsetX, guideBaseY + 0.02, 0], lineMaterial));
  group.add(createGuideBar("Dimension_Width_Left_Tick", [0.018, 0.3, 0.018], [rearOffsetX, guideBaseY + 0.02, -halfWidth], accentMaterial));
  group.add(createGuideBar("Dimension_Width_Right_Tick", [0.018, 0.3, 0.018], [rearOffsetX, guideBaseY + 0.02, halfWidth], accentMaterial));
  group.add(createDimensionSprite("Dimension_Label_Width_RuntimeText", config.dimensions.width, [rearOffsetX + 0.18, guideBaseY + 0.28, 0], [0.92, 0.259, 1], config));

  group.add(createGuideBar("Dimension_Height_Line", [0.018, TRAILER_DIMENSIONS.wallHeight, 0.018], [rearOffsetX, heightCenterY, sideOffsetZ], lineMaterial));
  group.add(createGuideBar("Dimension_Height_Bottom_Tick", [0.3, 0.018, 0.018], [rearOffsetX, TRAILER_DIMENSIONS.floorY, sideOffsetZ], accentMaterial));
  group.add(createGuideBar("Dimension_Height_Top_Tick", [0.3, 0.018, 0.018], [rearOffsetX, heightTopY, sideOffsetZ], accentMaterial));
  group.add(createDimensionSprite("Dimension_Label_Height_RuntimeText", config.dimensions.height, [rearOffsetX - 0.34, heightCenterY + 0.32, sideOffsetZ + 0.08], [0.86, 0.242, 1], config));

  if (config.dimensions.capacity?.trim()) {
    group.add(createDimensionSprite("Dimension_Label_Capacity_RuntimeText", config.dimensions.capacity, [0, heightTopY + 0.46, sideOffsetZ + 0.1], [1.22, 0.343, 1], config));
  }

  return group;
}

function createRuntimeOverlay(config: RuntimeLabelConfig) {
  const group = new THREE.Group();
  group.name = "DumpTrailer_Runtime_Configurable_Labels";
  group.add(createTrailerDimensionGuides(config));
  group.add(createCompanyNameDecal(config));
  return group;
}

function tuneImportedMaterials(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) {
      return;
    }

    object.castShadow = true;
    object.receiveShadow = true;

    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (!material) {
        return;
      }

      const materialName = material.name.toLowerCase();
      if (materialName.includes("smoked") || materialName.includes("transparent")) {
        material.transparent = true;
        material.opacity = 0.32;
        material.depthWrite = false;
        material.side = THREE.DoubleSide;
      }
      material.needsUpdate = true;
    });
  });
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    if (object instanceof THREE.Sprite) {
      object.material.map?.dispose();
      object.material.dispose();
      return;
    }

    if (!(object instanceof THREE.Mesh)) {
      return;
    }

    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (material instanceof THREE.MeshBasicMaterial || material instanceof THREE.MeshStandardMaterial) {
        material.map?.dispose();
      }
      material.dispose();
    });
  });
}

export function DumpTrailerLoadVisualizer({
  selectedLoad,
  companyName,
  brandColor,
  textColor = "#fff7ea",
  trailerDimensions,
  modelUrl,
  dracoDecoderPath = "/draco/",
  multiLoadBadgeText = "1+ Load",
  className,
  style,
}: DumpTrailerLoadVisualizerProps) {
  const safeBrandColor = normalizeColor(brandColor, "#f0523d");
  const safeTextColor = normalizeColor(textColor, "#fff7ea");
  const visualLoadKey = visualLoadFor(selectedLoad);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const overlayRef = useRef<THREE.Object3D | null>(null);
  const selectedLoadRef = useRef<VisualLoadKey>(visualLoadKey);
  const requestRenderRef = useRef<() => void>(() => {});
  const labelConfigRef = useRef<RuntimeLabelConfig>({
    companyName,
    brandColor: safeBrandColor,
    textColor: safeTextColor,
    dimensions: trailerDimensions,
  });
  const compactViewportRef = useRef(false);
  const cameraGoalRef = useRef(getCameraPose(false));
  const cameraTransitionRef = useRef(false);

  const [isReady, setIsReady] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const rootClassName = useMemo(
    () => ["dtv-root", className].filter(Boolean).join(" "),
    [className],
  );

  const cssVars = useMemo(
    () => ({
      "--dtv-brand": safeBrandColor,
      "--dtv-text": safeTextColor,
    }) as CSSProperties,
    [safeBrandColor, safeTextColor],
  );

  const rebuildRuntimeOverlay = useCallback(() => {
    const model = modelRef.current;
    if (!model) {
      return;
    }

    if (overlayRef.current) {
      model.remove(overlayRef.current);
      disposeObject(overlayRef.current);
    }

    const overlay = createRuntimeOverlay(labelConfigRef.current);
    model.add(overlay);
    overlayRef.current = overlay;
  }, []);

  const setCameraGoal = useCallback(() => {
    const currentWidth = mountRef.current?.clientWidth ?? window.innerWidth;
    compactViewportRef.current = currentWidth < 700;
    const pose = getCameraPose(compactViewportRef.current);
    cameraGoalRef.current.position.copy(pose.position);
    cameraGoalRef.current.target.copy(pose.target);
  }, []);

  useEffect(() => {
    selectedLoadRef.current = visualLoadKey;
    const model = modelRef.current;
    if (model) {
      applyLoadVisibility(model, visualLoadKey);
      requestRenderRef.current();
    }
  }, [visualLoadKey]);

  useEffect(() => {
    labelConfigRef.current = {
      companyName,
      brandColor: safeBrandColor,
      textColor: safeTextColor,
      dimensions: trailerDimensions,
    };
    rebuildRuntimeOverlay();
    requestRenderRef.current();
  }, [companyName, safeBrandColor, safeTextColor, trailerDimensions, rebuildRuntimeOverlay]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    setIsReady(false);
    setHasLoadError(false);
    setLoadProgress(0);

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = null;

    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.copy(cameraGoalRef.current.position);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.target.copy(cameraGoalRef.current.target);
    controls.enableRotate = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minDistance = 3.1;
    controls.maxDistance = 80;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controlsRef.current = controls;

    scene.add(new THREE.HemisphereLight("#f4f0e5", "#181817", 2.4));

    const keyLight = new THREE.DirectionalLight("#ffffff", 4.2);
    keyLight.position.set(-6, 8, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 26;
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(safeBrandColor, 1.2);
    rimLight.position.set(5, 4, -5);
    scene.add(rimLight);

    scene.add(new THREE.AmbientLight("#f4efe2", 0.34));

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(dracoDecoderPath);
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    let animationFrame: number | null = null;
    let disposed = false;

    const render = () => {
      animationFrame = null;
      if (disposed) {
        return;
      }

      const goal = cameraGoalRef.current;
      if (cameraTransitionRef.current) {
        camera.position.lerp(goal.position, 0.075);
        controls.target.lerp(goal.target, 0.075);

        if (camera.position.distanceToSquared(goal.position) < 0.0004 && controls.target.distanceToSquared(goal.target) < 0.0004) {
          camera.position.copy(goal.position);
          controls.target.copy(goal.target);
          cameraTransitionRef.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (cameraTransitionRef.current) {
        requestRenderRef.current();
      }
    };

    const requestRender = () => {
      if (disposed || animationFrame !== null) {
        return;
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    requestRenderRef.current = requestRender;

    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) {
          return;
        }

        const model = gltf.scene;
        model.name = "DumpTrailerLoadVisualizer";
        tuneImportedMaterials(model);

        const sourceBox = new THREE.Box3().setFromObject(model);
        const sourceCenter = sourceBox.getCenter(new THREE.Vector3());
        model.position.sub(sourceCenter);

        const centeredBox = new THREE.Box3().setFromObject(model);
        model.position.y -= centeredBox.min.y;

        applyLoadVisibility(model, selectedLoadRef.current);
        scene.add(model);
        modelRef.current = model;
        rebuildRuntimeOverlay();
        setIsReady(true);
        requestRender();
      },
      (event) => {
        if (event.total > 0) {
          setLoadProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
        }
      },
      () => {
        setLoadProgress(0);
        setHasLoadError(true);
      },
    );

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      const isCompact = width < 700;
      camera.aspect = width / height;
      camera.fov = isCompact ? 44 : 38;
      if (isCompact) {
        camera.setViewOffset(width, height, 0, Math.round(height * 0.16), width, height);
      } else {
        camera.clearViewOffset();
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (compactViewportRef.current !== isCompact) {
        compactViewportRef.current = isCompact;
        setCameraGoal();
        cameraTransitionRef.current = true;
      }
      requestRender();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    return () => {
      disposed = true;
      requestRenderRef.current = () => {};
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
      resizeObserver.disconnect();
      controls.dispose();
      dracoLoader.dispose();
      renderer.dispose();
      if (modelRef.current) {
        disposeObject(modelRef.current);
        modelRef.current = null;
      }
      overlayRef.current = null;
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [dracoDecoderPath, modelUrl, rebuildRuntimeOverlay, safeBrandColor, setCameraGoal]);

  return (
    <section className={rootClassName} style={{ ...cssVars, ...style }} aria-label="Dump trailer load visualizer">
      <div ref={mountRef} className="dtv-canvas" />
      {selectedLoad === "multi" && multiLoadBadgeText.trim().length > 0 && (
        <div className="dtv-multi-badge" aria-label={multiLoadBadgeText}>
          {multiLoadBadgeText}
        </div>
      )}
      {hasLoadError ? (
        <div className="dtv-fallback" role="status">
          <span>Trailer preview unavailable</span>
          <small>Your estimate will still update below.</small>
        </div>
      ) : !isReady && (
        <div className="dtv-loading" role="status">
          <span>{loadProgress > 0 ? `Loading ${loadProgress}%` : "Loading trailer"}</span>
        </div>
      )}
    </section>
  );
}
