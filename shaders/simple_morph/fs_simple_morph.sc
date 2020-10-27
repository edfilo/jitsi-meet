$input v_texcoord0, v_texcoord1

#include "common.sh"

SAMPLER2D(s_videoColor, 0);
SAMPLER2D(s_alphaMask, 1);

void main()
{
	vec4 videoCol = texture2D(s_videoColor, v_texcoord1);
	vec4 alphaCol = texture2D(s_alphaMask, v_texcoord0);
	videoCol.a = alphaCol.a;
	gl_FragColor = videoCol;
}
