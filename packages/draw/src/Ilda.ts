import * as fs from 'fs';
import { fromByteArray, Section } from '@laser-dac/ilda-reader';
import { Shape } from './Shape';
import { Color, Point } from './Point';

export interface File {
  sections: Section[];
}

interface IldaOptions {
  x?: number;
  y?: number;
  size?: number;
  color?: Color;
  frame: number;
  file: File;
}

export class Ilda extends Shape {
  x?: number;
  y?: number;
  size?: number;
  color?: Color;
  frame: number;
  file: File;

  constructor(options: IldaOptions) {
    super();
    this.x = options.x;
    this.y = options.y;
    this.size = options.size;
    this.color = options.color;
    this.frame = options.frame;
    this.file = options.file;
  }

  isStatic() {
    return (
      this.x === undefined &&
      this.y === undefined &&
      this.size === undefined &&
      this.color === undefined
    );
  }

  draw() {
    const section = this.file.sections[this.frame];
    // Take a shortcut if there are no dynamic values.
    if (this.isStatic()) {
      return section.points;
    }
    const x = this.x || 0;
    const y = this.y || 0;
    const color = this.color;
    const size = this.size || 1;

    return section.points.map((point: Point) => {
      const isBlank = point.r === 0 && point.g === 0 && point.b === 0;
      return {
        x: x + point.x * size,
        y: y + point.y * size,
        r: color !== undefined && !isBlank ? color[0] : point.r,
        g: color !== undefined && !isBlank ? color[1] : point.g,
        b: color !== undefined && !isBlank ? color[2] : point.b
      };
    });
  }
}

export function loadIldaFile(path: string): File {
  const buffer = fs.readFileSync(path);
  const byteArray = Array.prototype.slice.call(buffer, 0) as number[];

  return { sections: fromByteArray(byteArray) };
}
