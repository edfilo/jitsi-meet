// @flow

import { getLocalVideoTrack } from '../../features/base/tracks';

import JitsiStreamBlurEffect from '../../features/stream-effects/blur/JitsiStreamBlurEffect';

import { FX_DISABLED, FX_ENABLED, SET_ACTIVE_ITEMS, ADD_PURCHASED_ITEMS, ACTIVATE_ITEM, PURCHASE_ITEM} from './actionTypes';
import { getBlurEffect } from './functions';
import logger from './logger';

/**
* Signals the local participant is switching between blurred or non blurred video.
*
* @param {boolean} enabled - If true enables video blur, false otherwise.
* @returns {Promise}
*/

export function activateItems(items: array) {

  return function(dispatch: (Object) => Object, getState: () => any) {

    const state = getState();

    const { jitsiTrack } = getLocalVideoTrack(state['features/base/tracks']);
    jitsiTrack._streamEffect.applyFX(items);

    dispatch(setActiveItems(items));

  };



}

/*
export function activateItem(newitem: object) {


    return function(dispatch: (Object) => Object, getState: () => any) {

          const state = getState();
          const activeItems = state['features/blur'].activeItems;

          const { jitsiTrack } = getLocalVideoTrack(state['features/base/tracks']);

          return getBlurEffect(activeItems)
            .then(() => {

                          var newitems = [];
                          if(newitem.slug == 'tattoo'){
                              newitems = [...activeItems].filter(obj => (newitem.slug !== obj.slug && newitem.location !== obj.location));
                          } else {
                              newitems = [...activeItems].filter(obj => (newitem.slug !== obj.slug));
                          }
                          newitems.push(newitem);

                          debugger;

                          jitsiTrack._streamEffect.applyFX(newitems);

                          dispatch(setActiveItems(newitems));

                });


          return Promise.resolve();

      }

}
*/
export function addPurchasedItems(items) {

  return {
      type: ADD_PURCHASED_ITEMS,
      items: items
  };

}



export function setActiveItems(items) {

  return {
      type: SET_ACTIVE_ITEMS,
      items: items
  };

}


export function toggleBlurEffect(enabled: boolean, fx: object) {

  return function(dispatch: (Object) => Object, getState: () => any) {
        const state = getState();

        if (state['features/blur'].blurEnabled !== enabled) {
            const { jitsiTrack } = getLocalVideoTrack(state['features/base/tracks']);

            return getBlurEffect(fx)
                .then(blurEffectInstance =>
                    jitsiTrack.setEffect(enabled ? blurEffectInstance : undefined)
                        .then(() => {
                            //enabled ?
                            dispatch(blurEnabled(color));
                            //debugger;
                            // : dispatch(blurDisabled());
                            //jitsiTrack._streamEffect.changeEffect(color);

                              logger.error('setEffect succeeded', error);
                        }).catch(error => {
                            enabled ? dispatch(blurDisabled()) : dispatch(blurEnabled(color));
                            logger.error('setEffect failed with error:', error);
                        })
                )
                .catch(error => {
                    dispatch(blurDisabled());
                    logger.error('getBlurEffect failed with error:', error);
                });
        } else {

          const { jitsiTrack } = getLocalVideoTrack(state['features/base/tracks']);
          dispatch(blurEnabled(color));
          jitsiTrack._streamEffect.changeEffect(color);

        }

        return Promise.resolve();
    };
}

/**
 * Signals the local participant that the blur has been enabled.
 *
 * @returns {{
 *      type: FX_ENABLED
 * }}
 */
export function blurEnabled(color) {
    return {
        type: FX_ENABLED,
        color:color

    };
}

/**
 * Signals the local participant that the blur has been disabled.
 *
 * @returns {{
 *      type: FX_DISABLED
 * }}
 */
export function blurDisabled() {
    return {
        type: FX_DISABLED
    };
}
