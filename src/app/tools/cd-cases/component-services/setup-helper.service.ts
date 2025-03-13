setupRenderer(
  canvas: HTMLCanvasElement, 
  sceneService: SceneService,
  config: Config
): any {
  // Initialize WebGL renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true, // Ensure transparency to allow our background to show
    powerPreference: 'high-performance',
    stencil: true, // Needed for post-processing
    depth: true
  });
  
  // Clear color with full transparency
  renderer.setClearColor(0x000000, 0);
} 