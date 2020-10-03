// @flow


import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import { Dialog } from '../../../base/dialog';
import { Column, Row } from 'simple-flexbox';

import { toggleBlurEffect } from '../../../blur/actions';
import type { Dispatch } from 'redux';
import { connect } from '../../../base/redux';


/**
 * Implements a React {@link Component} which displays the component
 * {@code VideoQualitySlider} in a dialog.
 *
 * @extends Component
 */


 type Props = {


     /**
      * Redux store dispatch method.
      */
     dispatch: Dispatch<any>


 };

class BeerMenu extends Component<Props>  {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */


     constructor(props: Props) {
         super(props);

         // Bind event handler so it is only bound once for every instance.
         //this._onClick = this._onClick.bind(this);
     }


     _onSmoke() {
           this.props.dispatch(toggleBlurEffect(true));
     }

    render() {

        return (
          <Dialog
              hideCancelButton = { true }
              okKey = 'dialog.done'
              width = 'small'>
          <Column>
            <Row justifyContent="start" alignItems="start">
            <h1>Smoke</h1>
            <button
                className = { 'smokebutton' }
                onClick = { this._onSmoke.bind(this) }>
white
            </button>
            <div>white</div>
            <div>red</div>
            <div>blue</div>
            <div>green</div>
            <div>pink</div>
            <div>purple</div>
            </Row>
            <Row justifyContent="start" alignItems="start">
            <h1>Lipstick</h1>
            <div>white</div>
            <div>red</div>
            <div>blue</div>
            <div>green</div>
            <div>pink</div>
            <div>purple</div>
            </Row>
          </Column>
          </Dialog>
        );
    }
}


export default connect()(BeerMenu);
