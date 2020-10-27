
import {tt1, tt2, tt3, tt4} from './tattoofonts'


export class Filter {

  constructor(width, height, canvasRef, defaultFX) {

      this.slugs = ['face', 'eyes', 'drink', 'smoke', 'tattoo'];

      this.width = width;
      this.height = height;

      this._deepAR = DeepAR({
              canvasWidth: this.width,
              canvasHeight: this.height,
              licenseKey: '0c9b0922576ac747bce897c5007ed4084cafafb6d2fee1ebb409f3d4d995513218678323828fb3a0',
              canvas: canvasRef,
              numberOfFaces: 1,
              onInitialize: function() {

                // start video immediately after the initalization, mirror = true
                this._deepAR.startVideo(false);

                this._startFX();

                this.applyFX(defaultFX);


              }.bind(this)

      });

      this._deepAR.downloadFaceTrackingModel('/deepar/models-68-extreme.bin');



    }

    _startFX() {



      this._deepAR.switchEffect(0, 'face', '/effects/face', function() {

        this._deepAR.switchEffect(0, 'eyes', '/effects/eyes', function() {

        }.bind(this));

      }.bind(this));



      this._deepAR.switchEffect(0, 'drink', '/effects/drink', function() {

      }.bind(this));

      this._deepAR.switchEffect(0, 'smoke', '/effects/smoke', function() {

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


    _process(slug, myfx) {

      /*
      0% she hates me because i didnt listen
      100%  shes doesnt hate me but gave me a timeout
      */

      /*
      const needsFace =  myfx.find(item => item.slug == 'face') ||  myfx.find(item => item.slug == 'tattoo');
      const needsEyes =  myfx.find(item => item.slug == 'eyes');
      const needsSmoke =  myfx.find(item => item.slug == 'smoke');
      const needsDrink =  myfx.find(item => item.slug == 'drink');

      if(!this.face && needsFace){
        this.face = this._deepAR.switchEffect(0, 'face', '/effects/face', function() {

          this._activeSlugs[filterslug] = true;
          this._setParams(fxItem);

        }.bind(this));
      }else if(this.face && !needsFace){
        this.face == null;
      }




      const filterslug = slug == 'tattoo' ? 'face' : slug;

      const fxItem = myfx.find(item => item.slug == filterslug);

      const active = this._activeSlugs[filterslug];

      if(fxItem && active) {
        this._setParams(fxItem);
      } else if(!fxItem && active) {
        this._deepAR.clearEffect(filterslug);
        this._activeSlugs[filterslug] = false;
      } else if(fxItem && !active) {

        this._deepAR.switchEffect(0, filterslug, '/effects/' + filterslug, function() {
          this._activeSlugs[filterslug] = true;
          this._setParams(fxItem);
        }.bind(this));
      }
      */

    }

/*
    applyFX(myfx) {

      console.log('applying fx this is heavy');
      var that = this;
      var result = Promise.resolve();
      this.slugs.forEach(slug => {
        result = result.then(() => that._process(slug, myfx));
      });
    }
*/

    /*
      2-3 trips to bills house
      w bill pre birthday
    */

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



    _renderTattooTexture(items) {


      var middle = ``;

      for(var i = 0; i < items.length; i++) {

        const text = items[i].text; //this.state.preview.text;
        const path = items[i].path; //this.state.preview.path
        const fontFamily = items[i].fontFamily;
        const fontSize = items[i].fontSize;

        const dpath = 'M ' + path[0] + ' ' + path[1] + ' ' + 'Q' + path[2] + ' ' + path[3] + ' ' + path[4] + ' ' + path[5];

        middle += `<path id="text-path-1" style="fill:none;" d="${dpath}" stroke="transparent" stroke-width="2"></path>
                <text>
                <textPath xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#text-path-1" startOffset="50%" text-anchor="middle">
                  <tspan style="fill:rgba(20,0,100,1.0); font-size:${fontSize}px; font-family:${fontFamily}">${text}</tspan>
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

    c.fillStyle = 'transparent';
    c.fillRect(0, 0, canvas.width, canvas.height);

    this._drawSvgToCanvas(svg, function(img) {
    console.log(img);
    c.drawImage(img, 0, 0);
    this.tattooTexture = canvas.toDataURL();

    //this.setState({preview:{...this.state.preview, imageUrl:urlForTensor}});
    //this._tryOn(this.state.preview);



    }.bind(this));



    }



    applyFX(myfx) {

      const faceItem =  myfx.find(item => item.slug == 'face');
      const eyesItem =  myfx.find(item => item.slug == 'eyes');
      const smokeItem =  myfx.find(item => item.slug == 'smoke');
      const drinkItem =  myfx.find(item => item.slug == 'drink');

      //note you can have many at once...
      const tattooItems =  myfx.filter(item => item.slug == 'tattoo');

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
      }

      //if(item.hue || item.sat){
      //  const color = this.hslToRgb(item.hue, 1.0, .5);
      //  this._deepAR.changeParameterVector('Face', 'MeshRenderer', 'softColor', 0.0, 0.0, 0.1, 1.0);
      //}

      if(tattooItems.length > 0) {
        this._deepAR.changeParameterTexture('Face', 'MeshRenderer', 'softtex', this._renderTattooTexture(tattooItems));
      }

      if (smokeItem) {
        this._deepAR.changeParameterVector('Smoke', 'MeshRenderer', 'u_color', smokeItem.r, smokeItem.g, smokeItem.b, 1.0);
      }

      if (drinkItem) {
        const d = (drinkItem.drink == 'none') ? 'blank' : drinkItem.drink;
        this._deepAR.changeParameterTexture('Drink', 'MeshRenderer', 's_texColor', '/img/' + d + '.png');
      }

    }

}
