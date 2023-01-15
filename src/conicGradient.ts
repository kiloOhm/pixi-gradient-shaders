import { Point, RGBAColor, Shader } from "./types";
import { MAX_COLOR_STOPS } from "./global";

const fragmentShader = `
#define MAX_STOPS ${MAX_COLOR_STOPS}
#define PI ${Math.PI}

precision highp float;

varying vec2 vTextureCoord;
uniform vec4 inputSize;
uniform vec4 outputFrame;
uniform vec2 u_center;
uniform int u_num_stops;
uniform vec4 u_stops[MAX_STOPS];
uniform float u_stop_positions[MAX_STOPS];

uniform sampler2D uSampler;

vec4 linearGradient(float position) {
  vec4 result = vec4(0.0);
  for (int i = 0; i < MAX_STOPS - 1; i++) {
    if(i >= u_num_stops - 1) break;
    if (position >= u_stop_positions[i] && position <= u_stop_positions[i + 1]) {
      float t = (position - u_stop_positions[i]) / (u_stop_positions[i + 1] - u_stop_positions[i]);
      result = mix(u_stops[i], u_stops[i + 1], t);
      break;
    }
  }
  return result;
}

float degressToRadians(float degrees) {
  return degrees * PI / 180.0;
}

void main() {
  vec2 uv = vTextureCoord * inputSize.xy / outputFrame.zw;
  float a = atan(
    uv.y - u_center.y,
    uv.x - u_center.x
  );
  float angle = mod(a + PI, PI * 2.0);
  angle = angle / (PI * 2.0);
  angle = clamp(angle, 0.0, 1.0);
  vec4 fg = texture2D(uSampler, vTextureCoord);
  gl_FragColor = linearGradient(angle) * fg.a;
}`;

/**
 * @throws Error if the number of colors is greater than MAX_COLOR_STOPS
 * @throws Error if stops is provided and is not the same length as stops
 * @throws Error if stops is provided and is not in ascending order
 */
export function conicGradient(options: {
  /**
   * The colors to use in the gradient. Must be at least 2.
   */
  colors: RGBAColor[],
  /**
   * The positions of the colors in the gradient. Must be the same length as colors and in ascending order.
   * If not provided, the colors will be evenly spaced.
   * @example [0, 0.5, 1]
   */
  stops?: RGBAColor[],
  /**
   * The center of the gradient. Defaults to center
   * @example [0.5, 0.5]
   */
  center?: Point,
}): Shader {
  const {
    colors,
    stops,
    center = [0.5, 0.5],
  } = options;
  if(colors.length > MAX_COLOR_STOPS) {
    throw new Error(`Maximum number of color stops is ${MAX_COLOR_STOPS}. You can change this by setting MAX_COLOR_STOPS`);
  }
  if(stops && stops.length !== colors.length) {
    throw new Error('stopPositions must be the same length as stops');
  }
  if(stops) {
    for(let i = 0; i < stops.length - 1; i++) {
      if(stops[i] > stops[i + 1]) {
        throw new Error('stopPositions must be in ascending order');
      }
    }
  }
  return {
    fragmentShader, 
    uniforms: {
      u_stops: colors.flat(),
      u_stop_positions: stops || colors.map((_, i) => i / (colors.length - 1)),
      u_num_stops: colors.length,
      u_center: center,
    }
  }
}