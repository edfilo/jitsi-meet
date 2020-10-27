$input v_texcoord, v_texcoord_mask, v_color0, v_texcoord0, v_texcoord1, v_texcoord2, v_texcoord3

#include "common.sh"

SAMPLER2D(inputtex, 0);
SAMPLER2D(masktex, 1);
SAMPLER2D(softtex, 2);


uniform vec4 smoothingAmount;
uniform vec4 softAmount;
uniform vec4 softColor;

vec3 softLight(vec3 _target, vec3 _blend)
{
	vec3 lt = _target * (_blend + 0.5); 
	vec3 gte = 1.0 - (1.0-_target)*(1.0-(_blend-0.5));
	return mix(lt, gte, step(vec3_splat(0.5), _target) );
}


void main()
{
	vec4 inputPixel = texture2D(inputtex, v_texcoord.xy);
	vec4 alphaMaskPixel = texture2D(masktex, v_texcoord_mask.xy);
	vec4 softMaskPixel = texture2D(softtex, v_texcoord_mask.xy);

    mat4 neighbours1;
    neighbours1[0] = texture2D(inputtex, v_texcoord0.xy);
    neighbours1[1] = texture2D(inputtex, v_texcoord1.xy);
    neighbours1[2] = texture2D(inputtex, v_texcoord2.xy);
    neighbours1[3] = texture2D(inputtex, v_texcoord3.xy);

	vec4 result = adaptiveSmoothing(inputPixel, neighbours1, smoothingAmount.x*alphaMaskPixel.a);

	vec3 soft = softLight(result.rgb, softColor.rgb);

	result = mix(result, vec4(soft, 1.0), softMaskPixel.a*softAmount.x);
	
	result.a = 1.0;
	gl_FragColor = result;

}
