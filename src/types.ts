export type RGBAColor = [number, number, number, number];

export type Point = [number, number];

export type Shader = {
  fragmentShader: string;
  uniforms: Object;
}