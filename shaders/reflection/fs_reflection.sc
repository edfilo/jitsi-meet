$input v_texcoord0, v_color0, worldVertexPosition, worldNormalDirection, v_position

#include "common.sh"

uniform vec4 u_color;
uniform vec4 u_normalScale;
uniform vec4 u_texScaleX;
uniform vec4 u_texScaleY;

SAMPLER2D(s_texRef, 0);

vec3 cameraPosition = vec3(0.0 ,0.0 ,0.0 );
float posScale = 160.0;
void main()
{
	vec3 normal=normalize(worldNormalDirection);
	vec3 reflCoord = u_normalScale.x * normal + posScale * v_position ;
	float scaleX =  1.0/u_texScaleX.x;
	float scaleY = 1.0/u_texScaleY.x;
	vec2 reflCoord2D = vec2( (reflCoord.x*scaleX + 0.5),  (1.0 - reflCoord.y*scaleY - 0.5));

	vec3 tempout = texture2D(s_texRef, reflCoord2D ).xyz * u_color.xyz;

	gl_FragColor = vec4(tempout, u_color.a);
}
