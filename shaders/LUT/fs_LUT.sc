$input v_texcoord0, v_color0

#include "common.sh"

SAMPLER2D(s_texColor, 0);
SAMPLER2D(s_texLut, 1);

uniform vec4 lutAmount;

void main()
{
	vec4 inputColor = texture2D(s_texColor, v_texcoord0.xy);
    vec4 outputColor = mix(inputColor, applyLut(inputColor, s_texLut), lutAmount.x);
    outputColor.a=1.0;
	gl_FragColor = outputColor;
}
