// One three.js namespace shaped like the CDN globals the drafts were written against (THREE.GLTFLoader, THREE.EffectComposer, ...).
import * as core from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { LuminosityHighPassShader } from 'three/examples/jsm/shaders/LuminosityHighPassShader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export const THREE = { ...core, GLTFLoader, EffectComposer, RenderPass, ShaderPass, UnrealBloomPass, CopyShader, LuminosityHighPassShader };
export { MeshoptDecoder };
