import React, { PureComponent } from "react";
import {
  Linking,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";

import {ImageButton} from 'react-native-image-button-text';

import { openDialog, hideDialog } from '../../../base/dialog';
import { type Dispatch } from 'redux';

import { connect } from '../../../base/redux';


type Props = {


    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Dispatch<any>
};

class TipDialog extends PureComponent<Props>{
  state = {
    modalVisible: true
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  openVenmo = () => {
    Linking.openURL('http://venmo.com/edfilo').catch(err => console.error("Couldn't load page", err));
  };

  openPaypal = () => {
    Linking.openURL('http://paypal.me/edfilo').catch(err => console.error("Couldn't load page", err));
  };

  render() {
    const { modalVisible } = this.state;

    return (
      <View style={styles.centeredView}>
        <Modal
        supportedOrientations={['landscape']}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text style={styles.modalText}>Thank you for tipping.  It helps us pay the nightly server bill to keep the bars open.</Text>
            <View style = {styles.container}>
              <ImageButton
                      width={100}
                      height={100}
                      fontSize={10}
                      textColor="#111"
                      paddingTop={4}
                      textAlignHorizontal="flex-start"
                      onPress={this.openVenmo.bind(this)}
                      source={require('./venmo.png')}
                      text="Venmo"/>
                <ImageButton
                              width={100}
                              height={100}
                              fontSize={10}
                              textColor="#111"
                              paddingTop={4}
                              textAlignHorizontal="flex-start"
                              onPress={this.openPaypal.bind(this)}
                              source={require('./paypal.png')}
                              text="Paypal"/>
            </View>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  this.setModalVisible(!modalVisible);
                  this.props.dispatch(hideDialog());

                }}
              >
                <Text style={styles.textStyle}>Dismiss</Text>
              </TouchableHighlight>

            </View>
          </View>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

function _mapStateToProps(state: Object): Object {
    return {

    };
}

export default connect(_mapStateToProps)(TipDialog);
