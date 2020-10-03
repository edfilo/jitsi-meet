// @flow

import { AtlasKitThemeProvider } from '@atlaskit/theme';
import React from 'react';

import { BaseApp } from '../../../features/base/app';
import { setConfig } from '../../base/config';
import { createPrejoinTracks } from '../../base/tracks';
import { initPrejoin } from '../actions';

import Prejoin from './Prejoin';

type Props = {

    /**
     * Indicates whether the avatar should be shown when video is off
     */
    showAvatar: boolean,

    /**
     * Flag signaling the visibility of join label, input and buttons
     */
    showJoinActions: boolean,

    /**
     * Flag signaling the visibility of the skip prejoin toggle
     */
    showSkipPrejoin: boolean,
};

/**
 * Wrapper application for prejoin.
 *
 * @extends BaseApp
 */
export default class PrejoinApp extends BaseApp<Props> {
    _init: Promise<*>;

    /**
     * Navigates to {@link Prejoin} upon mount.
     *
     * @returns {void}
     */
    componentDidMount() {
        super.componentDidMount();

        this._init.then(async () => {
            const { store } = this.state;
            const { dispatch } = store;
            const { showAvatar, showJoinActions, showSkipPrejoin } = this.props;

            super._navigate({
                component: Prejoin,
                props: {
                    showAvatar,
                    showJoinActions,
                    showSkipPrejoin
                }
            });

            const { startWithAudioMuted, startWithVideoMuted } = store.getState()['features/base/settings'];

            dispatch(setConfig({
                prejoinPageEnabled: false,
                startWithAudioMuted,
                startWithVideoMuted
            }));

            const { tryCreateLocalTracks, errors } = createPrejoinTracks();

            const tracks = await tryCreateLocalTracks;

            dispatch(initPrejoin(tracks, errors));
        });
    }

    /**
     * Overrides the parent method to inject {@link AtlasKitThemeProvider} as
     * the top most component.
     *
     * @override
     */
    _createMainElement(component, props) {
        return (
            <AtlasKitThemeProvider mode = 'light'>
                { super._createMainElement(component, props) }
            </AtlasKitThemeProvider>
        );
    }

    /**
     * Renders the platform specific dialog container.
     *
     * @returns {React$Element}
     */
    _renderDialogContainer() {
        return null;
    }
}
