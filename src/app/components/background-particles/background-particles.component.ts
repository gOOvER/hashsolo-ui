import { Component, OnInit } from '@angular/core';
import { NgParticlesService, type IParticlesProps } from '@tsparticles/angular';
import type { Container, Engine } from '@tsparticles/engine';
import { DeviceDetectorService } from 'ngx-device-detector';
import { loadFull } from 'tsparticles';

@Component({
  standalone: false,
  selector: 'app-background-particles',
  templateUrl: './background-particles.component.html',
  styleUrls: ['./background-particles.component.scss']
})
export class BackgroundParticlesComponent implements OnInit {
  public particleStyles!: any;
  public particleOptions!: IParticlesProps;

  constructor(
    private deviceService: DeviceDetectorService,
    private readonly ngParticlesService: NgParticlesService
  ) { }

  ngOnInit(): void {
    this.ngParticlesService.init(async (engine: Engine) => {
      await loadFull(engine);
    });
    this.particleStyles = {
      position: 'fixed',
      width: '100%',
      height: '100%',
      'z-index': -1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };

    const color: string = '#96bcf9';
    const lineColor: string = '#afccfa';

    this.particleOptions = {
      fpsLimit: 30,
      detectRetina: true,
      background: {
        position: '50% 50%',
        repeat: 'no-repeat',
        size: 'cover'
      },
      fullScreen: {
        zIndex: -1
      },
      particles: {
        number: {
          value: 80,
          density: {
            enable: true
          }
        },
        color: {
          value: color
        },
        opacity: { value: 0.6 },
        links: {
          distance: 150,
          enable: true,
          color: {
            value: lineColor
          },
          opacity: 0.6
        },
        move: {
          enable: true,
          speed: 0.4
        },
        size: {
          value: { min: 1, max: 3 }
        }
      }
    };
  }

  particlesLoaded(_container?: Container): void {
  }
}
