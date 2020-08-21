// @flow

import { ColorSchemeRegistry, schemeColor } from '../../../base/color-scheme';
import { ColorPalette } from '../../../base/styles';
import { FILMSTRIP_SIZE } from '../../constants';
import { Dimensions, TouchableHighlight, Text } from 'react-native';
/**
 * Size for the Avatar.
 */
export const AVATAR_SIZE = 50;

/**
 * The styles of the feature filmstrip.
 */
export default {

    /**
     * The display name container.
     */
    displayNameContainer: {
        alignSelf: 'center',
        bottom: 0,
        flex: 1,
        margin: 4,
        position: 'absolute'
    },

    /**
     * The style of the narrow {@link Filmstrip} version which displays
     * thumbnails in a row at the bottom of the screen.
     */
    filmstripNarrow: {
        flexDirection: 'row',
        flexGrow: 0,
        justifyContent: 'flex-end',
        flex:1
      //  height: 200
    },

    /**
     * The style of the wide {@link Filmstrip} version which displays thumbnails
     * in a column on the short size of the screen.
     *
     * NOTE: width is calculated based on the children, but it should also align
     * to {@code FILMSTRIP_SIZE}.
     */
    filmstripWide: {
        bottom: 0,
        flexDirection: 'column',
        flexGrow: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },

    /**
     * Container of the {@link LocalThumbnail}.
     */
    localThumbnail: {
        alignContent: 'stretch',
        alignSelf: 'stretch',
        aspectRatio: 1,
        flexShrink: 0
      /*  flexDirection: 'row'*/
    },

    moderatorIndicatorContainer: {
        bottom: 4,
        position: 'absolute',
        right: 4
    },

    /**
     * The style of the scrollview containing the remote thumbnails.
     */
    scrollView: {
        flexGrow: 0
    },

    /**
     * The style of a participant's Thumbnail which renders either the video or
     * the avatar of the associated participant.
     */
    thumbnail: {
      /*  alignItems: 'stretch',*/
        backgroundColor: 'blue',
        borderColor: '#424242',
        borderRadius: 20,//Dimensions.get('window').width * 0.2 * .30,
        borderStyle: 'solid',
        borderWidth: 1,
      /*  flex: 1,*/
      /*  height: Dimensions.get('window').width * 0.25,*/
        justifyContent: 'center',
        margin: 2,
        overflow: 'hidden',
        position: 'absolute',
      /*  width: Dimensions.get('window').width * 0.25,*/
    },

    /**
     * The thumbnails indicator container.
     */
    thumbnailIndicatorContainer: {
        alignSelf: 'stretch',
        bottom: 4,
        flex: 1,
        flexDirection: 'row',
        left: 4,
        position: 'absolute'
    },

    thumbnailTopIndicatorContainer: {
        padding: 4,
        position: 'absolute',
        top: 0
    },

    thumbnailTopLeftIndicatorContainer: {
        left: 0
    },

    thumbnailTopRightIndicatorContainer: {
        right: 0
    },

    tileView: {
        alignSelf: 'center',
        backgroundColor: 'purple',
        flex:1
    },

    tileViewRows: {
        justifyContent: 'center'
    },

    tileViewRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'red',
        height:200
    }
};

/**
 * Color schemed styles for the @{code Thumbnail} component.
 */
ColorSchemeRegistry.register('Thumbnail', {

    /**
     * Tinting style of the on-stage participant thumbnail.
     */
    activeThumbnailTint: {
        backgroundColor: schemeColor('activeParticipantTint')
    },

    /**
     * Coloring if the thumbnail background.
     */
    participantViewStyle: {
        backgroundColor: schemeColor('background')
    },

    /**
     * Pinned video thumbnail style.
     */
    thumbnailPinned: {
        borderColor: schemeColor('activeParticipantHighlight'),
        shadowColor: schemeColor('activeParticipantHighlight'),
        shadowOffset: {
            height: 5,
            width: 5
        },
        shadowRadius: 5
    }
});
