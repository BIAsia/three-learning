uniform float uTime;
varying vec3 vPosition;

void main() {
 vec3 rgb = vec3(1., 1., 1.);
//  vec3 hsv = vec3(cos(uTime*0.01), .4, 1.0);


 //hsv = mix(uColor1, hsv, vPosition.x);

//  rgb = hsv2rgb(hsv);
//  rgb = mix(uColor1, rgb, vPosition.y);
 gl_FragColor = vec4(rgb, 0.8);
}

