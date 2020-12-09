// @flow


import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import { Dialog } from '../../../base/dialog';
import { Column, Row } from 'simple-flexbox';

import { toggleBlurEffect, addPurchasedItems, setActiveItems, activateItems} from '../../../blur/actions';


import type { Dispatch } from 'redux';
import { connect } from '../../../base/redux';

import { Filter } from '../../../stream-effects/blur/filter'

import {tt1, tt2, tt3, tt4} from '../../../stream-effects/blur/tattoofonts'

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';




/**Deep
* Implements a React {@link Component} which displays the component
* {@code VideoQualitySlider} in a dialog.
*
* @extends Component
*/


type Props = {


  /**
  * Redux store dispatch method.
  */
  activeItems : Array,
  purchasedItems : Array,
  dispatch: Dispatch<any>




};

class BeerMenu extends Component<Props> {
  /**
  * Implements React's {@link Component#render()}.
  *
  * @inheritdoc
  * @returns {ReactElement}
  */



  static defaultProps = {
    activeItems: [],
    purchasedItems: []
  };

  constructor(props: Props) {

    super(props);
    this.myRef = React.createRef();
    this.state = {'preview': {slug:'none'}};

  }


  _onTat(drink) {

  }

  _removeItemFromExistingItems(newitem) {

    var newitems = [];
    newitems = this.props.activeItems.filter(obj => (newitem.slug !== obj.slug));
    //newitems.push(newitem);
    return newitems;

  }


  _addNewItemToExistingItems(newitem) {

    var newitems = [];
    newitems = this.props.activeItems.filter(obj => (newitem.slug !== obj.slug));
    newitems.push(newitem);
    return newitems;

  }

  _tryOn(item) {

    this.myRef.current.style.height = 176;
    this.myRef.current.style.width = 220;
    this.myRef.current.style.objectFit = 'cover';
    this.setState({preview:item});
    const stuff = this._addNewItemToExistingItems(item);


    if(this.filter){
      this.filter.applyFX(stuff);
    }

  }

  _onBuy() {

    alert('Enjoy your '+ this.makeTitle() +'');
    this.props.dispatch(activateItems(this._addNewItemToExistingItems(this.state.preview)));
    this.setState({preview:{slug:'none'}});

  }

  _onRemove() {

    const newItems = this._removeItemFromExistingItems(this.state.preview);

    this.props.dispatch(activateItems(newItems));
    this.setState({preview:{slug:'none'}});
    if(this.filter){
      //debugger;
      this.filter.applyFX(newItems);
    }


  }

  crayons = [
  //{name:'none', r:-1, g: -1, b:-1},
  {name:'white', r:255, g:255, b:255},
  {name:'cantaloupe', r:255, g:206, b:110},
  {name:'honeydew'  , r:206, g:250, b:110},
  {name:'spindrift' , r:104, g:251, b:208},
  {name:'sky'      , r:106, g:207, b:255},
  {name:'lavender'  , r:210, g:120, b:255},
  {name:'carnation' , r:255, g:127, b:211},
  {name:'licorice'  , r:0, g:0, b:0},
  //  {name:'snow'      , r:255, g:255, b:255},
  {name:'salmon'    , r:255, g:114, b:110},
  {name:'banana'    , r:255, g:251, b:109},
  {name:'flora'    , r:104, g:249, b:110},
  {name:'ice'       , r:104, g:253, b:255},
  {name:'orchid'    , r:110, g:118, b:255},
  {name:'bubblegum' , r:255, g:122, b:255},
  //  {name:'lead'      , r:30, g:30, b:30},
  //  {name:'mercury'   , r:232, g:232, b:232},
  {name:'tangerine' , r:255, g:136, b:2},
  {name:'lime'      , r:131, g:249, b:2},
  {name:'seam-foam' , r:3, g:249, b:135},
  {name:'aqua'      , r:0, g:140, b:255},
  {name:'grape'     , r:137, g:49, b:255},
  {name:'strawberry', r:255, g:41, b:135},
  {name:'tungsten'  , r:58, g:58, b:58},
  {name:'silver'    , r:208, g:208, b:208},
  {name:'maraschino', r:255, g:33, b:1},
  {name:'lemon'     , r:255, g:250, b:3},
  {name:'spring'    , r:5, g:248, b:2},
  {name:'turquoise' , r:0, g:253, b:255},
  {name:'blueberry' , r:0, g:46, b:255},
  {name:'magenta'   , r:255, g:57, b:255},
  //{name:'iron'      , r:84, g:84, b:83},
  //  {name:'magnesium' , r:184, g:184, b:184},
  {name:'mocha'     , r:137, g:72, b:0},
  {name:'fern'      , r:69, g:132, b:1},
  {name:'moss'      , r:1, g:132, b:72},
  {name:'ocean'     , r:0, g:74, b:136},
  {name:'eggplant'  , r:73, g:26, b:136},
  {name:'maroon'    , r:137, g:22, b:72},
  {name:'steel'     , r:110, g:110, b:110},
  {name:'aluminum'  , r:160, g:159, b:160},
  {name:'cayenne'   , r:137, g:17, b:0},
  {name:'aspargus'  , r:136, g:133, b:1},
  {name:'clover'    , r:2, g:132, b:1},
  {name:'teal'      , r:0, g:134, b:136},
  {name:'midnight'  , r:0, g:24, b:136},
  {name:'plum'      , r:137, g:30, b:136},
  {name:'tin'       , r:135, g:134, b:135}];


  tattoos = ['forehead', 'left brow', 'right brow', 'left eye', 'right eye'];

  smokeColors = ['white', 'lemon', 'lime', 'strawberry', 'moss', 'ocean', 'lemon', 'turquoise', 'bubblegum'];




  //  {location:'left cheek', path:[170, 230, 195, 230, 220, 230],
  //  {location:'right cheek', path:[292, 230, 317, 230, 342, 230]

  headingStyle = {fontSize:12, fontWeight:'normal', color:'#aaa', textTransform:'uppercase'};

  instructionStyle = {
    color:'#aaa',
    fontSize:11,
    textAlign:'center',
    textTransform:'uppercase',
    justifyContent:'center'
  }


  _onStore(slug) {

    var item = {slug:slug};

    const existingItem = this.props.activeItems.filter(obj => (obj.slug == slug))[0];

    if(slug == 'eyes') {
      item = existingItem || {slug:'eyes', r:0.0, g:0.0, b:0.0, name:'licorice'};
    }

    if(slug == 'smoke') {
      item = existingItem || {slug:'smoke', r:1.0, g:1.0, b:1.0, name:'white'};
    }

    if(slug == 'face') {
      item = existingItem || {slug:'face', chin_raise:0, big_eyes:0, face_narrow:0, nose_small:0};
    }

    if(slug == 'tattoo') {
      item =  existingItem || {slug:'tattoo', 'forehead' : 'Eds Vbar', 'right eye':'', 'left eye':'', 'left brow':'', 'right brow':'',  fontSize:20, fontFamily:'tattoo2'};
    }

    this.setState({preview:item});
    this._tryOn(item);
  }

  _onDrink(drink) {
    const item = {slug:'drink', drink:drink};
    this._tryOn(item);
  }


  _onFaceSliderSlid(slider,val) {

    const item =  {...this.state.preview};
    item[slider.slug] = val;
    this._tryOn(item);

  }

  _onEyeShadowColor(color) {

    const item = {slug:'eyes', r:color.r/255.0, g:color.g/255.0, b:color.b/255.0, name:color.name};
    this._tryOn(item);

  }


  _onSmokeColor(color) {

    const item = {slug:'smoke', r:color.r/255.0, g:color.g/255.0, b:color.b/255.0, name:color.name};
    this._tryOn(item);

  }

  _onLipColor(color) {
    const item = {slug:'lips', r:color.r/255.0, g:color.g/255.0, b:color.b/255.0};
    this._tryOn(item);
  }


  componentDidMount() {

    this._loadPreview();


  }

  _loadPreview() {

    setTimeout(() => {


      this.filter = new Filter(300, 300, this.myRef.current, this.props.activeItems, true);

      setTimeout(() => {

        //this.myRef.current.style.width = 250;
        //this.myRef.current.style.height = 200;
        //this.myRef.current.objectFit = 'cover';


        }, 1);


        }, 1);
      }

      _isDrinkActive(drink) {
        return !!this.props.activeItems.find(item => item.drink === drink);
        //this.props.activeItems.every(function(item) {
        //   if(item.drink == drink)return true;
        //  });
        //  return false;
      }


      _handlePathChange(event) {

        //const patharray =  Object.assign([], this.state.preview.path, {event.target.id:event.target.value});
        var patharray = this.state.preview.path;
        patharray[event.target.id] = event.target.value;

        const item = {...this.state.preview, path:patharray};
        this._tryOn(item);
        this.setState({preview:item});

      }


      _handleTextChange(event) {
        const item = {...this.state.preview, text:event.target.value};
        this._tryOn(item);
        //  this.setState({preview:item});
      }

      _onTatPo(location) {
        const item = {...this.state.preview, location:location, path:this.tattooLocations[location]};
        this._tryOn(item);
        this.setState({preview:item});
      }

      _renderCatSettings() {
        const cats = '(coming soon)';
        return (<Column alignItems = "center" justifyContent = "start" flex = "100%">
        <Row style = {this.instructionStyle}><div>Invite Cat</div></Row>
        <Row wrap = {true}>{cats}</Row>
        </Column>);
      }



      _handleTattooTextChange(event) {

        const tatloc =  this.tattoos[event.target.id];
        var item = {...this.state.preview};
        item[tatloc] = event.target.value;
        this._tryOn(item);

      }





      _renderLipsSettings() {
        return <div>lips</div>
      }

      _renderEyesSettings() {



        const colorButtons = this.crayons.map((color, idx, arr) =>
        <Column alignItems = "start" flex = "1" key={'iiiissssww'+idx}>
        <button key={'color'+idx} style={{height:20, width:20, borderRadius:10,  border:'solid #222 0px',  backgroundColor:'rgb('+ color.r + ', '+ color.g +', ' + color.b + ')'}}
        onClick={this._onEyeShadowColor.bind(this,color)}>
        </button>
        </Column>);

        return (<Column flex = "1" justifyContent = "start">
        <Row wrap={true}>{colorButtons}</Row>
        </Column>);

      }



      _renderSmokeSettings() {

        const smokecolors = this.crayons.slice(8, 19);
        const colorButtons = smokecolors.map((color, idx, arr) =>
        <Column flex = "1" key={'wwww'+idx}>
        <button key={'color'+idx} style={{height:30, width:30, borderColor:'white', borderRadius:15,  border:'solid white 1px' , borderWidth:(this.state.preview.name === color.name) ? 2 : 1,  backgroundColor:'rgb('+ color.r + ', '+ color.g +', ' + color.b + ')'}}
        onClick={this._onSmokeColor.bind(this,color)}>
        </button>
        </Column>);

        return(<Column flex = "1">
        <Row flex = "1" wrap = {true}>{colorButtons}</Row>
        </Column>);

      }



      _renderDrinkSettings() {

        return (
          <Column alignItems = "end" flex = "1" style = {{marginTop:5, marginRight:5, color:'white', fontSize:15, textAlign:'right'}}>
          {this.makeDrink(this.state.preview)}
          </Column>);



        }

        _renderTips() {

          var tip = 'Please leave a tip for your drinks.  Our servers are working really hard!';

          const tipButtonStyle = {
            width:90,
            height:40,
            color:'white',
            backgroundSize:'contain',
            backgroundPosition:'center',
            border:'solid gray 0px',
            backgroundRepeat:'no-repeat',
            borderRadius:20
          };

          return (<Column flex = "1" alignItems = "center" justifyContent = "center">

          <Row justifyContent = "center" width = "100%">
          <Column><button onClick= {this._onPaypal.bind(this)}style = {{...tipButtonStyle, backgroundImage:'url(/img/paypal.png)', backgroundColor:'white'}}/></Column>
          <Column flex = "0 0 15px"><div></div></Column>
        {/*  <Column><button onClick= {this._onVenmo.bind(this)} style = {{...tipButtonStyle, backgroundImage:'url(/img/venmo.png)'}}/></Column>*/}

          </Row>
          </Column>);
        }

        _renderTattooSettings() {

          const tattooTextFields = this.tattoos.map((tat, idx, arr) =>
          <Column flex = "0 0 20%"  style = {{textAlign:'center',border:'solid green 0px', xbackgroundColor:'yellow'}} key = {idx + 'ajooosdf'}>


          <Row><input id= {idx} style = {{width:'100%',height:25, border:'solid #333 1px', marginTop:'3px',  borderRadius:'10px'}}
          value = {this.state.preview[tat]}
          type="text" onChange={this._handleTattooTextChange.bind(this)} />
          </Row>

          <Row justifyContent = "center">
          <div style = {{color:'white',fontSize:10, textTransform:'uppercase', textAlign:'center'}}>{tat}</div>
          </Row>

          </Column>);


          return (
            <Column flex = "1">
            <Row >
            {tattooTextFields}
            </Row>
            </Column>);
          };



          _renderFaceSettings() {

            const sliders = [
            {title:'chin', slug:'chin_raise', min:-100, max:100, val:0}
            ,{title:'eyes', slug:'big_eyes', min:-100, max:100, val:0}
            ,{title:'face', slug:'face_narrow', min:-100, max:100, val:0}
            ,{title:'nose', slug:'nose_small', min:-100, max:100, val:0}
            ];

            const slideruis = sliders.map((slider, idx, arr) =>

            <Column flex="0 0 25%">
            <Row>
            <Slider style= {{marginTop:10, width:'90%', marginLeft:'5%'}} step = {slider.max > 1 ? 1 : .01} min = {slider.min} max = {slider.max} defaultValue={this.state.preview[slider.slug]} onAfterChange={this._onFaceSliderSlid.bind(this, slider)} />
            </Row>
            <Row>
            <div style={{width:'100%',color:'white', fontSize:10, textAlign:'center',textTransform:'uppercase'}}>{slider.title}</div>
            </Row>
            </Column>

            );


            return (<Column flex = "1">
            <Row>{slideruis}</Row>
            </Column>);
          }

          _renderFollow() {

            var follow = '<a href="mailto:edsvirtualbar@gmail.com">edsvirtualbar@gmail.com</a>'
            + '<a href="https://facebook.com/edsvbar">facebook</a>'
            + '<a href="https://instagram.com/edsvbar">instagram</a>'
            + '<a href="http://twitter.com/edsvbar">twitter</a>';

            <Row style = {this.instructionStyle}>Follow</Row>
            {follow}

          }

          _onVenmo() {
            window.open('https://venmo.com/edfilo', '_blank');
          }

          _onPaypal() {
            window.open('https://paypal.me/edfilo', '_blank');
          }



          makeDrink(item) {

            if(!item.drink)return '';

            if(item.drink == 'beer')return 'Draft Beer';
            if(item.drink == 'icedcoffee')return 'Large Iced Coffee';
            if(item.drink == 'whiteclaw')return 'Seltzer';
            if(item.drink == 'wine')return 'Red Wine';

            return '';


          }

          makeRemove() {
            const item = this.state.preview;
            if(item.slug == 'tattoo')return 'Tattoos';
            if(item.slug == 'drink')return 'Drink';
            if(item.slug == 'eyes')return 'Eye Makeup';
            if(item.slug == 'face')return 'Beauty Filter';
            if(item.slug == 'cat')return 'new cat.';
            if(item.slug == 'smoke')return 'Smoke';
            return '';
          }

          makeTitle() {
            const item = this.state.preview;
            if(item.slug == 'tattoo')return 'new face tattoos.';
            if(item.slug == 'drink')return this.makeDrink(item);
            if(item.slug == 'eyes')return 'new look.';
            if(item.slug == 'face')return 'new face.';
            if(item.slug == 'cat')return 'new cat.';
            if(item.slug == 'smoke')return 'smokes.';
            return '';
          }

          _onSocial(site) {

            if(site === 'facebook') window.open('https://facebook.com/edsvbar', '_blank');
            if(site === 'twitter') window.open('https://twitter.com/edsvbar', '_blank');
            if(site === 'instagram') window.open('https://instagram.com/edsvbar', '_blank');

          }

          makeDescripton() {

            const item = this.state.preview;

            if(!item.name)item.name = '';

            if(item.slug == 'tattoo')return 'FACE TATTOOS';
            if(item.slug == 'drink')return '     ';//this.makeDrink(item);
            if(item.slug == 'eyes')return 'EYE MAKEUP';
            if(item.slug == 'face')return 'BEAUTY';
            if(item.slug == 'cat')return 'Invite this cat into bar to drink with you.';
            if(item.slug == 'smoke')return 'SMOKE';
            /*
            if(item.slug == 'tattoo')return 'FACE TATTOOS\n(Enter text)';
            if(item.slug == 'drink')return this.makeDrink(item);
            if(item.slug == 'eyes')return 'EYE MAKEUP\n' + item.name + '';
            if(item.slug == 'face')return 'BEAUTY\n(adjust sliders)';
            if(item.slug == 'cat')return 'Invite this cat into bar to drink with you.';
            if(item.slug == 'smoke')return 'SMOKE\n'+ item.name + '';
            */

            
            return 'leave a tip.';


          }

          needsRemoved() {
            return this.props.activeItems.filter(item => (item.slug == this.state.preview.slug).length >0);
          }

          render() {


            const drinks = ['beer','wine', 'whiteclaw','icedcoffee'];


            const funthings = [
            {slug:'smoke',title:'smokes'}
            ,{slug:'tattoo',title:'tattoos'}
            ,{slug:'eyes',title:'eyes'}
            ,{slug:'face', title:'face'}
            //,{slug:'cats', title:'cats'}
            //,{slug:'drink', title:'drinks'}
            ];


            const lightBorder = '#000';

            const testborder = 0;

            const buttonStyle = {
              backgroundColor:'#333',
              borderRadius:30,
              height:60,
              width:60,
              padding:0,
              border:'solid #222 1px',
              borderColor:lightBorder,
              backgroundSize:'contain',
              backgroundPosition:'center',
              backgroundRepeat:'no-repeat'
            };


            const drinkButtons = drinks.map((drink, idx, arr) =>
            <Column key={'jklx' + idx}>
            <button key={'drink'+idx} style={{...buttonStyle, backgroundPosition:'50% 0%', backgroundImage:'url(/img/'+ drink + '.png)', borderWidth:(this._isDrinkActive(drink)? 2.0 : 1.0)}} onClick={this._onDrink.bind(this, drink)} />
            </Column>
            );

            const socialStyle = {
              height:20,
              width:20,
              backgroundPosition:'center',
              backgroundSize:'contain',
              backgroundRepeat:'no-repeat',
              border:'0px',
              backgroundColor:'transparent',
              borderRadius:0,
            };




            const socials = ['instagram', 'twitter', 'facebook'];

            const socialButtons = socials.map((soc, idx, arr) =>
            <Column key={'jklx' + idx}>
            <button key={'drink'+idx} style={{...socialStyle, marginRight:0, marginLeft:10, backgroundImage:'url(/img/'+ soc + '.png)'}} onClick={this._onSocial.bind(this, soc)} />
            </Column>
            );




            const funButtons = funthings.map((thing, idx, arr) =>
            <Column key={'asdf' + idx}>
            <button key={'thing.slug' + idx} style = {{...buttonStyle, padding:'0px', backgroundImage:'url(/img/'+ thing.slug+'.png)', backgroundSize:'cover', backgroundPosition:'center'}} onClick={this._onStore.bind(this, thing.slug)} />
            </Column>
            );


            const myPurchasesButtons = Array.isArray(this.props.purchasedItems) && this.props.purchasedItems.map((thing, idx, arr) =>
            <Column key={'masdf' + idx}>
            <button key={'thing.slug' + idx} style={{backgroundColor:'white', borderWidth:testborder, borderRadius:0, width:'10%'}} onClick={this._onStore.bind(this, thing.slug)}>
            <img src={'/img/'+ thing.slug + '.png' } style={{width:'auto', height:50, backgroundColor:'transparent', border:'solid blue 1px', borderWidth:testborder}} />
            <div style={{fontSize:10, color:'black'}}>{thing.title}</div>
            </button>
            </Column>
            );

            const buyButton = this.state.preview.slug != 'none' && this.state.preview.slug != 'drinkx' && <button id="buy_button" onClick={this._onBuy.bind(this)} style={{width:'90', marginLeft:'6', marginTop:0, height:40,  border:'solid gray 0px',borderRadius:6, backgroundColor:'green',color:'white',textAlign:'center', fontSize:18}}><b>FREE</b><div style = {{fontSize:12}}>Purchase</div></button>;
            const removeButton =  this.state.preview.slug != 'none' &&  <button onClick={this._onRemove.bind(this)} style={{width:'200',  marginTop:5, height:20, border:'solid gray 0px',borderRadius:6, backgroundColor:'#000',color:'#aaa',textAlign:'right',  fontSize:10}}>(Remove {this.makeRemove()})</button>;
            const previewCanvas =  <canvas id="previewcanvas" width="220" height="176" ref={this.myRef} style={{width:'220px', height:'176px',borderRadius:30, border:'solid #222 1px'}} />;

            return (<Column>
              <Row style = {{xbackgroundColor:'green', borderRadius:5}} justifyContent = "center" key="r1324234">
              <h2 style={{fontFamily:'tattoo2', color:'white', fontSize:40, marginBottom:20}}>Menu</h2>
              </Row>



              <Row key="r02" style = {{xbackgroundColor:'blue', borderRadius:5}}>

              <Column flex = "1 1 auto" justifyContent='start' key="c12u2u2i">

              <Row  flex = "0 0 16px"style = {{height:15, marginTop:0, marginBottom:0}} justifyContent = "center" key="r11">
              <h4 style = {this.headingStyle}>Drinks</h4>
              </Row>


              <Row key="r12" flex = "0 0 62px" wrap = {true}  className="drinkrow" justifyContent="space-between" alignItems="start">
              {drinkButtons}
              </Row>

              <Row  flex = "0 0 16px" style = {{height:15, marginTop:17}}  justifyContent = "center" key="r13234234">
              <h4 style = {this.headingStyle}>Fun</h4>
              </Row>

              <Row flex = "0 0 62px" style = {{xbackgroundColor:'red'}} key="r14" wrap = {true}  className="drinkrow" justifyContent="space-between" alignItems="start">
              {funButtons}
              </Row>



              </Column>

              <Column flex = "0 0 50px"><div></div></Column>


              <Column flex = "0 0 220" alignItems = 'end' justifyContent = 'start' key = "c1234">

              <Row flex = "0 0 0px">
              <div></div>
              </Row>
              <Row>
              {previewCanvas}
              </Row>


              </Column>

              </Row>

              <Row  justifyContent = "end" alignItems = "start" style = {{border:'solid #222 1px', borderColor:lightBorder, xbackgroundColor:'blue', borderRadius:15, paddingTop:0, paddngBottom:10,marginTop:0, marginBottom:10}}>




              <Column flex = "1">

              <Row justifyContent = "end">
              {this.needsRemoved() && removeButton}
              {this.state.preview.slug == 'none' && <div style = {{height:20}}></div>}
              </Row>
              <Row style = {{...this.headingStyle, justifyContent:'center', lineHeight:'13px', marginTop:'0px', marginBottom:'2px', textAlign:'center', whiteSpace:'pre-wrap'}}>
              {this.makeDescripton()}
              </Row>



              <Row justifyContent = "start" alignItems = "start" style = {{xbackgroundColor:'#111'}}>
              { this.state.preview.slug == 'smoke' && this._renderSmokeSettings() }
              { this.state.preview.slug == 'face' && this._renderFaceSettings() }
              { this.state.preview.slug == 'eyes' && this._renderEyesSettings() }
              { this.state.preview.slug == 'lips' && this._renderLipsSettings() }
              { this.state.preview.slug == 'tattoo' && this._renderTattooSettings() }
              { this.state.preview.slug == 'cats' && this._renderCatSettings() }
              { this.state.preview.slug == 'drink' && this._renderDrinkSettings() }
              { this.state.preview.slug == 'none' && this._renderTips() }

              {(this.state.preview.slug != 'none') && <Column flex = "0 0 90px" alignItems = "start">
              {buyButton}

              </Column>}


              </Row>

              <Row justifyContent = "end" style = {{marginTop:10}}>
              {this.state.preview.slug != 'xnone' && socialButtons}
              </Row>



              </Column>


              </Row>


              </Column>
              );
            }

          }

          function _mapStateToProps(state) {

            return {
              random: Math.random(),
              activeItems: state['features/blur'].activeItems,
              purchasedItems: state['features/blur'].purchasedItems
            };

          }

          export default connect(_mapStateToProps)(BeerMenu);
