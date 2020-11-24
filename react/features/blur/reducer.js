// @flow

import { ReducerRegistry, PersistenceRegistry } from '../base/redux';

import { FX_ENABLED, FX_DISABLED, ADD_PURCHASED_ITEMS, SET_ACTIVE_ITEMS, ACTIVATE_ITEM, PURCHASE_ITEM} from './actionTypes';

PersistenceRegistry.register('features/blur');


const DEFAULT_STATE = {
    blurEnabled:  true,
    activeItems: [],
    purchasedItems: []
};

ReducerRegistry.register('features/blur', (state = DEFAULT_STATE, action) => {



    switch (action.type) {



      case ADD_PURCHASED_ITEMS: {




        return {
          ...state,
          purchasedItems: [...state.purchasedItems, ...action.items],
          blurEnabled: true
        }

      }

    case SET_ACTIVE_ITEMS: {


      return {
        ...state,
        activeItems:action.items,
        blurEnabled: true
      }

    }

    case FX_ENABLED: {
      Object.assign(state.fx, action.fx);
        return {
             ...state,
            blurEnabled: true
        };
    }

    case FX_DISABLED: {
        console.log('persistance disabled');
        return {
            ...state,
            blurEnabled: true
        };
    }

    }




    return state;
});
