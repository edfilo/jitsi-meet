// @flow

import React from 'react';
import {ImageBackground, StyleSheet, TouchableOpacity, NativeModules, Image, View, Text, SafeAreaView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { appNavigate } from '../../../app/actions';
import { PIP_ENABLED, getFeatureFlag } from '../../../base/flags';
import { Container, LoadingIndicator, TintedView } from '../../../base/react';
import { connect } from '../../../base/redux';
import { ASPECT_RATIO_NARROW } from '../../../base/responsive-ui/constants';
import { TestConnectionInfo } from '../../../base/testing';
import { ConferenceNotification, isCalendarEnabled } from '../../../calendar-sync';
import { Chat } from '../../../chat';
import { DisplayNameLabel } from '../../../display-name';
import { SharedDocument } from '../../../etherpad';
import {
    FILMSTRIP_SIZE,
    Filmstrip,
    isFilmstripVisible,
    TileView
} from '../../../filmstrip';
import { AddPeopleDialog, CalleeInfoContainer } from '../../../invite';
import { LargeVideo } from '../../../large-video';
import { KnockingParticipantList } from '../../../lobby';
import { BackButtonRegistry } from '../../../mobile/back-button';
import { Captions } from '../../../subtitles';
import { setToolboxVisible } from '../../../toolbox/actions';
import { Toolbox } from '../../../toolbox/components/native';
import { isToolboxVisible } from '../../../toolbox/functions';
import {
    AbstractConference,
    abstractMapStateToProps
} from '../AbstractConference';
import type { AbstractProps } from '../AbstractConference';

import Labels from './Labels';
import LonelyMeetingExperience from './LonelyMeetingExperience';
import NavigationBar from './NavigationBar';
import styles, { NAVBAR_GRADIENT_COLORS } from './styles';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import Auth from 'react-native-firebaseui-auth';

import { openDisplayNamePrompt } from '../../../display-name';


import { getRoomName } from '../../../base/conference';

import { getConferenceName } from '../../../base/conference';

import { setBarMetaData } from '../../../base/conference';

import LiveAudioStream from 'react-native-live-audio-stream';

import base64 from 'react-native-base64';

import DeviceInfo from 'react-native-device-info';

import { useWindowDimensions } from 'react-native';
import { Dimensions } from 'react-native';

import { doInvitePeople } from '../../../invite/actions.native';




/**
 * The type of the React {@code Component} props of {@link Conference}.
 */
type Props = AbstractProps & {

    bgimage: string,
    /**
     * Application's aspect ratio.
     */
    _aspectRatio: Symbol,

    /**
     * Wherther the calendar feature is enabled or not.
     */
    _calendarEnabled: boolean,

    /**
     * The indicator which determines that we are still connecting to the
     * conference which includes establishing the XMPP connection and then
     * joining the room. If truthy, then an activity/loading indicator will be
     * rendered.
     */
    _connecting: boolean,

    /**
     * Set to {@code true} when the filmstrip is currently visible.
     */
    _filmstripVisible: boolean,

    /**
     * The ID of the participant currently on stage (if any)
     */
    _largeVideoParticipantId: string,

    /**
     * Whether Picture-in-Picture is enabled.
     */
    _pictureInPictureEnabled: boolean,

    /**
     * The indicator which determines whether the UI is reduced (to accommodate
     * smaller display areas).
     */
    _reducedUI: boolean,

    /**
     * The indicator which determines whether the Toolbox is visible.
     */
    _toolboxVisible: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * The conference page of the mobile (i.e. React Native) application.
 */
class Conference extends AbstractConference<Props, *> {
    /**
     * Initializes a new Conference instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._onClick = this._onClick.bind(this);
        this._onHardwareBackPress = this._onHardwareBackPress.bind(this);
        this._setToolboxVisible = this._setToolboxVisible.bind(this);

        this.chunkCount = 0;

        this.state = {
          streaming:false
        //  bgimage: "https://edsvbar.com/backgrounds/dive.jpg",
        //  updateParentState: (newState) => this.setState(newState)
        }

        this.db = firestore();
        this.firestore = firestore;



    const options = {
      sampleRate: 441000,  // default is 44100 but 32000 is adequate for accurate voice recognition
      channels: 1,        // 1 or 2, default 1
      bitsPerSample: 16,  // 8 or 16, default 16
      audioSource: 6,     // android only (see below)
    };
    LiveAudioStream.init(options);


    }

    /*
       Initiates a multipart upload and returns an upload ID.
       Upload id is used to upload the other parts of the stream
   */


    /**
     * Implements {@link Component#componentDidMount()}. Invoked immediately
     * after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */

     stopListener = (unsubRef) => {
       unsubRef();
     };

     updateStuff(slug) {

        return;

                 //this.setBG();
                 //this.showDisplayName();
                 //debugger;

                 const firestore = this.db
                       .collection('interviews')
                       .doc(slug)
                       .onSnapshot(documentSnapshot => {

                           if(!documentSnapshot.data()){
                             //this.setBG();
                             alert('could not find room '+ slug);
                             return;
                           }

                           //alert('snap ' + (documentSnapshot.data().title ? documentSnapshot.data().title : 'no title'));

                           if(documentSnapshot.data().title){
                             this.setState({title:documentSnapshot.data().title});
                          }

                           if(documentSnapshot.data().date){
                             const date = documentSnapshot.data().date.toDate();
                             this.setState({dateString: date.toLocaleString()});
                           }

                           //this.setMeta(documentSnapshot.data());
                           //this.setTitle();
                           this.setBG();
                           //debugger;
                             //alert(documentSnapshot.data().title);
                            //this.props.dispatch(setBarMetaData(documentSnapshot.data()));
                        });

     }


    componentDidUpdate(prev) {

      //console.log('component did update');
        if(prev._slug != this.props._slug){

          this.updateStuff(this.props._slug);
          console.log('FL component did update  slug ' + slug + 'old slug' + prev._slug);

        }

    }


  showDisplayName(onPostSubmit) {

    this.props.dispatch(openDisplayNamePrompt(onPostSubmit));

  }

  showLogin(){

  const config = {
    providers: [
      'email',
      'phone',
      'apple',
    ],
    tosUrl: 'https://example.com/tos.htm',
    privacyPolicyUrl: 'https://example.com/privacypolicy.htm',
  };

  Auth.signIn(config)
    .then(user => console.log(user))
    .catch(err => console.log(err));

  //Auth.getCurrentUser().then(user => console.log(user));
  //Auth.signOut().then(res => console.log(res));
  //Auth.delete().then(res => console.log(res));

  }



    saveChunk(idx, data) {


      base64.decode(data);

      //console.log(data);

      //var dec = window.atob(enc);


      const blobdata = {
        blob: this.firestore.Blob.fromBase64String(data),
        seq: idx,
        time: this.firestore.Timestamp.fromDate(new Date())
      };

      const droop = this.db.collection('episodes').doc('episodea')
      .collection('recordings').doc('recordinga').collection('chunks')
      .add(blobdata);

    }

    invite() {


      this.props.dispatch(doInvitePeople());
    }

    startRecording() {


      const droopa = firestore()
            .collection('episodes')
            .doc('episodea')
            .collection('recordings')
            .doc('recordinga').delete();

      this.chunkCount = 0;
      const streaming = !this.state.streaming;

      this.setState({streaming:streaming});



      if(streaming){

        //  this.startMultiUpload('asldkfjalsdkfjalsdkfjlasdk jlasdkj flasdk jfalsdk jlasdk jfalsdkjflsdkfjlsadk jflaskdj flasdkjf alsdkjf lsdkafj asldk jflasdkafjalskdjfaslkd', 'test.m4a');


        const parent = this;

        LiveAudioStream.on('data', data => {


          //console.log('writing data');

          parent.saveChunk(parent.chunkCount, data);

          parent.chunkCount++;

          //reference.put(data);
          // base64-encoded audio data chunks

        });

        //LiveAudioStream.stop();
        LiveAudioStream.start();


      } else {

        this.booleanStop = false;

        console.log('stopping!');
        LiveAudioStream.stop();
        alert('made a file maybe');

      }


    }

    getChunks() {

      const droopa = firestore()
            .collection('episodes')
            .doc('episodea')
            .collection('recordings')
            .doc('recordinga')
            .collection('chunks').get()
            .then(data => {

              console.log('fme');
              console.log(data);

              });


    }


    async setBG() {



      const bgimageurl = await storage()
          .ref(this.props._slug + '/image.jpg')
          .getDownloadURL();

     this.setState({bgurl:bgimageurl});


    }

    //setMeta(data)

    componentDidMount() {
        BackButtonRegistry.addListener(this._onHardwareBackPress);


        const slug =  this.props._slug;
        if(slug){
          this.updateStuff(slug);
          console.log('FL component did mount slug ' + slug);
        }else {
          console.log('FL component did mount no slug');
        }



    }

    /**
     * Implements {@link Component#componentWillUnmount()}. Invoked immediately
     * before this component is unmounted and destroyed. Disconnects the
     * conference described by the redux store/state.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        // Tear handling any hardware button presses for back navigation down.
        BackButtonRegistry.removeListener(this._onHardwareBackPress);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Container style = { styles.conference }>

                { this._renderContent() }
            </Container>
        );
    }

    _onClick: () => void;

    /**
     * Changes the value of the toolboxVisible state, thus allowing us to switch
     * between Toolbox and Filmstrip and change their visibility.
     *
     * @private
     * @returns {void}
     */
    _onClick() {
        this._setToolboxVisible(!this.props._toolboxVisible);
    }

    _onHardwareBackPress: () => boolean;

    /**
     * Handles a hardware button press for back navigation. Enters Picture-in-Picture mode
     * (if supported) or leaves the associated {@code Conference} otherwise.
     *
     * @returns {boolean} Exiting the app is undesired, so {@code true} is always returned.
     */
    _onHardwareBackPress() {
        let p;

        if (this.props._pictureInPictureEnabled) {
            const { PictureInPicture } = NativeModules;

            p = PictureInPicture.enterPictureInPicture();
        } else {
            p = Promise.reject(new Error('PiP not enabled'));
        }

        p.catch(() => {
            this.props.dispatch(appNavigate(undefined));
        });

        return true;
    }

    /**
     * Renders JitsiModals that are supposed to be on the conference screen.
     *
     * @returns {Array<ReactElement>}
     */
    _renderConferenceModals() {
        return [
            <AddPeopleDialog key = 'addPeopleDialog' />,
        ];
    }

    /**
     * Renders the conference notification badge if the feature is enabled.
     *
     * @private
     * @returns {React$Node}
     */
    _renderConferenceNotification() {
        const { _calendarEnabled, _reducedUI } = this.props;

        return (
            _calendarEnabled && !_reducedUI
                ? <ConferenceNotification />
                : undefined);
    }

    /**
     * Renders the content for the Conference container.
     *
     * @private
     * @returns {React$Element}
     */

     find_dimensions(layout){
         const {x, y, width, height} = layout;

         this.setState({viewWidth:width, viewHeight:height});


       };

    exit() {
      alert('exit');
    }

    _renderContent() {
        const {
            _aspectRatio,
            _connecting,
            _filmstripVisible,
            _largeVideoParticipantId,
            _reducedUI,
            _shouldDisplayTileView,
            _toolboxVisible
        } = this.props;
        const showGradient = _toolboxVisible;
        const applyGradientStretching
            = _filmstripVisible && _aspectRatio === ASPECT_RATIO_NARROW && !_shouldDisplayTileView;

        if (_reducedUI) {
            return this._renderContentForReducedUi();
        }

        let { bgimage, updateParentState } = this.props;

        const defimage = 'https://firebasestorage.googleapis.com/v0/b/backpack-chat-73855.appspot.com/o/stock%2Fpinkclouds.jpg?alt=media';

        const image = {uri: (this.state.bgurl || defimage)}

        const buttonText = this.state.streaming ? 'RECORDING' : 'NOT RECORDING';

          const windowWidth = this.state.viewWidth || Dimensions.get('window').width;
          const windowHeight = this.state.viewHeight || Dimensions.get('window').height;

        const padding = {top:30, left:10, right:10, bottom:30};


        return (
          <View onLayout={(event) => { this.find_dimensions(event.nativeEvent.layout) }} style={styles.container}>
            <ImageBackground
            source={image}
            style={{backgroundColor:'#222',width: '100%', height: '100%', resizeMode:'cover'}}>

                {/*
                  * The LargeVideo is the lowermost stacking layer.
                  */
                    _shouldDisplayTileView
                        ? <TileView data={{ bgimage, updateParentState }}
                        style = {{
                          borderWidth:0,
                          borderColor:'white',
                          top:padding.top,
                          left:padding.left,
                          width:windowWidth - padding.left - padding.right ,
                          height:windowHeight - padding.top - padding.bottom
                          }}
                        onClick = { this._onClick } />
                        : <LargeVideo onClick = { this._onClick } />
                }


                {/*
                  * The activity/loading indicator goes above everything, except
                  * the toolbox/toolbars and the dialogs.
                  */
                    _connecting
                        && <TintedView>
                            <LoadingIndicator />
                        </TintedView>
                }

              {/*  <TouchableOpacity onPress={ () => this.exit() }
                  style = {{ position:'absolute', height:40, width:40, left:0, top:0}}
                >
                  <View style = {{backgroundColor:'red', height:25, width:25, top:7, left:7, borderRadius:15}} />
                </TouchableOpacity>
              */}

                <Text style = {{textAlign:'center', fontFamily:'Avenir', color:'rgba(255, 255, 255, .71)', fontSize:20, position:'absolute', width:250, height:30, top:10, left:(windowWidth - 250.0) * .5 }}>{this.state.title}</Text>



                <View
                    pointerEvents = 'box-none'
                    style = { styles.toolboxAndFilmstripContainer }>


                    { _shouldDisplayTileView || <Container style = { styles.displayNameContainer }>
                        <DisplayNameLabel participantId = { _largeVideoParticipantId } />
                    </Container> }


                    {/*<LonelyMeetingExperience />*/}


                    {/*
                      * The Filmstrip is in a stacking layer above the
                      * LargeVideo. The LargeVideo and the Filmstrip form what
                      * the Web/React app calls "videospace". Presumably, the
                      * name and grouping stem from the fact that these two
                      * React Components depict the videos of the conference's
                      * participants.
                      */
                        _shouldDisplayTileView ? undefined : <Filmstrip />
                    }

                    <TouchableOpacity onPress={ () => this.invite() }
                      style = {{position:'absolute', height:40, width:133, borderRadius:20, left:(windowWidth - 133.0) * .5, bottom:5, backgroundColor:'green'}}
                    >


                    <Text style = {{fontWeight:'500', paddingTop:10, fontFamily:'Avenir', width:'100%', height:'100%',color:'white', textAlign:'center'}}>Invite Guests</Text>

                    </TouchableOpacity>


                    {/*
                    <TouchableOpacity onPress={ () => this.startRecording() }
                      style = {{position:'absolute', height:50, bottom:10, width:windowWidth, backgroundColor:'red'}}
                    >

                    <View>
                        <Text style = {{color:'white', textAlign:'center'}}>{buttonText}</Text>
                    </View>
                    </TouchableOpacity>
                  */}

                  {/*<Toolbox />*/}

                </View>



                <TestConnectionInfo />

                { this._renderConferenceNotification() }

                { this._renderConferenceModals() }


                </ImageBackground>
            </View>
        );
    }

    /**
     * Renders the content for the Conference container when in "reduced UI" mode.
     *
     * @private
     * @returns {React$Element}
     */
    _renderContentForReducedUi() {
        const { _connecting } = this.props;

        return (
            <>
                <LargeVideo onClick = { this._onClick } />

                {
                    _connecting
                        && <TintedView>
                            <LoadingIndicator />
                        </TintedView>
                }
            </>
        );
    }

    /**
     * Renders a container for notifications to be displayed by the
     * base/notifications feature.
     *
     * @private
     * @returns {React$Element}
     */
    _renderNotificationsContainer() {
        const notificationsStyle = {};

        // In the landscape mode (wide) there's problem with notifications being
        // shadowed by the filmstrip rendered on the right. This makes the "x"
        // button not clickable. In order to avoid that a margin of the
        // filmstrip's size is added to the right.
        //
        // Pawel: after many attempts I failed to make notifications adjust to
        // their contents width because of column and rows being used in the
        // flex layout. The only option that seemed to limit the notification's
        // size was explicit 'width' value which is not better than the margin
        // added here.
        const { _aspectRatio, _filmstripVisible } = this.props;

        if (_filmstripVisible && _aspectRatio !== ASPECT_RATIO_NARROW) {
            notificationsStyle.marginRight = FILMSTRIP_SIZE;
        }

        return super.renderNotificationsContainer(
            {
                style: notificationsStyle
            }
        );
    }

    _setToolboxVisible: (boolean) => void;

    /**
     * Dispatches an action changing the visibility of the {@link Toolbox}.
     *
     * @private
     * @param {boolean} visible - Pass {@code true} to show the
     * {@code Toolbox} or {@code false} to hide it.
     * @returns {void}
     */
    _setToolboxVisible(visible) {
        this.props.dispatch(setToolboxVisible(visible));
    }
}

/**
 * Maps (parts of) the redux state to the associated {@code Conference}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {


    const { connecting, connection } = state['features/base/connection'];
    const {
        conference,
        joining,
        membersOnly,
        leaving
    } = state['features/base/conference'];
    const { aspectRatio, reducedUI } = state['features/base/responsive-ui'];

    // XXX There is a window of time between the successful establishment of the
    // XMPP connection and the subsequent commencement of joining the MUC during
    // which the app does not appear to be doing anything according to the redux
    // state. In order to not toggle the _connecting props during the window of
    // time in question, define _connecting as follows:
    // - the XMPP connection is connecting, or
    // - the XMPP connection is connected and the conference is joining, or
    // - the XMPP connection is connected and we have no conference yet, nor we
    //   are leaving one.
    const connecting_
        = connecting || (connection && (!membersOnly && (joining || (!conference && !leaving))));



    //state["features/base/conference"].barMetaData ? state["features/base/conference"].barMetaData.background_url : 'https://edsvbar.com/backgrounds/dive.jpg';

    const slug = state["features/base/conference"].room;
    return {

        ...abstractMapStateToProps(state),

        //bgimage: bgimage,

        _newSlug: this.props && (this.props._slug != slug),

        _slug: slug,
        /**
         * Wherther the calendar feature is enabled or not.
         *
         * @private
         * @type {boolean}
         */
        _aspectRatio: aspectRatio,
        _calendarEnabled: isCalendarEnabled(state),
        _connecting: Boolean(connecting_),
        _filmstripVisible: isFilmstripVisible(state),
        _largeVideoParticipantId: state['features/large-video'].participantId,
        _pictureInPictureEnabled: getFeatureFlag(state, PIP_ENABLED),
        _reducedUI: reducedUI,
        _toolboxVisible: isToolboxVisible(state)
    };
}

export default connect(_mapStateToProps)(Conference);
