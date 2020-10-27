$input v_normal, v_pos, v_texcoord0

#include "common.sh"

uniform vec4 u_diffuseColor;
uniform vec4 u_specularMaterial;
uniform vec4 u_shininess;

uniform vec4 u_ambientColor;

uniform vec4 u_lightPosDir;
uniform vec4 u_lightPosPoint1;
uniform vec4 u_lightPosPoint2;

uniform vec4 u_colorDir;
uniform vec4 u_colorP1;
uniform vec4 u_colorP2;

uniform vec4 u_intensity;


void main(){
    vec3 normal = normalize(v_normal);
    vec3 viewDir = normalize(-v_pos);

    vec4 inputColor = u_diffuseColor;
    float alphaCorrect = 1.0 / inputColor.a;
    // Correct for premultiplied alpha
    inputColor = vec4 (inputColor.r * alphaCorrect, inputColor.g * alphaCorrect, inputColor.b * alphaCorrect, inputColor.a);


    // Calculate directional light
    vec3 directionalLightDir = normalize(-u_lightPosDir.xyz);
    vec4 result1 = CalcDirLight(directionalLightDir, normal, viewDir, 
                                inputColor, u_specularMaterial, vec4(1.0,1.0,1.0,u_specularMaterial.a), u_shininess.x, 
                                u_ambientColor, u_colorDir, u_intensity.x);

    // Fist point light
    vec3 pointLight1Dir = normalize(u_lightPosPoint1.xyz-v_pos);
    float distance1 = length(u_lightPosPoint1.xyz-v_pos) * 0.001;
    vec4 result2 = CalcPointLight(pointLight1Dir, distance1, normal, viewDir, 
                                  inputColor, u_specularMaterial, vec4(1.0,1.0,1.0,u_specularMaterial.a), u_shininess.x, 
                                  u_ambientColor, u_colorP1, u_intensity.y);

    
    // Second point light
    vec3 pointLight2Dir = normalize(u_lightPosPoint2.xyz-v_pos);
    float distance2 = length(u_lightPosPoint2.xyz-v_pos) * 0.001;
    vec4 result3 = CalcPointLight(pointLight2Dir, distance2, normal, viewDir, 
                                  inputColor, u_specularMaterial, vec4(1.0,1.0,1.0,u_specularMaterial.a), u_shininess.x, 
                                  u_ambientColor, u_colorP2, u_intensity.z);

    vec4 result = result1 + result2 + result3;
    gl_FragColor = toGamma(result);
    
    gl_FragColor = vec4 (gl_FragColor.r * u_diffuseColor.a, gl_FragColor.g * u_diffuseColor.a, gl_FragColor.b*u_diffuseColor.a, u_diffuseColor.a);
    gl_FragColor.a = u_diffuseColor.a;
}