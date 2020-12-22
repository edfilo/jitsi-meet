/**
 * Created by liyong1 on 2018/11/26
 * email:liyong1@yy.com
 */


'use strict';
import React, {Component} from 'react';
import {
    Image,
    ImageStylePropTypes,
    NativeModules,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import PropTypes from 'prop-types';

export default class RoundButton extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        backgroundColor: PropTypes.string,
        activeOpacity: PropTypes.number,
        fontSize: PropTypes.number,
        textColor: PropTypes.string,
        onPress: PropTypes.func,
        onPressIn: PropTypes.func,
        onPressOut: PropTypes.func,
        paddingTop: PropTypes.number,
        paddingLeft: PropTypes.number,
        paddingRight: PropTypes.number,
        paddingBottom: PropTypes.number,
        textAlignVertical: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
        textAlignHorizontal: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
        imageAlignVertical: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
        textHeight: PropTypes.number,
        makeRound: PropTypes.boolean,
        imagePadding: PropTypes.number,
        imageBackgroundColor: PropTypes.string
    };

    static defaultProps = {
        width:90,
        height:110,
        activeOpacity: 0.3,
        fontSize: 12,
        textColor: 'white',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        textAlignHorizontal: 'center',
        textAlignVertical: 'flex-end',
        imageAlignVertical: 'flex-start',
        textHeight: 20,
        makeRound: true,
        imagePadding: 30,
        imageBackgroundColor: 'black',
        imageBorderColor: 'white',
        backgroundColor: 'transparent'

    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    _onPress = () => {
        if (this.props.onPress) {
            this.props.onPress();
        }
    };

    _onPressIn = () => {
        if (this.props.onPressIn) {
            this.props.onPressIn();
        }
    };

    _onPressOut = () => {
        if (this.props.onPressOut) {
            this.props.onPressOut();
        }
    };

    renderContent() {
        let arr = [];
        let isTextEmpty = this.props.text.length === 0;
        //let backgroundColor = this.props.backgroundColor || 'transparent';
        if (this.props.source) {
            arr.push(
              <View
                style={{backgroundColor:this.props.imageBackgroundColor,
                  borderWidth:3.0,
                  borderColor: this.props.imageBorderColor,
                  borderRadius: this.props.round ? this.props.width * 5 : 0 ,
                   alignItems: 'center',
                   width: this.props.width,
                   height: this.props.height - this.props.textHeight
                 }}>
                 <Image source = {this.props.source}
                  style = {{marginTop:this.props.imagePadding,
                    width:this.props.width - this.props.imagePadding * 2.0,
                    height:this.props.width - this.props.imagePadding * 2.0
                  }}
                 />
              </View>);
        }

        if (!isTextEmpty) {
            arr.push(
                <View key={1} style={[styles.name, {

                    justifyContent: 'center',
                    height: this.props.textHeight
                }]}><Text style={{
                    fontSize: this.props.fontSize,
                    color: this.props.textColor
                }}>{this.props.text}</Text></View>
            );
        } else {
            arr.push(<View key={2}/>)
        }

        return arr;
    }

    render() {

//  style={[{width: this.props.width, height: this.props.height}, this.props.style, styles.container]}
        return (
            <TouchableOpacity

                style = {{margin:10, alignItems:'center',  backgroundColor:this.props.backgroundColor,  flexDirection:'column', height:this.props.height, width:this.props.width}}
                activeOpacity={this.props.activeOpacity}
                onPress={this._onPress}
                onPressIn={this._onPressIn}
                onPressOut={this._onPressOut}>
                {this.renderContent()}
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({


});
