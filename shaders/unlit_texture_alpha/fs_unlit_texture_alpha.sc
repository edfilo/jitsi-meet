$input v_texcoord0, v_texcoord1, v_color0

#include "common.sh"

SAMPLER2D(s_texColor, 0);
SAMPLER2D(s_texAlpha, 1);

uniform vec4 u_color;

void main()
{

	vec4 col = texture2D(s_texColor, v_texcoord0) * u_color;
	vec4 alp = texture2D(s_texAlpha, v_texcoord0);
	col.a = alp.a * u_color.a;

	gl_FragColor = col;
}
