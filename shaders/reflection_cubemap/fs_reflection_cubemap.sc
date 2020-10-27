$input v_texcoord0, v_color0, worldVertexPosition, worldNormalDirection

#include "common.sh"

uniform vec4 u_color;
SAMPLERCUBE(s_texCube, 0);


vec3 cameraPosition = vec3(0.0 ,0.0 ,0.0 );

void main()
{
	vec3 incident=normalize(worldVertexPosition-cameraPosition);
	vec3 normal=normalize(worldNormalDirection);
	vec3 reflected=normalize(reflect(incident,normal));
	vec4 tempout =textureCube(s_texCube,reflected)*u_color;
	gl_FragColor = vec4(tempout.xyz, u_color.a);
}
