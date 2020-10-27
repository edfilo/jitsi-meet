$input v_texcoord0, v_color0

#include "common.sh"

SAMPLER2D(s_texColor, 0);

uniform vec4 u_color;
uniform vec4 u_brightness;

void main()
{
	vec4 inputColor = texture2D(s_texColor, v_texcoord0);
	float gray = dot(inputColor.rgb, vec3(0.299, .333, 0.114));
	gl_FragColor = vec4(gray * u_color.rgb * u_brightness.x, 1.0);
}
