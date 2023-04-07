/* eslint-disable no-unused-expressions */
const fragmentShader = `
uniform float u_intensity;
uniform float u_time;

varying vec2 vUv;
varying float vDisplacement;

void main() {
    float distort = vDisplacement * u_intensity * sin(vUv.y * u_time);
    vec3 color = vec3(abs(vUv - 0.7) * 1.5  * (0.5 - distort), 2.0);
    gl_FragColor = vec4(color, 1.0);
}

`;

export default fragmentShader;
