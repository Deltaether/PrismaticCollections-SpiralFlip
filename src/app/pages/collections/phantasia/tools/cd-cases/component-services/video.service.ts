import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { CDCase } from '../../shared/interfaces';

@Injectable()
export class VideoService {
  private rightSideMenuPlane!: THREE.Mesh;
  private backgroundPlane!: THREE.Mesh;
  private caseBackVideoPlane!: THREE.Mesh;
  private videoPlay!: () => void;
  private videoPause!: () => void;
  private updateVideoSource!: (videoPath: string) => void;
  private clock = new THREE.Clock();
  private config: any; // will be set in setConfig method

  /**
   * Stores configuration data for video planes and settings
   * Used to configure video elements with proper dimensions and properties
   * 【✓】
   */
  setConfig(config: any): void {
    this.config = config;
  }

  /**
   * Sets up references to video planes and control functions
   * Initializes all video-related elements for the component
   * 【✓】
   */
  setVideoElements(
    rightSideMenuPlane: THREE.Mesh,
    backgroundPlane: THREE.Mesh,
    caseBackVideoPlane: THREE.Mesh,
    videoPlay: () => void,
    videoPause: () => void,
    updateVideoSource: (videoPath: string) => void
  ): void {
    this.rightSideMenuPlane = rightSideMenuPlane;
    this.backgroundPlane = backgroundPlane;
    this.caseBackVideoPlane = caseBackVideoPlane;
    this.videoPlay = videoPlay;
    this.videoPause = videoPause;
    this.updateVideoSource = updateVideoSource;
  }

  /**
   * Reveals and plays video content when a case is expanded
   * Shows background planes and starts video playback for active case
   * Includes transition effects like fade-in animations
   * 【✓】
   */
  revealVideoAndBackground(activeCaseExpanded: boolean, cdCases: CDCase[], videoPaths: string[]): void {
    if (this.rightSideMenuPlane && this.backgroundPlane) {
      // The planes are already visible, so we only need to handle the video content
      
      // Get active case index to load the appropriate video
      const activeIndex = cdCases.findIndex(cdCase => cdCase.isActive);
      if (activeIndex >= 0 && activeIndex < videoPaths.length) {
        // Update video source to match active case
        this.updateVideoSource(videoPaths[activeIndex]);
        
        // The case back video plane is already using the same video texture
        // so it will automatically update with the new video
      }
      
      // Start video playback
      this.videoPlay();
      
      // Now that animation is complete, make the caseBackVideoPlane visible and fade it in
      if (this.caseBackVideoPlane && activeCaseExpanded) {
        // Check if the plane should be visible based on configuration
        const isVisibleByConfig = this.caseBackVideoPlane.userData['configVisible'] !== undefined 
            ? this.caseBackVideoPlane.userData['configVisible'] 
            : true;
            
        if (!isVisibleByConfig) {
          // If config has visibility disabled, keep it hidden
          this.caseBackVideoPlane.visible = false;
          return;
        }
        
        console.log('Animation complete, revealing video plane 2');
        this.caseBackVideoPlane.visible = true;
        
        // Apply fade-in for the material opacity
        const startOpacity = 0;
        const targetOpacity = 0.95;
        const fadeDuration = 0.3; // Short fade-in
        
        // Get starting time
        const startTime = this.clock.getElapsedTime();
        
        // Create fade-in animation
        const fadeIn = () => {
          const currentTime = this.clock.getElapsedTime();
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / fadeDuration, 1.0);
          
          // Calculate current opacity
          const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
          
          // Update opacity based on material type
          if (this.caseBackVideoPlane.material instanceof THREE.ShaderMaterial && 
              this.caseBackVideoPlane.material.uniforms) {
            const opacityUniform = this.caseBackVideoPlane.material.uniforms['opacity'];
            if (opacityUniform) {
              opacityUniform.value = currentOpacity;
            }
          } else if (this.caseBackVideoPlane.material instanceof THREE.MeshBasicMaterial) {
            this.caseBackVideoPlane.material.opacity = currentOpacity;
          }
          
          // Continue animation until complete
          if (progress < 1.0) {
            requestAnimationFrame(fadeIn);
          } else {
            console.log('Fade-in complete, video plane 2 opacity:', currentOpacity);
          }
        };
        
        // Start fade-in animation
        fadeIn();
      }
    }
  }

  /**
   * Resets the case back video plane to initial state
   * Prepares video plane for new content with proper opacity
   * 【✓】
   */
  resetCaseBackVideoPlane(initialOpacity: number = 0.95): void {
    if (this.caseBackVideoPlane) {
      // Check if the plane should be visible based on configuration
      const isVisibleByConfig = this.caseBackVideoPlane.userData['configVisible'] !== undefined 
          ? this.caseBackVideoPlane.userData['configVisible'] 
          : true;
      
      // Set material opacity either way (in case it becomes visible later)
      if (this.caseBackVideoPlane.material instanceof THREE.ShaderMaterial && 
          this.caseBackVideoPlane.material.uniforms) {
        // Set opacity for fade-in later using shader uniform
        const opacityUniform = this.caseBackVideoPlane.material.uniforms['opacity'];
        if (opacityUniform) {
          opacityUniform.value = initialOpacity;
        }
      } else if (this.caseBackVideoPlane.material instanceof THREE.MeshBasicMaterial) {
        // Fallback for MeshBasicMaterial if used
        this.caseBackVideoPlane.material.opacity = initialOpacity;
      }
      
      // Always start with plane hidden, regardless of opacity
      this.caseBackVideoPlane.visible = false;
      
      // Store visibility setting - the rightSideMenuPlane may be recreated during resets
      this.caseBackVideoPlane.userData['configVisible'] = isVisibleByConfig;
    }
  }

  /**
   * Creates a video plane for the back of CD cases
   * Configures a mesh with custom shader material for video display
   * Sets up proper positioning and appearance based on config
   * 【✓】
   */
  createCaseBackVideoPlane(videoTexture: THREE.VideoTexture): THREE.Mesh {
    // Get size from config with fallback values
    const width = this.config.videoPlane2Size?.width || 1.2;
    const height = this.config.videoPlane2Size?.height || 0.8;
    const radius = this.config.videoPlane2Size?.cornerRadius || 0.05; // Get radius from config or use default
    const rightCrop = this.config.videoPlane2Size?.rightCrop || 0; // Get right crop from config or use default
    // Check if videoPlane2 should be visible by config
    const isVisibleByConfig = this.config.videoPlane2Size?.visible !== undefined 
        ? this.config.videoPlane2Size.visible 
        : true;
    
    // Create geometry based on cropping value
    let geometry;
    
    if (rightCrop > 0 && rightCrop < 1) {
      // Calculate the adjusted width based on the crop amount
      const croppedWidth = width * (1 - rightCrop);
      
      // Create custom geometry with modified vertices
      geometry = new THREE.BufferGeometry();
      
      // Define the vertices of the plane (4 corners, clockwise from bottom left)
      const vertices = new Float32Array([
        -width/2, -height/2, 0,            // bottom left
        -width/2 + croppedWidth, -height/2, 0,  // bottom right (cropped)
        -width/2 + croppedWidth, height/2, 0,   // top right (cropped)
        -width/2, height/2, 0              // top left
      ]);
      
      // Define UV coordinates - still use full UV range to maintain aspect ratio
      const uvs = new Float32Array([
        0, 0,  // bottom left
        1 - rightCrop, 0,  // bottom right (cropped in x)
        1 - rightCrop, 1,  // top right (cropped in x)
        0, 1   // top left
      ]);
      
      // Define the face indices (two triangles)
      const indices = new Uint16Array([
        0, 1, 2,  // first triangle
        0, 2, 3   // second triangle
      ]);
      
      // Set the attributes for the geometry
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      
      // Compute vertex normals
      geometry.computeVertexNormals();
    } else {
      // Use standard PlaneGeometry if no cropping
      geometry = new THREE.PlaneGeometry(width, height);
    }
    
    // Create a shader material that handles rounded corners in the fragment shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: videoTexture },
        opacity: { value: 0.95 },
        size: { value: new THREE.Vector2(width, height) },
        radius: { value: radius },
        ambient: { value: new THREE.Color(0xfcfcfc) }, // Ambient light color for scene integration
        ambientIntensity: { value: 0.75 } // Controls darkness level (lower = darker)
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float opacity;
        uniform vec2 size;
        uniform float radius;
        uniform vec3 ambient;
        uniform float ambientIntensity;
        varying vec2 vUv;
        
        float roundedRectangle(vec2 position, vec2 size, float radius) {
          // Convert UV to pixel coordinates
          vec2 q = abs(position) - size + vec2(radius);
          return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
        }
        
        void main() {
          // Convert UV from 0-1 to -size/2 to size/2
          vec2 position = (vUv - 0.5) * size;
          
          // Calculate distance to rounded rectangle edge
          float distance = roundedRectangle(position, size * 0.5, radius);
          
          // Apply a sharp cutoff for rounded corners
          if (distance > 0.0) {
            discard; // Discard fragments outside the rounded rectangle
          }
          
          // Sample texture
          vec4 texColor = texture2D(map, vUv);
          
          // Apply subtle darkening for scene integration
          vec3 finalColor = texColor.rgb * ambientIntensity;
          
          // Apply opacity
          gl_FragColor = vec4(finalColor, texColor.a * opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
    
    // Create the mesh
    const videoPlane = new THREE.Mesh(geometry, material);
    
    // Add slight random rotation offset to make it look more realistic
    const randomX = (Math.random() - 0.5) * 0.01;
    const randomY = (Math.random() - 0.5) * 0.01;
    const randomZ = (Math.random() - 0.5) * 0.01;
    videoPlane.rotation.set(randomX, randomY, randomZ);
    
    // Set render order to ensure proper layering
    videoPlane.renderOrder = 2; // Highest render order to ensure it's always on top
    
    // Cast shadows for better realism
    videoPlane.castShadow = true;
    videoPlane.receiveShadow = true;
    
    // Store the config visibility setting in userData for reference
    videoPlane.userData['configVisible'] = isVisibleByConfig;
    
    return videoPlane;
  }

  /**
   * Updates video content when a new case becomes active
   * Handles video source switching and silhouette effects
   * Manages expanded state and animation transitions
   * 【✓】
   */
  updateVideoForNewActiveCase(newIndex: number, wasExpandedBefore: boolean, videoPaths: string[], 
                             playingMusic: boolean[], cdCases: CDCase[], 
                             tutorialCompleted: boolean[], 
                             createSilhouette: (cdCase: CDCase) => void,
                             expandActiveCase: (cdCase: CDCase) => void): void {
    // Reset the case back video plane with opacity 0 (invisible until clicked)
    this.resetCaseBackVideoPlane(0);
    
    // Create silhouette for new active case if it's not playing music and tutorial not completed
    const activeCase = cdCases.find(cdCase => cdCase.isActive);
    if (activeCase && !playingMusic[newIndex] && !tutorialCompleted[newIndex]) {
      createSilhouette(activeCase);
    }
    
    // If we're navigating to a case that is playing music, update the video
    if (playingMusic[newIndex] && this.rightSideMenuPlane) {
      // Update video source to match new active case
      if (newIndex >= 0 && newIndex < videoPaths.length) {
        this.updateVideoSource(videoPaths[newIndex]);
        
        // If the case is playing music, also start the video
        this.videoPlay();
      }
    } else {
      // If case is not playing music, we keep planes visible but pause video
      this.videoPause(); // Pause the video when no music is playing
    }
    
    // If the previous case was expanded, automatically expand the new case
    // but only after the activation animation has completed
    if (wasExpandedBefore && activeCase) {
      // We need to properly wait for the position animation to complete
      // This is determined by checking when the case's position has reached (or very close to)
      // its target position
      
      // Create a flag to ensure we only trigger the expansion once
      let expansionTriggered = false;
      
      // Create a function to check if case is in position
      const checkPosition = () => {
        // Skip if expansion was already triggered
        if (expansionTriggered) return;

        // Calculate the distance between current position and target position
        const distanceToTarget = activeCase.position.distanceTo(activeCase.targetPosition);
        
        // Consider the position reached when very close to target (within a small threshold)
        const POSITION_THRESHOLD = 0.05; // Small distance threshold
        
        if (distanceToTarget <= POSITION_THRESHOLD) {
          // Case has reached its target position, now expand it
          console.log("Case reached target position, auto-expanding because previous case was expanded");
          console.log("Distance to target:", distanceToTarget);
          
          // Set flag to prevent multiple expansions
          expansionTriggered = true;
          
          // Expand the case
          expandActiveCase(activeCase);
        } else {
          // Keep checking until position is reached
          console.log("Waiting for case to reach position before auto-expanding. Current distance:", distanceToTarget);
          
          // Continue checking until position reached
          requestAnimationFrame(checkPosition);
        }
      };
      
      // Start checking for position
      checkPosition();
    }
  }

  /**
   * Aligns the video plane with the active case during animations
   * Ensures video display follows case movement for smooth transitions
   * Updates position and rotation to match the active or animated case
   * 【✓】
   */
  updateVideoPlane2Alignment(
    caseBackVideoPlane: THREE.Mesh, 
    isManuallyAnimating: boolean, 
    manuallyAnimatedCaseId: number | null, 
    cdCases: CDCase[]
  ): void {
    if (!caseBackVideoPlane) return;
    
    // Check if the plane should be visible based on configuration
    const isVisibleByConfig = caseBackVideoPlane.userData['configVisible'] !== undefined 
        ? caseBackVideoPlane.userData['configVisible'] 
        : true;
        
    // If config has visibility disabled, keep it hidden and don't process further
    if (!isVisibleByConfig) {
      caseBackVideoPlane.visible = false;
      return;
    }

    // Find the case to align with - either the manually animated case or the active case
    let caseToAlignWith: CDCase | undefined;

    if (isManuallyAnimating && manuallyAnimatedCaseId !== null) {
      // During manual animation, use the case being manually animated
      caseToAlignWith = cdCases.find(c => c.id === manuallyAnimatedCaseId);
    } else {
      // Otherwise, use the active case (if any), or try to find a case that was recently active
      // and is being automatically animated back to its position
      caseToAlignWith = cdCases.find(c => c.isActive);
      
      // If no active case but we have a previously animated case that might be in transition
      if (!caseToAlignWith && manuallyAnimatedCaseId !== null) {
        caseToAlignWith = cdCases.find(c => c.id === manuallyAnimatedCaseId);
      }
    }
    
    if (!caseToAlignWith) return;
    
    // Get configuration values
    const videoPlane2Pos = this.config.videoPlane2Position || { 
      offsetX: 0.8, 
      offsetY: 0.01, 
      offsetZ: 0.02 
    };
    
    const videoPlane2Rot = this.config.videoPlane2Rotation || { 
      offsetX: 0,
      offsetY: -1.57, 
      offsetZ: 0
    };
    
    // Debug logging (optional)
    if (isManuallyAnimating) {
      console.log('Aligning videoPlane2 with manually animated case:', caseToAlignWith.id);
    }
    
    // Get case position and rotation
    const casePosition = new THREE.Vector3().copy(caseToAlignWith.model.position);
    const caseQuaternion = new THREE.Quaternion().setFromEuler(caseToAlignWith.model.rotation);
    
    // Create offset vector and apply case rotation
    const offsetVector = new THREE.Vector3(
      videoPlane2Pos.offsetX,
      videoPlane2Pos.offsetY,
      videoPlane2Pos.offsetZ
    );
    
    // Apply case rotation to the offset vector so it rotates with the case
    offsetVector.applyQuaternion(caseQuaternion);
    
    // Calculate final position by adding the rotated offset to the case position
    const videoPlanePosition = new THREE.Vector3(
      casePosition.x + offsetVector.x,
      casePosition.y + offsetVector.y,
      casePosition.z + offsetVector.z
    );
    
    // Apply the position to the video plane
    caseBackVideoPlane.position.copy(videoPlanePosition);
    
    // Create a new quaternion for the CD case
    const caseQuat = new THREE.Quaternion().setFromEuler(caseToAlignWith.model.rotation);
    
    // Create a quaternion for our additional rotation
    const offsetQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(videoPlane2Rot.offsetX, videoPlane2Rot.offsetY, videoPlane2Rot.offsetZ, 'YXZ')
    );
    
    // Combine the quaternions (case rotation first, then offset rotation)
    const finalQuat = new THREE.Quaternion().multiplyQuaternions(caseQuat, offsetQuat);
    
    // Apply the combined rotation
    caseBackVideoPlane.setRotationFromQuaternion(finalQuat);

    // If case is not active and we have a material that should fade out
    // Gradually reduce opacity as the case moves back to its position
    if (!caseToAlignWith.isActive && !isManuallyAnimating) {
      const material = caseBackVideoPlane.material as THREE.MeshBasicMaterial;
      // Calculate distance from current to target position as a percentage
      const currentPos = new THREE.Vector3().copy(caseToAlignWith.position);
      const targetPos = new THREE.Vector3().copy(caseToAlignWith.targetPosition);
      // Use the same Z offset as defined in the config.finalCasePosition
      const Z_OFFSET_ACTIVE = 2.0; // Match the finalCasePosition.offsetZ value
      const totalDistance = caseToAlignWith.initialPosition.distanceTo(targetPos.add(new THREE.Vector3(0, 0, Z_OFFSET_ACTIVE)));
      const currentDistance = caseToAlignWith.initialPosition.distanceTo(currentPos);
      
      // Fade out based on proximity to final position
      if (totalDistance > 0) {
        const progress = 1 - (currentDistance / totalDistance);
        material.opacity = Math.max(0, 0.95 * (1 - progress));
      } else {
        material.opacity = 0;
      }
    }
  }

  /**
   * Returns the video play function
   * Provides access to video playback control
   * 【✓】
   */
  public getVideoPlay(): (() => void) {
    return this.videoPlay;
  }

  /**
   * Returns the video source update function
   * Provides access to change video content
   * 【✓】
   */
  public getUpdateVideoSource(): ((videoPath: string) => void) {
    return this.updateVideoSource;
  }
} 