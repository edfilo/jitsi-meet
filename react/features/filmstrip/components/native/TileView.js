// @flow

import React, { Component } from 'react';

import {
    ScrollView,
    TouchableWithoutFeedback,
    View,
    Text
} from 'react-native';
import type { Dispatch } from 'redux';

import { connect } from '../../../base/redux';
import { ASPECT_RATIO_NARROW } from '../../../base/responsive-ui/constants';
import { setTileViewDimensions } from '../../actions.native';

import VideoTransform from '../../../base/media';

import Thumbnail from './Thumbnail';
import styles from './styles';

/*import VideoTransform from '../../../base/media/components/native/VideoTransform';*/
import PinchZoomView from 'react-native-pinch-zoom-view';



/**
 * The type of the React {@link Component} props of {@link TileView}.
 */
type Props = {


    /**
     * Application's aspect ratio.
     */
    _aspectRatio: Symbol,

    /**
     * Application's viewport height.
     */
    _height: number,

    /**
     * The participants in the conference.
     */
    _participants: Array<Object>,

    /**
     * Application's viewport height.
     */
    _width: number,

    /**
     * Invoked to update the receiver video quality.
     */
    dispatch: Dispatch<any>,

    /**
     * Callback to invoke when tile view is tapped.
     */
    onClick: Function
};

/**
 * The margin for each side of the tile view. Taken away from the available
 * height and width for the tile container to display in.
 *
 * @private
 * @type {number}
 */
const MARGIN = 0;

/**
 * The aspect ratio the tiles should display in.
 *
 * @private
 * @type {number}
 */
const TILE_ASPECT_RATIO = 1;

/**
 * Implements a React {@link Component} which displays thumbnails in a two
 * dimensional grid.
 *
 * @extends Component
 */
class TileView extends Component<Props, State> {


    /**
     * Initializes a new {@code TileView} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);
    }

    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._updateReceiverQuality();
    }

    /**
     * Implements React's {@link Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate() {
        this._updateReceiverQuality();
    }


    componentWillReceiveProps(nextProps) {


    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
      //  const { onClick } = this.props;

      let { updateParentState } = this.props.data;

        const thumbs = this._renderThumbnails();
        const tilestyle =  this.props.style;

        return (
          <View style= {tilestyle}>{thumbs}</View>
          );

    }

    /**
     * Returns how many columns should be displayed for tile view.
     *
     * @returns {number}
     * @private
     */
    _getColumnCount() {
        const participantCount = this.props._participants.length;




        // For narrow view, tiles should stack on top of each other for a lonely
        // call and a 1:1 call. Otherwise tiles should be grouped into rows of
        // two.
        if (this.props._aspectRatio === ASPECT_RATIO_NARROW) {
            return participantCount >= 3 ? 2 : 1;
        }

        if (participantCount === 4) {
            // In wide view, a four person call should display as a 2x2 grid.
            return 2;
        }

        return Math.min(3, participantCount);
    }

    /**
     * Returns all participants with the local participant at the end.
     *
     * @private
     * @returns {Participant[]}
     */
    _getSortedParticipants() {

        const participants = [];
        let localParticipant;

        for (const participant of this.props._participants) {
            if (participant.local) {
                localParticipant = participant;
            } else {
                participants.push(participant);
            }
        }

        localParticipant && participants.push(localParticipant);

        return participants;
    }

    /**
     * Calculate the height and width for the tiles.
     *
     * @private
     * @returns {Object}
     */
    _getTileDimensions(isYouTube, idx) {

        const headcount = this.props._participants.length;

        const { _height, _participants, _width } = this.props;
        const columns = this._getColumnCount();

        const heightToUse = this.props.style.height;
        const widthToUse = this.props.style.width;
        let tileWidth;


        this.padding = 20;

        const cols = (headcount <= 2) ? 1 : 2;
        const rows = Math.ceil(headcount / cols);

        const col = idx % cols;
        const row =  Math.floor(idx / cols);

        const shrink = (cols == 1) ? .75 : 1.0;


        const width = isYouTube ? 320 : (shrink * ((widthToUse / cols) - (cols - 1) * this.padding));
        const height = isYouTube ? 180 : (width * (4.0/5.0));

        const left = (widthToUse * ((1.0 - shrink) * .5)) + col * (widthToUse / cols) + Math.max((col - .5) * this.padding, 0.0);
        var top = row * height + Math.max((row - .5) * this.padding, 0.0);

        //if(rows == 1)top = -200;

        var topMargin = (heightToUse - rows * height + (this.padding * (rows - 1.0))) * .5;

        if(rows == 1)topMargin = 133;
/*
        console.log('layout engine'
        + ' headcount:' + headcount
        + ' top:' + top
        + ' left:' + left
        + ' topmargin:' + topMargin
        + ' width:' + width
        + ' height:' + height);
*/


        return {
            height:height,
            width:width,
            top:top + topMargin,
            left:left
        }
    }



    /**
     * Creates React Elements to display each participant in a thumbnail. Each
     * tile will be.
     *
     * @private
     * @returns {ReactElement[]}
     */

    _onPress() {



    }


    _isChat() {

        return true;
    }


    _renderThumbnails() {


        return this._getSortedParticipants()
            .map((participant, idx) => (
              <View key = { 'view' + participant.id }>
                <Thumbnail
                    disableTint = { true }
                    key = { participant.id }
                    participant = { participant }
                    renderDisplayName = { true }
                    styleOverrides = {{
                      position:'absolute'
                      ,width:this._getTileDimensions(participant.isFakeParticipant, idx).width
                      ,height:this._getTileDimensions(participant.isFakeParticipant, idx).height
                      ,left:this._getTileDimensions(participant.isFakeParticipant, idx).left
                      ,top:this._getTileDimensions(participant.isFakeParticipant, idx).top
                      }}
                    tileView = { true }>

                </Thumbnail>
              </View>
            ));

    }

    /**
     * Sets the receiver video quality based on the dimensions of the thumbnails
     * that are displayed.
     *
     * @private
     * @returns {void}
     */
    _updateReceiverQuality() {
        const { height, width } = this._getTileDimensions();

        this.props.dispatch(setTileViewDimensions({
            thumbnailSize: {
                height,
                width
            }
        }));
    }
}

/**
 * Maps (parts of) the redux state to the associated {@code TileView}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const responsiveUi = state['features/base/responsive-ui'];

    return {
        _aspectRatio: responsiveUi.aspectRatio,
        _height: responsiveUi.clientHeight,
        _participants: state['features/base/participants'],
        _width: responsiveUi.clientWidth
    };
}

export default connect(_mapStateToProps)(TileView);
