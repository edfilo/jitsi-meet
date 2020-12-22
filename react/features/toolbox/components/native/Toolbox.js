// @flow

import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { type Dispatch } from 'redux';

import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { Container } from '../../../base/react';
import { connect } from '../../../base/redux';
import { StyleType } from '../../../base/styles';
import { ChatButton } from '../../../chat';
import { isToolboxVisible } from '../../functions';

import AudioMuteButton from '../AudioMuteButton';
import HangupButton from '../HangupButton';
import VideoMuteButton from '../VideoMuteButton';
import { VideoShareButton } from '../../../youtube-player/components';
import { openDialog, toggleDialog } from '../../../base/dialog';
import RoundButton from './RoundButton';
import TipDialog from './TipDialog';
import LonelyMeetingExperience from '../../../conference/components/native/LonelyMeetingExperience';
import { appNavigate } from '../../../app/actions';

import Menu from './Menu';

import OverflowMenuButton from './OverflowMenuButton';

import { toggleBlurEffect } from '../../../blur/actions';

import styles from './styles';



/**

/**
 * The type of {@link Toolbox}'s React {@code Component} props.
 */
type Props = {

    /**
     * The color-schemed stylesheet of the feature.
     */
    _styles: StyleType,

    /**
     * The indicator which determines whether the toolbox is visible.
     */
    _visible: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Dispatch<any>
};

/**
 * Implements the conference toolbox on React Native.
 */
class Toolbox extends PureComponent<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Container
                style = { styles.toolbox }
                visible = { this.props._visible }>
                { this._renderToolbar() }
            </Container>
        );
    }

    /**
     * Constructs the toggled style of the chat button. This cannot be done by
     * simple style inheritance due to the size calculation done in this
     * component.
     *
     * @param {Object} baseStyle - The base style that was originally
     * calculated.
     * @returns {Object | Array}
     */
    _getChatButtonToggledStyle(baseStyle) {
        const { _styles } = this.props;

        if (Array.isArray(baseStyle.style)) {
            return {
                ...baseStyle,
                style: [
                    ...baseStyle.style,
                    _styles.chatButtonOverride.toggled
                ]
            };
        }

        return {
            ...baseStyle,
            style: [
                baseStyle.style,
                _styles.chatButtonOverride.toggled
            ]
        };
    }

    /**
     * Renders the toolbar. In order to avoid a weird visual effect in which the
     * toolbar is (visually) rendered and then visibly changes its size, it is
     * rendered only after we've figured out the width available to the toolbar.
     *
     * @returns {React$Node}
     */

     _menu() {

           this.props.dispatch(openDialog(Menu));

     }

     _tip() {

           this.props.dispatch(openDialog(TipDialog));

     }

     _exit() {

         this.props.dispatch(appNavigate(undefined));

     }

    _renderToolbar() {

        //const { _styles } = this.props;
      //  const { buttonStyles, buttonStylesBorderless, hangupButtonStyles, toggledButtonStyles } = _styles;

        return (<View
                accessibilityRole = 'toolbar'
                pointerEvents = 'box-none'
                style = {{height:66, flexDirection:'row', justifyContent:
                'flex-start'}} >

                    <RoundButton
                     backgroundColor = "green"
                     width={200}
                     height={66}
                     fontSize={20}
                     fontWeight = 'bold'
                     textColor="#fff"
                     textHeight={66}
                     textAlignHorizontal="center"
                     onPress={this._menu.bind(this)}
                     style = {{backgroundColor:'purple'}}
                     text="MENU"/>

          </View>);
        }

}

/**
 * Maps parts of the redux state to {@link Toolbox} (React {@code Component})
 * props.
 *
 * @param {Object} state - The redux state of which parts are to be mapped to
 * {@code Toolbox} props.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state: Object): Object {
    return {
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
        _visible: true// isToolboxVisible(state)
    };
}

export default connect(_mapStateToProps)(Toolbox);
