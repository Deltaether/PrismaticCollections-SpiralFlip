import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { CDCase } from '../../../shared/interfaces';
import { CDCasesService } from '../cd-cases.service';

@Injectable({
  providedIn: 'root'
})
export class CDCasesEventsService {
  private isDragging = false;
  private mouseX = 0;
  private mouseY = 0;
  private selectedCase: CDCase | null = null;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(private cdCasesService: CDCasesService) {}

  handleMouseDown(event: MouseEvent, canvas: HTMLCanvasElement, camera: THREE.Camera, cdCases: CDCase[]): void {
    if (event.button !== 0) return; // Only handle left click

    const rect = canvas.getBoundingClientRect();
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, camera);

    for (const cdCase of cdCases) {
      const intersects: THREE.Intersection[] = [];
      cdCase.model.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          const meshIntersects = this.raycaster.intersectObject(child);
          intersects.push(...meshIntersects);
        }
      });

      if (intersects.length > 0) {
        this.isDragging = true;
        this.selectedCase = cdCase;
        break;
      }
    }
  }

  handleMouseMove(event: MouseEvent, canvas: HTMLCanvasElement): void {
    if (this.isDragging && this.selectedCase) {
      const deltaX = event.clientX - this.mouseX;
      const deltaY = event.clientY - this.mouseY;

      // Update momentum based on mouse movement
      this.selectedCase.momentum.x = deltaX * 0.01;
      this.selectedCase.momentum.y = deltaY * 0.01;

      // Update position
      if (this.selectedCase.model) {
        this.selectedCase.model.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            this.selectedCase!.position.x += deltaX * 0.01;
            this.selectedCase!.position.z += deltaY * 0.01;
            this.selectedCase!.model.position.copy(this.selectedCase!.position);
          }
        });
      }

      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    }
  }

  handleMouseUp(): void {
    this.isDragging = false;
    this.selectedCase = null;
  }

  handleContextMenu(event: MouseEvent, canvas: HTMLCanvasElement, camera: THREE.Camera, cdCases: CDCase[]): void {
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, camera);

    for (const cdCase of cdCases) {
      const intersects: THREE.Intersection[] = [];
      cdCase.model.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          const meshIntersects = this.raycaster.intersectObject(child);
          intersects.push(...meshIntersects);
        }
      });

      if (intersects.length > 0) {
        this.cdCasesService.flipCase(cdCase);
        break;
      }
    }
  }
} 