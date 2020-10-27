$input v_texcoord, v_color0, v_texcoord0, v_texcoord1, v_texcoord2, v_texcoord3, v_texcoord_mask

#include "common.sh"

SAMPLER2D(inputtex, 0);
SAMPLER2D(masktex, 1);
SAMPLER2D(lut, 2);

uniform vec4 lutAmount;
uniform vec4 smoothingAmount;

void main()
{
	vec4 result = texture2D(inputtex, v_texcoord.xy);
	vec4 mask = texture2D(masktex, v_texcoord_mask.xy);

    mat4 neighbours;
    neighbours[0] = texture2D(inputtex, v_texcoord0.xy);
    neighbours[1] = texture2D(inputtex, v_texcoord1.xy);
    neighbours[2] = texture2D(inputtex, v_texcoord2.xy);
    neighbours[3] = texture2D(inputtex, v_texcoord3.xy);

	result = adaptiveSmoothing(result, neighbours, mask.a*smoothingAmount.x);
    result = mix(result, applyLut(result, lut), lutAmount.x*mask.a);

	result.a = 1.0;
	gl_FragColor = result;
}
