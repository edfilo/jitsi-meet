$input a_position, a_normal, a_color0, a_texcoord0
$output v_texcoord0, v_color0, worldVertexPosition, worldNormalDirection, v_position

#include "common.sh"

void main()
{
	v_position = a_position;
	gl_Position=u_modelViewProj*vec4(a_position,1.0);
	worldVertexPosition=(u_modelView*vec4(a_position,1.0)).xyz;
	worldNormalDirection=mat3(u_modelView)*a_normal;
	v_texcoord0 = a_texcoord0;
	v_color0 = a_color0;
}
