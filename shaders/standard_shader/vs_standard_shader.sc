$input a_position, a_normal, a_texcoord0
$output v_normal, v_pos, v_texcoord0

#include "common.sh"

//uniform vec3 u_lightPosition;

void main(){
    
    v_normal = vec3(mul(u_modelView, vec4(a_normal.xyz, 0.0))); //normalize(vec4(a_normal.xyz, 1.0)).xyz;

    vec4 vertPos4 = mul(u_modelView, vec4(a_position, 1.0));
    v_pos = vec3(vertPos4) / vertPos4.w;

    v_texcoord0 = a_texcoord0;

    gl_Position = mul(u_modelViewProj,vec4(a_position, 1.0));

}
