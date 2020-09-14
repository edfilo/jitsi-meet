import React, { PureComponent } from "react";
import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  TextInput,
  Button
} from "react-native";

import RoundButton from './RoundButton';
import {MODAL_STYLE} from '../../../base/media';

import { RecentList } from '../../../../features/recent-list';



import { type Dispatch } from 'redux';

export default class TipDialog extends PureComponent<Props> {

  constructor(props) {
    super(props);

    console.log('millenial props ' + JSON.stringify(this.props));

    const initialValue = (this.props.modalStyle === MODAL_STYLE.YOUTUBE)?
    'https://www.youtube.com/watch?v=hTWKbfoikeg' : 'eds';

    console.log('initialvalue' + initialValue);


    this.state = {
        fieldValue: initialValue
    };

    this._onChangeText = this._onChangeText.bind(this);
    this._onSubmitValue = this._onSubmitValue.bind(this);

    //  value="https://www.youtube.com/watch?v=hTWKbfoikeg"/>
  }


  _onSubmitValue(button) {



      return this._onSubmit(this.state.fieldValue);
  }




  openVenmo = () => {
    Linking.openURL('http://venmo.com/edfilo').catch(err => console.error("Couldn't load page", err));
  };

  openPaypal = () => {
    Linking.openURL('http://paypal.me/edfilo').catch(err => console.error("Couldn't load page", err));
  };



  goPressed = (button) => {

    const videoId = 'Bw_7UrqzNUg';
    this.props.launchBar(this.state.fieldValue);

  }


          _onCancel: () => void;

          _onChangeText: string => void;

          /**
           * Callback to be invoked when the text in the field changes.
           *
           * @param {string} fieldValue - The updated field value.
           * @returns {void}
           */
          _onChangeText(fieldValue) {

            //  if (this.props.validateInput
                    //  && !this.props.validateInput(fieldValue)) {
                  //return;
            //  }

              console.log('validating ' + fieldValue);

              this.setState({
                  fieldValue
              });
          }


          _onSubmit(val) {

            this.props.onSubmit(val);

          }



          _onSubmitValue: () => boolean;

          /**
           * Callback to be invoked when the value of this dialog is submitted.
           *
           * @returns {boolean}
           */


           _onSubmitTechno(button) {

               this.props.launchVideo('https://www.youtube.com/watch?v=msgbByDIuO8');

           }

           _onSubmitTrap(button) {

               this.props.launchVideo('https://www.youtube.com/watch?v=5ZT3gTu4Sjw');

           }


          _onSubmitValue(button) {


              if(this.props.modalStyle === MODAL_STYLE.YOUTUBE){
                this.props.launchVideo(this.state.fieldValue);
              }

              if(this.props.modalStyle === MODAL_STYLE.BAR){
                this.props.launchBar(this.state.fieldValue);
              }

              //return this._onSubmit(this.state.fieldValue);
          }



  renderInsides() {

    const textInputStyle = { height: 40, width:230, borderColor: 'gray', borderWidth: 1, borderRadius: 10, padding:5 };

    if (this.props.modalStyle === MODAL_STYLE.TIP){
        return(<>
          <Text style={styles.modalTextHeading}>Thank you</Text>
          <Text style={{...styles.modalText, width:250}}>Tipping allows us pay our servers each night and keep all the bars open!!!</Text>
          <View style = {styles.container}>
            <RoundButton
                    imageBackgroundColor="white"
                    imageBorderColor = "white"
                    radius = {0}
                    imagePadding = {0}
                    width={111}
                    height={133}
                    fontSize={14}
                    textColor="#111"
                    paddingTop={0}
                    paddingBottom={0}
                    textAlignHorizontal="center"
                    textAlignVertical="flex-end"
                    onPress={this.openVenmo.bind(this)}
                    source={require('./venmofun.png')}
                     text=""/>
              <RoundButton
                    imageBackgroundColor="white"
                    imageBorderColor = "white"
                    radius = {0}
                    imagePadding = {0}
                    width={111}
                    height={133}
                    fontSize={14}
                    textColor="#111"
                    paddingTop={0}
                    textAlignHorizontal="flex-start"
                    onPress={this.openPaypal.bind(this)}
                    source={require('./paypal.png')}
                    text=""/>
          </View></>);

      } else if (this.props.modalStyle === MODAL_STYLE.YOUTUBE) {

          return(<>
            <Text style={styles.modalTextHeading}>Youtube</Text>
            <Text style={{...styles.modalText, width:250}}>
            Enter a youtube url
            </Text>

    <TextInput
      style={textInputStyle}
      onChangeText = { this._onChangeText }
      value = { this.state.fieldValue } />

      <View style={{flexDirection:'row'}}>

      <TouchableOpacity id="techno" onPress={this._onSubmitTechno.bind(this)} style={styles.cuteButton}>
      <Text style={styles.buttonText}>Techno</Text>
      </TouchableOpacity>

      <TouchableOpacity id="trap" onPress={this._onSubmitTrap.bind(this)} style={styles.cuteButton}>
      <Text style={styles.buttonText}>Trap</Text>
      </TouchableOpacity>

      </View>


      <TouchableOpacity onPress={this._onSubmitValue} style={styles.cuteButton}>
      <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>
        </>);

      } else {


        console.log('field value is ' + this.state.fieldValue);


        return(<>
          <Text style={styles.modalTextHeading}>Barhop</Text>
          <Text style={{...styles.modalText, width:250}}>
          Enter the keyword
          </Text>
          <TextInput
            style={textInputStyle}
            onChangeText = { this._onChangeText }
            value = { this.state.fieldValue } />
            <TouchableOpacity onPress={this._onSubmitValue} style={styles.cuteButton}>
            <Text>GO</Text>
            </TouchableOpacity>
            <RecentList /></>);
    };



  }

  render() {

    return (
      <View style={styles.centeredView}>
        <Modal supportedOrientations={['landscape']}
          animationType="slide"
          transparent={true}><View style={styles.centeredView}>
            <View style={styles.modalView}>
            <View style={{alignSelf: 'stretch', justifyContent:'flex-end', ction:'row'}}>
            <TouchableHighlight
              style={{ ...styles.closeButton}}>
              <Text style={styles.textStyle} onPress = { () => this.props.closeDisplay() }>Done</Text>
            </TouchableHighlight>
            </View>
              {this.renderInsides()}


            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  centeredView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex:1000
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  cuteButton: {
    backgroundColor: "#2196F3",
    color:'white',
  //  backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    width:65,
    elevation: 2,
    alignItems:'center',
    marginTop:10
  },
  buttonText: {
    color:'white',
    fontWeight:'bold',
    textAlign:'center'
  },


  textStyle: {

    fontWeight: "bold",
    textAlign: "center"

  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalTextHeading: {
    fontWeight:"500",
    fontSize: 19
  }
});
