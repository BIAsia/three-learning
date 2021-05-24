varying vec3 vPosition;
attribute vec3 aRandom;

void main() {
  vPosition = position;

  vec3 pos = position*1.5;

//   vec3 trans = aRandom*10.;
  
//   pos += sin(aRandom*uTime)*0.01;

  // vec4 temp = vec4(pos.x,pos.y,pos.z,1.);
  // float curAngle = cos(uTime) * 6.28;
  // vec3 rotationAxis = vec3(1.,1.,1.);

  // mat4 curMat = rotation3d(rotationAxis, curAngle);
  // vec4 curVec4 = temp * curMat;
  // pos = curVec4.xyz;

  // vec4 result = temp * 

  //pos *= uScale+aRandom*(1.-uScale);

  // pos.x += sin(uTime)*aRandom.x*(1.-uScale);
  // pos.z += cos(uTime)*aRandom.z*(1.-uScale);
  // pos.y += sin(uTime)*aRandom.x*(1.-uScale);

//   pos *= uScale;
  

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 5.0 / -mvPosition.z;
}