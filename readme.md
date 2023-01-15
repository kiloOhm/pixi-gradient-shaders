- [Linear](#linear)
- [Radial](#radial)
- [Conic](#conic)
- [Example Usage](#example-usage)

## Linear

```ts
/**
 * @throws Error if the number of colors is greater than MAX_COLOR_STOPS
 * @throws Error if stops is provided and is not the same length as stops
 * @throws Error if stops is provided and is not in ascending order
 */
function linearGradient(options: {
  /**
   * The colors to use in the gradient. Must be at least 2.
   */
  colors: RGBAColor[],
  /**
   * The positions of the colors in the gradient. Must be the same length as colors and in ascending order.
   * By default, the colors will be evenly distributed.
   */
  stops?: RGBAColor[],
  /**
   * The rotation of the gradient in degrees. Defaults to 0.
   */
  rotation?: number,
}): {
  fragmentShader: string,
  uniforms: Object,
}
```

## Radial

```ts
/**
 * @throws Error if the number of colors is greater than MAX_COLOR_STOPS
 * @throws Error if stops is provided and is not the same length as stops
 * @throws Error if stops is provided and is not in ascending order
 */
function radialGradient(options: {
  /**
   * The colors to use in the gradient. Must be at least 2.
   */
  colors: RGBAColor[],
  /**
   * An array of positions for each color stop. Must be the same length as colors and in ascending order.
   * If not provided, the stops will be evenly spaced.
   * @example [0, 0.5, 1]
   */
  stops?: RGBAColor[],
  /**
   * If true, the gradient will be circular. Similar to CSS radial-gradient circle parameter. 
   * @default false
   */
  circle?: boolean,
  /**
   * The center of the gradient. Defaults to center
   * @example [0.5, 0.5]
   */
  center?: Point,
  /**
   * The scale of the gradient.
   * @default 1
   */
  scale?: number,
}): {
  fragmentShader: string,
  uniforms: Object,
}
```

## Conic

```ts
/**
 * @throws Error if the number of colors is greater than MAX_COLOR_STOPS
 * @throws Error if stops is provided and is not the same length as stops
 * @throws Error if stops is provided and is not in ascending order
 */
function conicGradient(options: {
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
}): {
  fragmentShader: string,
  uniforms: Object,
}
```

## Example Usage

```js
  const conical = new Graphics();
  conical.beginFill(0x000000, 1, true);
  conical.drawCircle(
    app.screen.width / 2 - conical.width / 2, 
    app.screen.height / 2 - conical.height / 2, 
    200
  );
  conical.endFill();
  const conicShader = conicGradient({
    colors: [
      [1, 0, 0, 1],
      [0, 1, 0, 1],
      [0, 0, 1, 1],
      [1, 0, 0, 1]
    ],
  });
  const filter = new Filter(undefined, conicShader.fragmentShader, conicShader.uniforms);
  conical.filters = [filter];
  app.stage.addChild(conical);
```