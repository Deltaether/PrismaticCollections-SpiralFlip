import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { CDCase } from '../../shared/interfaces';
import { CDCasesService } from './cd-cases.service';

@Injectable({
  providedIn: 'root'
})
export class CDCasesEventsService {
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private dragStartPosition = new THREE.Vector2();
  private dragOffset = new THREE.Vector3();
  private planeNormal = new THREE.Vector3(0, 0, 1);
  private dragPlane = new THREE.Plane(this.planeNormal);

  constructor(private cdCasesService: CDCasesService) {}

  updateMousePosition(event: MouseEvent, canvas: HTMLCanvasElement): void {
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  handleMouseDown(event: MouseEvent, canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera, cdCases: CDCase[]): void {
    if (event.button === 0) {
      console.log('Left click detected');
      this.updateMousePosition(event, canvas);
      this.raycaster.setFromCamera(this.mouse, camera);

      const surfacesToCheck: THREE.Object3D[] = [];
      cdCases.forEach(cdCase => {
        cdCase.model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            console.log('Found mesh:', child.name);
            surfacesToCheck.push(child);
          }
        });
      });

      const intersects = this.raycaster.intersectObjects(surfacesToCheck, false);
      console.log('Checking all case surfaces, intersected:', intersects.length);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Clicked surface:', clickedObject.name);

        const selectedCase = cdCases.find(cdCase => {
          let isPartOfCase = false;
          cdCase.model.traverse((child) => {
            if (child === clickedObject) {
              isPartOfCase = true;
            }
          });
          return isPartOfCase;
        });

        if (selectedCase) {
          console.log('Flipping case:', selectedCase.id);
          this.cdCasesService.flipCase(selectedCase);
        }
      }
    }
  }

  handleMouseMove(event: MouseEvent, canvas: HTMLCanvasElement): void {
    this.updateMousePosition(event, canvas);
  }

  handleMouseUp(): void {
    // Handle mouse up events if needed
  }

  handleContextMenu(event: Event, canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera, cdCases: CDCase[]): void {
    event.preventDefault();
    this.updateMousePosition(event as MouseEvent, canvas);
    this.raycaster.setFromCamera(this.mouse, camera);

    const surfacesToCheck: THREE.Object3D[] = [];
    cdCases.forEach(cdCase => {
      cdCase.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          surfacesToCheck.push(child);
        }
      });
    });

    const intersects = this.raycaster.intersectObjects(surfacesToCheck, false);
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const selectedCase = cdCases.find(cdCase => {
        let isPartOfCase = false;
        cdCase.model.traverse((child) => {
          if (child === clickedObject) {
            isPartOfCase = true;
          }
        });
        return isPartOfCase;
      });

      if (selectedCase) {
        this.cdCasesService.flipCase(selectedCase);
      }
    }
  }
} 