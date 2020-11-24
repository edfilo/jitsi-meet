
import {tt1, tt2, tt3, tt4} from './tattoofonts'


export class Filter {

  constructor(width, height, canvasRef, fx, flip) {


      //canvasRef.getContext('webgl' , {preserveDrawingBuffer: false});

      this.slugs = ['face', 'eyes', 'drink', 'smoke', 'tattoo'];

      this.width = width;
      this.height = height;
      this.fx = fx;

      this._deepAR = DeepAR({
              canvasWidth: this.width,
              canvasHeight: this.height,
              licenseKey: '0c9b0922576ac747bce897c5007ed4084cafafb6d2fee1ebb409f3d4d995513218678323828fb3a0',
              canvas: canvasRef,
              numberOfFaces: 1,
              onInitialize: function() {

                // start video immediately after the initalization, mirror = true
                this._deepAR.startVideo(flip);

                this._startFX();

                if(flip){
                  canvasRef.style.width = 220;
                  canvasRef.style.height = 176;
                  canvasRef.style.objectFit = 'cover';
                }else {

                  canvasRef.style.width = '100%';
                  canvasRef.style.height = '100%';
                  canvasRef.style.objectFit = 'cover';

                }




              }.bind(this)

      });

      this._deepAR.downloadFaceTrackingModel('/deepar/models-68-extreme.bin');



    }

    _startFX() {



      this._deepAR.switchEffect(0, 'face', '/effects/face', function() {

        this._deepAR.switchEffect(0, 'eyes', '/effects/eyes', function() {

          this._deepAR.switchEffect(0, 'drink', '/effects/drink', function() {

            this._deepAR.switchEffect(0, 'smoke', '/effects/smoke', function() {

                this.applyFX(this.fx);
            }.bind(this));


          }.bind(this));


        }.bind(this));

      }.bind(this));






    }

    hslToRgb(h, s, l){
      var r, g, b;

      if(s == 0){
          r = g = b = l; // achromatic
      }else{
          var hue2rgb = function hue2rgb(p, q, t){
              if(t < 0) t += 1;
              if(t > 1) t -= 1;
              if(t < 1/6) return p + (q - p) * 6 * t;
              if(t < 1/2) return q;
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          }

          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
      }

      return {r:r, g:g, b:b};

  }



    //face
    // drink
    // smoke
    // eyes

    _getFilterForSlug(slug){
      if(slug == 'tattoo')return 'face';
      return slug;
    }




    _utf8ToBase64(str) {
      str = str.replace(/\&nbsp\;/g, ' ');
      return window.btoa(unescape(encodeURIComponent(str)));
    };

    _drawSvgToCanvas(svg, ready) {

      var SVG_DATA_IMG = 'data:image/svg+xml;base64, ';

      var img = new Image();

      img.crossOrigin = 'Anonymous';
      img.src = SVG_DATA_IMG + this._utf8ToBase64(svg);

      img.addEventListener('load', function() {
        ready(img);
      });

    };



    _renderTattooTexture(tat) {


      const items = [
        {location:'forehead', path:[180, 160, 255, 130, 330, 160]},
        {location:'left brow', path:[170, 180, 200, 170, 230, 180]},
        {location:'right brow', path:[282, 180, 312, 170, 342, 180]},
        {location:'left eye', path:[170, 245, 195, 245, 220, 245]},
        {location:'right eye', path:[292, 245, 317, 245, 342, 245]}
      ];


      var middle = ``;

      const fontFamily = 'tattoo1';// tat.fontFamily;
      const fontSize = tat.fontSize;



      console.log('font is ' + fontFamily);


      for(var i = 0; i < items.length; i++) {

        const item = items[i];

        const text = tat[item.location];


        //this.state.preview.text;
        const path = items[i].path; //this.state.preview.path


        const dpath = 'M ' + path[0] + ' ' + path[1] + ' ' + 'Q' + path[2] + ' ' + path[3] + ' ' + path[4] + ' ' + path[5];

        const boost = i==0 ? 15 : 0;
        const fs = fontSize + boost;
        middle += `<path id="text-path-${i}" style="fill:none;" d="${dpath}" stroke="transparent" stroke-width="2"></path>
                <text>
                <textPath xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#text-path-${i}" startOffset="50%" text-anchor="middle">
                  <tspan style="fill:rgba(0,0,0,1.0); font-size:${fs}px; font-family:${fontFamily}">${text}</tspan>
                </textPath>
                </text>`
      }




      var canvas = document.createElement('canvas'),
      c = canvas.getContext('2d'),
      width = 512,
      height = 512,
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <style type="text/css"><![CDATA[
          ${tt1}
          ${tt2}
          ${tt3}
          ${tt4}
        ]]>
        </style>
      </defs>${middle}</svg>`;


    canvas.width = width
    canvas.height = height;
    document.body.appendChild(canvas);

    canvas.style.display = 'none';

    c.fillStyle = 'transparent';
    c.fillRect(0, 0, canvas.width, canvas.height);

    this._drawSvgToCanvas(svg, function(img) {
    console.log(img);
    c.drawImage(img, 0, 0);
    this.tattooTexture = canvas.toDataURL();

    this._deepAR.changeParameterTexture('Face', 'MeshRenderer', 'softtex', this.tattooTexture);

    }.bind(this));



    }



    applyFX(myfx) {

    //  $('#localVideoWrapper').append($('#deepar-canvas'));
    //  $('#deepar-canvas').css({position:'absolute', width:'100%', height:'100%', display:'block', objectFit:'cover', left:'0'});


      this.fx = myfx;

      const faceItem =  myfx.find(item => item.slug == 'face');
      const eyesItem =  myfx.find(item => item.slug == 'eyes');
      const smokeItem =  myfx.find(item => item.slug == 'smoke');
      const drinkItem =  myfx.find(item => item.slug == 'drink');

      const tattooItem =  myfx.find(item => item.slug == 'tattoo');



/*
      this._deepAR.changeParameterFloat('Face', '', 'Enabled', !!faceItem);
      this._deepAR.changeParameterFloat('Eyes', '', 'Enabled', !!eyesItem);
      this._deepAR.changeParameterFloat('Drink', '', 'Enabled', !!drinkItem);
      this._deepAR.changeParameterFloat('Smoke', '', 'Enabled', !!smokeItem);
*/

      if(faceItem){
        if(faceItem.chin_raise)this._deepAR.changeParameterFloat('Face', 'MeshRenderer', 'chin_raise', faceItem.chin_raise);
        if(faceItem.big_eyes)this._deepAR.changeParameterFloat('Face', 'MeshRenderer', 'big_eyes', faceItem.big_eyes);
        if(faceItem.face_narrow)this._deepAR.changeParameterFloat('Face', 'MeshRenderer', 'face_narrow', faceItem.face_narrow * -1.0);
        if(faceItem.nose_small)this._deepAR.changeParameterFloat('Face', 'MeshRenderer', 'nose_small', faceItem.nose_small * -1.0);
      }else {
        this._deepAR.changeParameterFloat('Face', 'MeshRenderer', 'chin_raise', 0);
        this._deepAR.changeParameterFloat('Face', 'MeshRenderer', 'big_eyes', 0);
        this._deepAR.changeParameterFloat('Face', 'MeshRenderer', 'face_narrow', 0);
        this._deepAR.changeParameterFloat('Face', 'MeshRenderer', 'nose_small', 0);
      }


    if(tattooItem) {
      this._renderTattooTexture(tattooItem);
    }else {
      this._deepAR.changeParameterTexture('Face', 'MeshRenderer', 'softtex', '/img/blank.png');
    }

      if (smokeItem) {

          this._deepAR.changeParameterBool('Smoke', '', 'enabled', true);
          this._deepAR.changeParameterVector('Smoke', 'MeshRenderer', 'u_color', smokeItem.r, smokeItem.g, smokeItem.b, 1.0);

      }else {

          this._deepAR.changeParameterBool('Smoke', '', 'enabled', false);
      }

      if(eyesItem) {
        this._deepAR.changeParameterBool('eyelashes', '', 'enabled', true);
        this._deepAR.changeParameterBool('eyeshadow', '', 'enabled', true);
        this._deepAR.changeParameterBool('eyeliner', '', 'enabled', true);

        this._deepAR.changeParameterVector('eyeshadow', 'MeshRenderer', 'u_color', eyesItem.r, eyesItem.g, eyesItem.b, 0.5);

      }else {
          this._deepAR.changeParameterBool('eyeliner', '', 'enabled', false);
          this._deepAR.changeParameterBool('eyelashes', '', 'enabled', false);
          this._deepAR.changeParameterBool('eyeshadow', '', 'enabled', false);
      }

      if (drinkItem) {
        const d = (drinkItem.drink == 'none') ? 'blank' : drinkItem.drink;
        this._deepAR.changeParameterTexture('Drink', 'MeshRenderer', 's_texColor', '/img/' + d + '.png');
      }else {
        this._deepAR.changeParameterTexture('Drink', 'MeshRenderer', 's_texColor', '/img/blank.png');
      }

    }

}
