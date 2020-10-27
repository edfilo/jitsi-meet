$input v_texcoord0, v_texcoord1

#include "common.sh"

SAMPLER2D(s_videoColor, 0);
SAMPLER2D(s_texColor, 1);
SAMPLER2D(s_alphaColor, 2);

uniform vec4 u_mix_factor;

void main()
{
	vec4 videoCol = texture2D(s_videoColor, v_texcoord1);
	vec4 mainCol = texture2D(s_texColor, v_texcoord0);
	vec4 alphaCol = texture2D(s_alphaColor, v_texcoord0);

	float luminance = dot(videoCol, vec4(0.2126, 0.7152, 0.0722, 0));
	vec4 multiply = videoCol*mainCol;
	vec4 blended = mix(multiply, mainCol, luminance);
	vec4 outp = mix(blended, mainCol, alphaCol.a);
	outp.a = alphaCol.a;
	gl_FragColor = outp;
}
