$input v_texcoord0

#extension GL_EXT_shader_framebuffer_fetch : enable
#include "common.sh"

uniform vec4 u_color;
SAMPLER2D(s_texColor, 0);


uniform vec4 u_currentTime;//TimeX
uniform vec4 u_speed;
uniform vec4 u_size;
uniform vec4 u_centerx;
uniform vec4 u_centery;

float _TimeX = u_currentTime.x;
float _Value = u_size.x;
float _Value2 = u_speed.x;
float _Value3 = u_centerx.x;
float _Value4 = u_centery.x;

float noise( vec2 val )
{
    return fract(sin(dot(val.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float getFrameTime()
{
	float time = _TimeX;
    return floor(time * _Value2) / _Value2;
}

void main()
{

 vec4 VideoPixel = texture2D(s_texColor, v_texcoord0).rgba;

 vec2 uv = v_texcoord0;
 vec2 vec = v_texcoord0 - vec2(_Value3,_Value4);
 float PI = 3.141592653589793*_Value;
 float l = length(vec) / length(vec2(1.0,1.0) - vec2(0.5,0.5));
 float r = (atan2(vec.y, vec.x) + PI) / (2.0 * PI);
 float t = getFrameTime();
 t = max(t, 0.1);
 float r2 = floor(r * 700.0) / 700.0 * t;
 float ran = noise( vec2(r2, r2) ) * 0.7 + 0.3;

 float c = l > ran ? abs(l - ran) : 0.0;

 vec4 v=mix(VideoPixel,u_color,c);
 v.a = 1.0;
 gl_FragColor = vec4(v);

}
