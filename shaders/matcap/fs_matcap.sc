$input v_texcoord0, v_color0, worldVertexPosition, worldNormalDirection, v_position

#include "common.sh"

SAMPLER2D(s_texColor, 0);
SAMPLER2D(s_texMask, 1);

uniform vec4 u_color;

vec2 matcap(vec3 eye, vec3 normal) {
  vec3 r = reflect(eye, normal);
  float m = 2.0 * sqrt(r.x*r.x+r.y*r.y+(r.z+1.0)*(r.z+1.0));
  vec2 uv =  r.xy / m + 0.5;
  return uv;
}

vec3 cameraPosition = vec3(0.0 ,0.0 ,0.0 );

void main()
{
  vec3 eye=normalize(cameraPosition - worldVertexPosition);
  vec3 normal=normalize(worldNormalDirection);
  vec2 uv = matcap(eye, normal).xy;
  vec4 mask = texture2D(s_texMask, v_texcoord0);

  vec4 matcapOut = vec4(texture2D(s_texColor, uv).rgb, 1.0) * u_color;
  matcapOut.a = matcapOut.a * mask.a;
  gl_FragColor = matcapOut;
}
