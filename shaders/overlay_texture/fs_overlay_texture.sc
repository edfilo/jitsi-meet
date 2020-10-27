$input v_texcoord0, v_texcoord1

#include "common.sh"

SAMPLER2D(s_texColor, 0);
SAMPLER2D(s_texOverlay, 1);

uniform vec4 newColor;

void main()
{
	vec4 videoCol = texture2D(s_texColor, v_texcoord1);
	vec4 overlayCol = texture2D(s_texOverlay, v_texcoord0);

	vec3 overlay = blendOverlay(videoCol.rgb, overlayCol.rgb*newColor.rgb);
	vec3 outp = mix(videoCol.rgb, overlay, overlayCol.a);

	gl_FragColor = vec4(outp, overlayCol.a*newColor.a);
}
