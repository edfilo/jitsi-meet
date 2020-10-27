$input v_texcoord0

#include "common.sh"

uniform vec4 u_color;
uniform vec4 u_bright;

SAMPLER2D(s_texColor, 0);

void main()
{

  vec4 img = texture2D(s_texColor, v_texcoord0);

	vec3 contrast = (img.rgb - vec3(.5)) * vec3(u_bright.x) + vec3(.5);
	gl_FragColor =  vec4(contrast * u_color.rgb, img.a);
}
