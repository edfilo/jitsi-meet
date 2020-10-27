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


        _addNewItemToExistingItems(newitem) {

        var newitems = [];
        if(newitem.slug == 'tattoo'){
          newitems = [...this.props.activeItems].filter(obj => (newitem.slug !== obj.slug));
        } else {
          newitems = [...this.props.activeItems].filter(obj => (newitem.slug !== obj.slug));
        }
        newitems.push(newitem);
        return newitems;

        }

        _tryOn(item) {

        this.setState({preview:item});
        const stuff = this._addNewItemToExistingItems(item);


        if(this.filter){
          this.filter.applyFX(stuff);
        }

        if(item.slug === 'drink'){
          this.props.dispatch(activateItems(stuff));
        }

        }

        _onBuy() {

          this.props.dispatch(addPurchasedItems([this.state.preview]));
          this.props.dispatch(activateItems(this._addNewItemToExistingItems(this.state.preview)));

        }

        tatPos =  {
          forehead:[190, 160, 255, 120, 320, 160],
          lefteye:[170, 190, 195, 185, 220, 190],
          righteye:[292, 190, 317, 185, 342, 190]
        }

        _onStore(slug) {

        var item = {slug:slug};

        if(slug == 'smoke') {
          item = {slug:'smoke', r:1.0, g:1.0, b:1.0};
        }

        if(slug == 'face') {
          item = {slug:'face', chin_raise:0};
        }

        if(slug == 'tattoo') {
          item = {slug:'tattoo', fontFamily:'tattoo1', fontSize:36, text:'eds bar', path:this.tatPos.forehead, location:'forehead'};
        }

        this.setState({preview:item});
          this._tryOn(item);
        }

        _onDrink(drink) {
          const item = {slug:'drink', drink:drink};
          this._tryOn(item);
        }


        _onFaceSliderSlid(slider,val){

          const item = {...this.state.preview};
          item[slider.slug] = val;
          this._tryOn(item);

        }

        _onSmokeColor(color) {

          const item = {slug:'smoke', r:color.r/255.0, g:color.g/255.0, b:color.b/255.0};
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


              this.filter = new Filter(200, 200, this.myRef.current, this.props.activeItems);
          //  paypal.Buttons().render('#paypal_container');
            }, 1);
        }

        _isDrinkActive(drink) {
          return !!this.props.activeItems.find(item => item.drink === drink);
          //this.props.activeItems.every(function(item) {
            //   if(item.drink == drink)return true;
        //  });
        //  return false;
        }


        _renderSmokeSettings() {

          const smokecolors = [{r:0,g:0,b:0},{r:255,g:255,b:255}, {r:50,g:250,b:50}, {r:250,g:250,b:0}, {r:255,g:0,b:255},{r: 1,g:200,b:255}];
          const colorButtons = smokecolors.map((color, idx, arr) =>
          <Column  key={'wwww'+idx}><button key={'color'+idx} className={'smokebutton'} style={{height:40, width:40, borderRadius:20,  borderWidth:1,  backgroundColor:'rgb('+ color.r + ', '+ color.g +', ' + color.b + ')'}}
                onClick={this._onSmokeColor.bind(this,color)}>
              </button></Column>);

          return(<Column alignItems = 'center'>
          <Row><h4>Smoke</h4></Row>
          <Row ><div style = {{fontSize:12}}>Open mouth to blow smoke.</div></Row>
          <Row wrap = {true} >{colorButtons}</Row>
          </Column>);

          }

          _handlePathChange(event) {

            //const patharray =  Object.assign([], this.state.preview.path, {event.target.id:event.target.value});
            var patharray = this.state.preview.path;
            patharray[event.target.id] = event.target.value;


            this.setState({preview:{...this.state.preview, path:patharray}});

            this._renderTattooImage();

          }


          _handleTextChange(event) {
            this.setState({preview:{...this.state.preview, text:event.target.value}});
          //  this._renderTattooImage();
          }

        _onTatPo(location) {
          const item = {...this.state.preview, location:location, path:this.tatPos[location]};
          this.setState({preview:item});
        }

        _renderTattooSettings() {

          const pathFields = this.state.preview.path.map((val, idx, arr) =>
          <Column  key={'iioowwww'+idx}>
            <input id = {idx}  style = {{height:40, width:30, borderRadius:5, border:'solid gray 1px'}} value={this.state.preview.path[idx]} type="text" onChange={this._handlePathChange.bind(this)} />
          </Column>);

         const poButtons = Object.keys(this.tatPos).map((po, idx, arr) =>
         <Column key={'ttt'+idx}>
          <button key={'color'+idx} style={{fontSize:10, height:50, width:40, borderRadius:0,  borderWidth:po == this.state.preview.location ? 2 : 1}}
               onClick={this._onTatPo.bind(this,po)}>
               {po}
          </button>
        </Column>);

          return <Column alignItems = 'start'>
            <Row><h4>Tattoo</h4></Row>
            <Row><div style= {{fontSize:10}}>enter tattoo Text</div></Row>
            <Row><input style = {{height:40, width:150, borderRadius:5, border:'solid gray 1px'}} value={this.state.preview.text} type="text" onChange={this._handleTextChange.bind(this)} /></Row>
            <Row>{pathFields}</Row>
            <Row>{poButtons}</Row>

          </Column>;

        };



        _renderLipsSettings() {
          return <div>lips</div>
        }

        _renderEyesSettings() {
          return <div>eyes</div>
        }






        _renderFaceSettings() {



          const sliders = [
            {title:'chin', slug:'chin_raise', min:-100, max:100, val:0}
           ,{title:'eyes', slug:'big_eyes', min:-100, max:100, val:0}
           ,{title:'face', slug:'face_narrow', min:-100, max:100, val:0}
           ,{title:'nose', slug:'nose_small', min:-100, max:100, val:0}
           ,{title:'color', slug:'hue', min:0, max:1, val:.5}
           ,{title:'saturation', slug:'sat', min:0, max:1, val:.5}
          ];

          const slideruis = sliders.map((slider, idx, arr) =>

            <Row key={'slider' + idx} style={{height:30, width:200}}>
              <h3>{slider.title}</h3>
              <Slider step = {slider.max > 1 ? 1 : .01} min = {slider.min} max = {slider.max} defaultValue={slider.val} onAfterChange={this._onFaceSliderSlid.bind(this, slider)} />
            </Row>
          );

          return (<Column>
            {slideruis}
            </Column>);
        }





        render() {


        const drinks = ['none','beer','wine', 'whiteclaw','icedcoffee'];


        const things = [
        {slug:'smoke',title:'smokes'}
        ,{slug:'tattoo',title:'tattoos'}
        ,{slug:'eyes',title:'eyes'}
        ,{slug:'face', title:'beauty'}
        //,{slug:'drink', title:'drinks'}
        ];

        //const myThings = self.props.purchasedItems;


        const testborder = 0;

        const drinkButtons = drinks.map((drink, idx, arr) =>
        <Column key={'jkl' + idx}>
            <button key={'drink'+idx} style={{backgroundColor:'white', borderWidth:testborder, borderRadius:0, height:60}} onClick={this._onDrink.bind(this, drink)}>
                <img src={'/img/'+ drink + '.png' } style={{border:'solid blue 1px', width:'auto', height:'100%', backgroundColor:'transparent', borderWidth:(this._isDrinkActive(drink)? 1.0 : 0.0)}} />
            </button>
        </Column>
        );

        /*
          <div style={{fontSize:10, color:'black'}}>{thing.title}</div>
          */


        const funButtons = things.map((thing, idx, arr) =>
        <Column key={'asdf' + idx}>
            <button key={'thing.slug' + idx} style={{backgroundColor:'white', borderWidth:testborder, borderRadius:0, height:60}} onClick={this._onStore.bind(this, thing.slug)}>
                <img src={'/img/'+ thing.slug + '.png' } style={{width:'auto', height:50, backgroundColor:'transparent', border:'solid blue 1px', borderWidth:testborder}} />
            </button>
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


        const headingStyle = {fontSize:15};
        const buyButton = this.state.preview.slug != 'none' && this.state.preview.slug != 'drink' && <button id="buy_button" onClick={this._onBuy.bind(this)} style={{marginTop:13, border:'solid gray 0px',borderRadius:5, backgroundColor:'green',color:'white',textAlign:'center', width:'200px', fontSize:13}}><b>Purchase</b><div>FREE</div></button>;
        const previewCanvas =  <canvas ref={this.myRef} style={{backgroundColor:'white', borderRadius:30, border:'solid #222 1px'}} />;

       // this.state.preview.slug != 'none' && this.state.preview.slug != 'drink' &&


//okKey='dialog.done'
        return (

        <Dialog hideCancelButton={ true } submitDisabled = {true} width='medium'>



        <Row style = {{marginTop:15}} flexGrow={1} justifyContent = "center" key="r13234234">
          <h2 style={{fontFamily:'tattoo1'}}>Menu</h2>
        </Row>

            <Row flexGrow={1} className ="everything" key="r02">

                <Column flex = "0 1 50%" justifyContent='start' key="c12u2u2i">

                    <Row style = {{height:25, marginTop:5}} flexGrow={1} justifyContent = "center" key="r11">
                      <h4>Drinks</h4>
                    </Row>

                    <Row key="r12"  wrap = {true}  className="drinkrow" justifyContent="center" alignItems="start">
                        {drinkButtons}
                    </Row>

                    <Row style = {{height:25, marginTop:15}}  flexGrow={1} justifyContent = "center" key="r13234234">
                      <h4>Fun Items</h4>
                    </Row>

                    <Row key="r14"  wrap = {true}  className="drinkrow" justifyContent="center" alignItems="start">
                        {funButtons}
                    </Row>

                    <Row justifyContent = 'center' alignItems = "start">
                        { this.state.preview.slug == 'smoke' && this._renderSmokeSettings() }
                        { this.state.preview.slug == 'face' && this._renderFaceSettings() }
                        { this.state.preview.slug == 'eyes' && this._renderEyesSettings() }
                        { this.state.preview.slug == 'lips' && this._renderLipsSettings() }
                        { this.state.preview.slug == 'tattoo' && this._renderTattooSettings() }
                    </Row>


                    {/*
                    <Row key="r14" wrap = {true} horizontal="flex-start" className="productrow" justifyContent="start" alignItems="start">
                      {myPurchasesButtons}
                    </Row>
                  */}

                </Column>


                <Column flex = "0 1 250" alignItems = 'end' justifyContent = 'start' key = "c1234">
                <Row alignItems = "start">
                  <Column flex= "1 0 auto">
                  <div></div>
                  </Column>

                  <Column flex ="0 0 220px">
                    {previewCanvas}
                  </Column>
                </Row>
                </Column>

            </Row>

            <Row  style = {{padding:15, marginTop:20, borderRadius:15, fontSize:12}} className="trybuyrow"  key = "r2">






                <Column flex="1 0 auto" className="settings" key="c1uuuu">




                <Row justifyContent = 'center'>
                  {buyButton}
                </Row>

                </Column>

                <Column flex = "0 0 220px">

                  <Row>
                    <img style = {{objectFit:'cover', width:'100%', height:'100%'}} src = {this.state.preview.imageUrl} />
                  </Row>

                </Column>


                {/*<Column flexGrow={1}>


              </Column>*/}

            </Row>

            <Row className="paypalrow" key = "r3">
              <div id="paypal_container" style={{display:'block'}}></div>

            </Row>


        </Dialog>
        );
        }

        }

        function _mapStateToProps(state) {

          console.log('browns ' + state['features/blur'].activeItems.length + 'items');

        return {
        activeItems: state['features/blur'].activeItems,
        purchasedItems: state['features/blur'].purchasedItems
        };

        }


        export default connect(_mapStateToProps)(BeerMenu);
