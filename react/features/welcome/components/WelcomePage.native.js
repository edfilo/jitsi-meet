import React from 'react';

import {
    ImageBackground,
    Animated,
    Keyboard,
    SafeAreaView,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View,
    Linking,
    Image
} from 'react-native';

import { getName } from '../../app/functions';
import { ColorSchemeRegistry } from '../../base/color-scheme';
import { translate } from '../../base/i18n';
import { Icon, IconMenu, IconWarning } from '../../base/icons';
import { MEDIA_TYPE } from '../../base/media';
import { Header, LoadingIndicator, Text } from '../../base/react';
import { connect } from '../../base/redux';
import { ColorPalette } from '../../base/styles';
import {
    createDesiredLocalTracks,
    destroyLocalDesktopTrackIfExists,
    destroyLocalTracks
} from '../../base/tracks';
import { HelpView } from '../../help';
import { DialInSummary } from '../../invite';
import { SettingsView } from '../../settings';
import { setSideBarVisible } from '../actions';

import {
    AbstractWelcomePage,
    _mapStateToProps as _abstractMapStateToProps
} from './AbstractWelcomePage';
import LocalVideoTrackUnderlay from './LocalVideoTrackUnderlay';
import VideoSwitch from './VideoSwitch';
import WelcomePageLists from './WelcomePageLists';
import WelcomePageSideBar from './WelcomePageSideBar';
import styles, { PLACEHOLDER_TEXT_COLOR } from './styles';

import firestore from '@react-native-firebase/firestore';

import { updateSettings } from '../../base/settings';


/**
 * The native container rendering the welcome page.
 *
 * @extends AbstractWelcomePage
 */
class WelcomePage extends AbstractWelcomePage {
    /**
     * Constructor of the Component.
     *
     * @inheritdoc
     */
    constructor(props) {

        super(props);

        this.state._fieldFocused = false;
        this.state.hintBoxAnimation = new Animated.Value(0);

        // Bind event handlers so they are only bound once per instance.
        this._onFieldFocusChange = this._onFieldFocusChange.bind(this);
        this._onShowSideBar = this._onShowSideBar.bind(this);
        this._renderHintBox = this._renderHintBox.bind(this);

        // Specially bind functions to avoid function definition on render.
        this._onFieldBlur = this._onFieldFocusChange.bind(this, false);
        this._onFieldFocus = this._onFieldFocusChange.bind(this, true);

        this._onPressRoom = this._onPressRoom.bind(this);
        this._onPressStudioBeta = this._onPressStudioBeta.bind(this);
        this._onPressDisplayName = this._onPressDisplayName.bind(this);
        this._onDisplayNameChange = this._onDisplayNameChange.bind(this);

        this.db = firestore();

        this.validRoom = false;
        //this.props._room = 'test';

        //debugger;
        //alert(this.props._room);

        //this.state.room = 'test';//'funcle';//'kxgv8';

    }

    componentDidUpdate() {

      if(this.state.validRoom && this.state.room && this.props._hasDisplayName){

        if(!this.isJoining){
          this._onJoin();
          this.isJoining = true;
        }

      }

    }

    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs. Creates a local video track if none
     * is available and the camera permission was already granted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        super.componentDidMount();

        const { dispatch } = this.props;

        if (this.props._settings.startAudioOnly) {

            dispatch(destroyLocalTracks());

        } else {

            dispatch(destroyLocalDesktopTrackIfExists());

            // Make sure we don't request the permission for the camera from
            // the start. We will, however, create a video track iff the user
            // already granted the permission.
/*
            navigator.permissions.query({ name: 'camera' }).then(response => {
                response === 'granted'
                    && dispatch(createDesiredLocalTracks(MEDIA_TYPE.VIDEO));
            });
            */

        }
    }

    /**
     * Implements React's {@link Component#render()}. Renders a prompt for
     * entering a room name.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        // We want to have the welcome page support the reduced UI layout,
        // but we ran into serious issues enabling it so we disable it
        // until we have a proper fix in place. We leave the code here though, because
        // this part should be fine when the bug is fixed.
        //
        // NOTE: when re-enabling, don't forget to uncomment the respective _mapStateToProps line too

        /*
        const { _reducedUI } = this.props;

        if (_reducedUI) {
            return this._renderReducedUI();
        }
        */

        return this._renderChatUI();
    }

    /**
     * Renders the insecure room name warning.
     *
     * @inheritdoc
     */
    _doRenderInsecureRoomNameWarning() {
        return (
            <View
                style = { [
                    styles.messageContainer,
                    styles.insecureRoomNameWarningContainer
                ] }>
                <Icon
                    src = { IconWarning }
                    style = { styles.insecureRoomNameWarningIcon } />
                <Text style = { styles.insecureRoomNameWarningText }>
                    { this.props.t('security.insecureRoomNameWarning') }
                </Text>
            </View>
        );
    }

    /**
     * Constructs a style array to handle the hint box animation.
     *
     * @private
     * @returns {Array<Object>}
     */
    _getHintBoxStyle() {
        return [
            styles.messageContainer,
            styles.hintContainer,
            {
                opacity: this.state.hintBoxAnimation
            }
        ];
    }

    /**
     * Callback for when the room field's focus changes so the hint box
     * must be rendered or removed.
     *
     * @private
     * @param {boolean} focused - The focused state of the field.
     * @returns {void}
     */
    _onFieldFocusChange(focused) {

        focused
            && this.setState({
                _fieldFocused: true
            });

        Animated.timing(
            this.state.hintBoxAnimation,
            {
                duration: 300,
                toValue: focused ? 1 : 0
            })
            .start(animationState =>
                animationState.finished
                    && !focused
                    && this.setState({
                        _fieldFocused: false
                    }));
    }

    /**
     * Toggles the side bar.
     *
     * @private
     * @returns {void}
     */
    _onShowSideBar() {
        Keyboard.dismiss();
        this.props.dispatch(setSideBarVisible(true));
    }

    /**
     * Renders the hint box if necessary.
     *
     * @private
     * @returns {React$Node}
     */
    _renderHintBox() {
        if (this.state._fieldFocused) {
            const { t } = this.props;

            return (
                <Animated.View style = { this._getHintBoxStyle() }>
                    <View style = { styles.hintTextContainer } >
                        <Text style = { styles.hintText }>
                            { t('welcomepage.roomnameHint') }
                        </Text>
                    </View>
                    <View style = { styles.hintButtonContainer } >
                        { this._renderJoinButton() }
                    </View>
                </Animated.View>
            );
        }

        return null;
    }

    /**
     * Renders the join button.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderJoinButton() {
        const { t } = this.props;
        let children;

        if (this.state.joining) {
            // TouchableHighlight is picky about what its children can be, so
            // wrap it in a native component, i.e. View to avoid having to
            // modify non-native children.

            children = (<View>
                    <LoadingIndicator
                        color = { styles.buttonText.color }
                        size = 'small' />
                </View>) ;

        } else {

            children = (
                <Text style = { styles.buttonText }>
                    { this.props.t('welcomepage.join') }
                </Text>
            );

        }

        return (
            <TouchableHighlight
                accessibilityLabel =
                    { t('welcomepage.accessibilityLabel.join') }
                onPress = { this._onPress }
                style = { styles.button }
                underlayColor = { ColorPalette.white }>
                { children }
            </TouchableHighlight>);
    }



    /**
     * Renders the full welcome page.
     *
     * @returns {ReactElement}
     */

     go() {

     }

    _verifyRoom(room) {


      var self = this;
      this.db.collection('interviews')
      .where("code", "==", room).get().then((querySnapshot) => {

        if(querySnapshot.docs == 0){
          alert('Invalid code');
          self.props.dispatch(updateSettings({validRoom:false}));
          return;
        }

          querySnapshot.docs.forEach((d) => {

              if(d.exists) {

                 self.setState({validRoom:true});
                 self.validRoom = true;
                 self.props.dispatch(updateSettings({validRoom:true}));

              } else {

              }
            });

          });
    }



    _onPressDisplayName() {


      this.props.dispatch(updateSettings({displayName:this.state.displayName}));


    }

    _onPressRoom() {
      const room =  this._verifyRoom(this.state.room);
    }

    _onDisplayNameChange(value: string) {

      this.setState({displayName:value});
    }



    _onPressStudioBeta() {

      const url = 'https://testflight.apple.com/join/3lHe1WZS';

      Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert("Could not open " + url);
      }});

    }


    _renderSplash () {

      //const splash = {uri:'liveicons/greenicon.png'};

      const splash = {uri:'liveicons/splashscreen.png'};

      return(<Image style = {{width:100,height:100}} source= {splash}/>);

    }

    _renderChatUI() {

      const roomnameAccLabel = 'welcomepage.accessibilityLabel.roomname';

      const { _headerStyles, t } = this.props;


      const image = {uri:'backgrounds/cali.jpg'};

      const welcome = 'Enter code,  or click on link from host to join interview.';
      const enterdisplayname = 'Enter your first name.';





      this.validRoom = this.state.validRoom;


      console.log(this.validRoom ? "room is valid" : "room is invalid");

    //  console.log('props' + this.props._room);

      return (<ImageBackground
        source={image}
        style={{backgroundColor:'#111',width: '100%', height: '100%', resizeMode:'cover'}}>
                <SafeAreaView style = {{...styles.roomContainer, flexDirection:'row', justifyContent:'center', marginTop:166}} >
                    <View style = {{flexDirection:'column', alignItems:'center', height:500, width:300, borderColor:'red', borderWidth:0}}>
                      <View style = {{...styles.joinControls, width:'100%', alignItems:'center', backgroundColor:'#000', height:244, padding:0, borderRadius:20, borderWidth:1, borderColor:'rgba(255.0,255.0,255.0,.222)'}} >
  {this._renderSplash()}
                          <Text style = {{...styles.enterRoomText, textAlign:'center', fontFamily:'Avenir'}}>


                              {this.validRoom ? enterdisplayname : welcome}


                          </Text>
                          <TextInput
                              accessibilityLabel = { t(roomnameAccLabel) }
                              autoCapitalize = 'none'
                              autoComplete = 'off'
                              autoCorrect = { false }
                              autoFocus = { false }
                              onBlur = { this._onFieldBlur }
                              onChangeText =  {this.validRoom ?  this._onDisplayNameChange : this._onRoomChange }
                              onFocus = { this._onFieldFocus }
                              onSubmitEditing = { this.validRoom ? this._onPressDisplayName : this._onPressRoom  }
                              placeholder = { this.validRoom ? 'name' : this.state.roomPlaceholder }
                              placeholderTextColor = { PLACEHOLDER_TEXT_COLOR }
                              returnKeyType = { 'go' }
                              style = {{...styles.textInput, width:150, borderRadius:9, backgroundColor:'#011', borderColor:'#ccc'}}
                              underlineColorAndroid = 'transparent'
                              value = { this.validRoom ? this.state.displayName : this.state.room } />
                            <TouchableOpacity onPress = { this.validRoom ? this._onPressDisplayName : this._onPressRoom  }>
                                  <Text style = {{width:150, backgroundColor:'transparent', fontSize:20, paddingTop:10, textAlign:'center',color:'#71ef5e', height:40}}>{'Join'}</Text>
                            </TouchableOpacity>

                      </View>

                      <TouchableOpacity style = {{marginTop:150}} onPress = {this._onPressStudioBeta}>
                                          <Text style={{textAlign:'center',color:'white', fontFamily:'Avenir'}}>
                                              {'Host your own podcast with live guests.'}
                                          </Text>
                                          <Text style={{textAlign:'center',color:'green', fontFamily:'Avenir'}}>
                                              {'Get the Backpack Studio 1.5 beta'}
                                          </Text>
                      </TouchableOpacity>


                    </View>


                  </SafeAreaView>
                </ImageBackground>);

    }



    /**
     * Renders JitsiModals that are supposed to be on the welcome page.
     *
     * @returns {Array<ReactElement>}
     */
    _renderWelcomePageModals() {
        return [
            <HelpView key = 'helpView' />,
            <DialInSummary key = 'dialInSummary' />,
            <SettingsView key = 'settings' />
        ];
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Object}
 */
function _mapStateToProps(state) {

    console.log('indian beach mapping state room: ' + state['features/base/conference'].room);
    console.log('indian beach mapping  display name: ' + state['features/base/settings'].displayName);
    console.log('indian beach valid room:' + state['features/base/settings'].validRoom);

    const hasroom = state['features/base/settings'].validRoom || state['features/base/conference'].room;
    const hasname = state['features/base/settings'].displayName;


    return {
        ..._abstractMapStateToProps(state),
        _headerStyles: ColorSchemeRegistry.get(state, 'Header'),
        _hasDisplayName: hasname,
        _hasRoom: hasroom
      //  _room: state['features/base/conference'].room


    };

}

export default translate(connect(_mapStateToProps)(WelcomePage));
