$input a_position, a_normal, a_color0, a_texcoord0
$output v_texcoord0, v_color0, worldVertexPosition, worldNormalDirection, v_position

#include "common.sh"

void main()
{
	v_position = a_position;
	worldVertexPosition=(mul(u_modelView,vec4(a_position,1.0))).xyz;
	worldNormalDirection= mul (mat3(u_modelView),a_normal.xyz);

    v_texcoord0 = a_texcoord0;
 	gl_Position= mul(u_modelViewProj,vec4(a_position,1.0));
}
