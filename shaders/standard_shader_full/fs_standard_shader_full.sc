$input  v_wpos, v_view, v_normal, v_tangent, v_bitangent, v_texcoord0

#include "common.sh"

SAMPLER2D(s_texDiffuse, 0);
SAMPLER2D(s_texSpecular, 1);
SAMPLER2D(s_texNormal, 2);

uniform vec4 u_diffuseColor;

uniform vec4 u_shininess;
uniform vec4 u_specular_color;

uniform vec4 u_ambientColor;

uniform vec4 u_lightPosDir;
uniform vec4 u_lightPosPoint1;
uniform vec4 u_lightPosPoint2;

uniform vec4 u_colorDir;
uniform vec4 u_colorP1;
uniform vec4 u_colorP2;

uniform vec4 u_intensity;


void main(){

  mat3 tbn = mat3(
    normalize(v_tangent),
    normalize(v_bitangent),
    normalize(v_normal)
  );

  vec3 normal = texture2D(s_texNormal, v_texcoord0).xyz;
  normal = normalize(normal * 2.0 - 1.0);
  vec3 viewDir = normalize(-v_view);

  vec4 inputColor = texture2D(s_texDiffuse, v_texcoord0);
  float alphaCorrect = 1.0 / inputColor.a;
  // Correct for premultiplied alpha
  inputColor = vec4 (inputColor.r * alphaCorrect, inputColor.g * alphaCorrect, inputColor.b * alphaCorrect, inputColor.a);
  vec4 diffuseColor = toLinear(inputColor)*u_diffuseColor;
  vec4 specularMaterial = texture2D(s_texSpecular, v_texcoord0);

  
  vec3 directionalLightDir = mul(tbn, normalize(-u_lightPosDir.xyz));
  vec4 directionalLight = CalcDirLight(directionalLightDir, normal, viewDir, 
                                       diffuseColor, specularMaterial, u_specular_color, u_shininess.x, 
                                       u_ambientColor, u_colorDir, u_intensity.x);
  
  vec3 pointLight1Dir = mul(tbn, normalize(u_lightPosPoint1.xyz-v_wpos));
  float distance1 = length(u_lightPosPoint1.xyz-v_wpos) * 0.001;
  vec4 pointLight1 = CalcPointLight(pointLight1Dir, distance1, normal, viewDir, 
                                    diffuseColor, specularMaterial, u_specular_color, u_shininess.x, 
                                    u_ambientColor, u_colorP1, u_intensity.y);
  
  vec3 pointLight2Dir = mul(tbn, normalize(u_lightPosPoint2.xyz-v_wpos));
  float distance2 = length(u_lightPosPoint2.xyz-v_wpos) * 0.001;
  vec4 pointLight2 = CalcPointLight(pointLight2Dir, distance2, normal, viewDir, 
                                   diffuseColor, specularMaterial, u_specular_color, u_shininess.x, 
                                   u_ambientColor, u_colorP2, u_intensity.z);


  gl_FragColor.xyz = (directionalLight + pointLight1 + pointLight2).xyz;
  gl_FragColor = toGamma(gl_FragColor);
  gl_FragColor = vec4 (gl_FragColor.r * diffuseColor.a, gl_FragColor.g * diffuseColor.a, gl_FragColor.b*diffuseColor.a, diffuseColor.a);
  gl_FragColor.w = inputColor.a;

}
