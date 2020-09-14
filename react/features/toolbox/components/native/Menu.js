import React, { PureComponent } from "react";
import {
  Linking,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Image
} from "react-native";

import RoundButton from './RoundButton';



import { openDialog, hideDialog } from '../../../base/dialog';
import { type Dispatch } from 'redux';
import { connect } from '../../../base/redux';

import AudioMuteButton from '../AudioMuteButton';
import HangupButton from '../HangupButton';
import VideoMuteButton from '../VideoMuteButton';
import { VideoShareButton } from '../../../youtube-player/components';

import LonelyMeetingExperience from '../../../conference/components/native/LonelyMeetingExperience';
import { appNavigate, reloadNow } from '../../../app/actions';

import { StyleType } from '../../../base/styles';

import { ColorSchemeRegistry } from '../../../base/color-scheme';

import { isLocalTrackMuted } from '../../../base/tracks';
import { muteLocal } from '../../../remote-video-menu/actions';
import { MEDIA_TYPE } from '../../../base/media';

import { getLocalVideoType, isLocalVideoTrackMuted } from '../../../base/tracks';

import { doInvitePeople } from '../../../invite/actions.native';

import { toggleSharedVideo } from '../../../youtube-player/actions';

import {
    VIDEO_MUTISM_AUTHORITY,
    setVideoMuted
} from '../../../base/media';

import { MODAL_STYLE } from '../../../base/media';

import TipDialog from './TipDialog';


import { hasAvailableDevices } from '../../../base/devices';

import { getLocalParticipant } from '../../../base/participants';

import { setSharedVideoStatus } from '../../../youtube-player/actions';



type Props = {


  _styles: StyleType,

  /**
   * The redux {@code dispatch} function.
   */

  _audioMuted : boolean,

  _audioDisabled : boolean,
  /**
  * The redux {@code dispatch} function.
  */

  _audioOnly: boolean,

  /**
   * MEDIA_TYPE of the local video.
   */
  _videoMediaType: string,

  /**
   * Whether video is currently muted or not.
   */
  _videoMuted: boolean,

  /**
   * Whether video button is disabled or not.
   */
  _videoDisabled: boolean,


  _youtubeVisible: boolean,

  _barhopVisible: boolean,


  dispatch: Dispatch<any>
};

class Menu extends PureComponent<Props>{

  constructor(props: Props) {
      super(props);


  }


  state = {
    modalVisible: true,
    tipVisible: false,
    modalState: MODAL_STYLE.YOUTUBE
  };


  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible});

    if(!visible){
    this.props.dispatch(hideDialog());
    }
  }

  _isAudioDisabled() {
      return this.props._audioDisabled;
  }

  openVenmo = () => {
    Linking.openURL('http://venmo.com/edfilo').catch(err => console.error("Couldn't load page", err));
  };

  openPaypal = () => {
    Linking.openURL('http://paypal.me/edfilo').catch(err => console.error("Couldn't load page", err));
  };

  getYoutubeLink(url) {
      const p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|(?:m\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;// eslint-disable-line max-len
      const result = url.match(p);

      return result ? result[1] : false;
  }

  launchVideo = (videoId) => {

  //  if (ownerId === localParticipant.id) {
      //  dispatch(setSharedVideoStatus(videoId, 'stop', 0, localParticipant.id));
  //  }


    const vid = this.getYoutubeLink(videoId);
    this.props.dispatch(setSharedVideoStatus(vid, 'start', 0, this.props._participantId));

   this.setModalVisible(false);


  }

  launchBar = (room) => {

    if (room) {

      //undefined

        this.props.dispatch(appNavigate(room.toLowerCase()));
        this.setModalVisible(false);

        //this.props.dispatch(reloadNow());

        //this.setState({ joining: true });


        // By the time the Promise of appNavigate settles, this component
        // may have already been unmounted.
        //this._mounted &&
        //const onAppNavigateSettled
      //      = () => this.setState({ joining: false });


        //this.props.dispatch(appNavigate(room))
          //  .then(onAppNavigateSettled, onAppNavigateSettled);
    }
  }



  _invite() {

      this.props.dispatch(doInvitePeople());
  }

  _tip() {


    //this.props.dispatch(openDialog(Tip));
    this.setState({tipVisible:true, modalState:MODAL_STYLE.TIP});
    //this.props.tipVisible = true;
  }


  _exit() {

    this.setState({tipVisible:true, modalState:MODAL_STYLE.BAR});

    //this.props.dispatch(appNavigate(undefined));

  }

  _isAudioMuted() {
      return this.props._audioMuted;
  }

  _setAudioMuted(audioMuted: boolean) {
      this.props.dispatch(muteLocal(audioMuted));
  }

  _toggleAudio() {
            this._setAudioMuted(!this._isAudioMuted());
  }

  _toggleVideo() {
            this._setVideoMuted(!this._isVideoMuted());
  }

  _isVideoDisabled() {
      return this.props._videoDisabled;
  }

  _isVideoMuted() {
      return this.props._videoMuted;
  }

  _setVideoMuted(videoMuted: boolean) {


      if (this.props._audioOnly) {
          this.props.dispatch(
              setAudioOnly(false, /* ensureTrack */ true));
      }
      const mediaType = this.props._videoMediaType;

      this.props.dispatch(
          setVideoMuted(
              videoMuted,
              mediaType,
              VIDEO_MUTISM_AUTHORITY.USER,
              /* ensureTrack */ true));


  }


  _youtube() {

    this.setState({tipVisible:true, modalState:MODAL_STYLE.YOUTUBE});
    //  this.props.dispatch(toggleSharedVideo());
  }





  render() {


    const { _styles } = this.props;
    const { buttonStyles, buttonStylesBorderless, hangupButtonStyles, toggledButtonStyles } = _styles;



    const { modalVisible } = this.state;


    console.log('starbucks menu visible:' + this.state.tipVisible + ' modal style:' + this.state.modalState);



    return (
      <>
      <Modal
      supportedOrientations={['landscape']}
      animationType="fade"
      transparent={true}
      closeOnClick={true}
      visible={modalVisible}>


      <TouchableOpacity
                  style={styles.container}
                  activeOpacity={1}
                  onPressOut={() => {this.setModalVisible(false)}}>


      <View style={styles.centeredView}  >
      <View style={styles.modalView}  >

      <RoundButton
      text="video"
      source={ this._isVideoMuted()? require('./video_off.png') : require('./video_on.png')}
      styles = { buttonStyles }
      toggledStyles = { toggledButtonStyles }
      onPressOut = {() => { this._toggleVideo() }}
      />

      <RoundButton
      text="audio"
      source={ this._isAudioMuted()? require('./mic_off.png') : require('./mic_on.png')}
      styles = { buttonStyles }
      toggledStyles = { toggledButtonStyles }
      onPressOut = {() => { this._toggleAudio() }}

      />

    <RoundButton
    text="invite friends"
    source={require('./friends.png')}
    onPressOut = {() => { this._invite() }}
    />

      <RoundButton
      onPress={this._exit.bind(this)}
      source={require('./exit.png')}
      text="barhop"/>

      <RoundButton
        text="youtube"
        styles = { buttonStyles }
        source={require('./mtv.png')}
        onPress={this._youtube.bind(this)}
      />

      </View>


{
      <View style={styles.tipRow}>
              <TouchableOpacity activeOpacity = { 1.0 } onPress = {this._tip.bind(this)} >
                <Image style={styles.dollar} source={require('./cleandollar.jpg')} />
              </TouchableOpacity >
      </View>
}


      </View>

      </TouchableOpacity>

      {this.state.tipVisible &&
          <TipDialog
            launchVideo = {(videoId) => this.launchVideo(videoId)}
            launchBar = {(room) => this.launchBar(room)}
            modalStyle = {this.state.modalState}
            closeDisplay={() => this.setState({tipVisible: false})}
            />}

      </Modal>
      </>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',


  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.77)'
   //backgroundColor: "#333"
  },
  modalView: {
    //margin: 20,
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height:200
  },
  tipRow: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'flex-start'
  },
  dollar: {
    height:70,
    resizeMode:'contain'
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize:14

  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize:18
  }
});



function _mapStateToProps(state: Object): Object {




//annoying registry defined in toolbox styles
  const annoying = ColorSchemeRegistry.get(state, 'Toolbox');
  const _audioMuted = isLocalTrackMuted(state['features/base/tracks'], MEDIA_TYPE.AUDIO);
  const _audioDisabled = state['features/base/config'].startSilent;


  const { enabled: audioOnly } = state['features/base/audio-only'];
  const tracks = state['features/base/tracks'];

  const { id, name } = getLocalParticipant(state);

  return {
    _audioOnly: Boolean(audioOnly),
    _videoDisabled: !hasAvailableDevices(state, 'videoInput'),
    _videoMediaType: getLocalVideoType(tracks),
    _videoMuted: isLocalVideoTrackMuted(tracks),
    _audioMuted,
    _audioDisabled,
    _participantId: id,
    //tipVisible: state.tipVisible,
    _styles: annoying
  };
}

export default connect(_mapStateToProps)(Menu);
