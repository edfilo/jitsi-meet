//
// Credits: https://github.com/BradLarson/GPUImage/blob/master/framework/Source/GPUImageChromaKeyFilter.m
//
$input v_texcoord0, v_color0

#include "common.sh"

SAMPLER2D(s_texColor, 0);

uniform vec4 chromaColor;
uniform vec4 thresholdSensitivity;
uniform vec4 smoothing;

void main()
{
	vec4 inputColor = texture2D(s_texColor, v_texcoord0.xy);

	float maskY = 0.2989 * chromaColor.r + 0.5866 * chromaColor.g + 0.1145 * chromaColor.b;
	float maskCr = 0.7132 * (chromaColor.r - maskY);
	float maskCb = 0.5647 * (chromaColor.b - maskY);

	float Y = 0.2989 * inputColor.r + 0.5866 * inputColor.g + 0.1145 * inputColor.b;
	float Cr = 0.7132 * (inputColor.r - Y);
	float Cb = 0.5647 * (inputColor.b - Y);

	float blendValue = 1.0 - smoothstep(thresholdSensitivity.x, thresholdSensitivity.x + smoothing.x, distance(vec2(Cr, Cb), vec2(maskCr, maskCb)));
	gl_FragColor = vec4(inputColor.rgb, 1.0-blendValue);
}
