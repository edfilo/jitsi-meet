$input v_texcoord0, v_texcoord1

#include "common.sh"

SAMPLER2D(s_texColor, 0);
SAMPLER2D(s_texAlpha, 1);

uniform vec4 newColor;

void main()
{
	vec4 videoCol = texture2D(s_texColor, v_texcoord1);
	vec4 alphaCol = texture2D(s_texAlpha, v_texcoord0);

	vec3 overlay = blendOverlay(videoCol.rgb, newColor.rgb);
	vec3 outp = mix(videoCol.rgb, overlay, alphaCol.a);

	gl_FragColor = vec4(outp, 1.0);
}
