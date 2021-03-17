import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, TouchableOpacity } from "react-native";


function  TextBox(props) {

  var name = '';

  const handleSubmit= (e) => {

      // alert('functional name' + name);

       props.onSubmit(name);

      //debugger;
      //e.preventDefault();
      // ???

    }


  return(<View style = {{...props.styles, position:'absolute', alignItems:'center', height:400, width:300, borderColor:'red', borderWidth:0}}>
    <View style = {{padding:5, width:'100%', alignItems:'center', backgroundColor:'#000', height:200, padding:0, borderRadius:20, borderWidth:1, borderColor:'rgba(255.0,255.0,255.0,.222)'}} >

        <Text style = {{fontSize: 18, padding:20, color:'white', textAlign:'center', fontFamily:'Avenir'}}>
            {props.heading}
        </Text>

        <TextInput

            accessibilityLabel = { props.heading }
            autoCapitalize = 'none'
            autoComplete = 'off'
            autoCorrect = { false }
            autoFocus = { false }
            onBlur = { props.onFieldBlur }
            onChangeText =  {(text) => name = text}
            onFocus = { props.onFieldFocus }
            onSubmitEditing = { handleSubmit  }
            placeholder = { props.placeholder}
            placeholderTextColor = { '#222' }
            returnKeyType = { 'go' }
            style = {{
              backgroundColor: 'transparent',
              borderColor: 'white',
              borderRadius: 4,
              borderWidth: 1,
              color: 'white',
              fontSize: 23,
              height: 50,
              padding: 4,
              textAlign: 'center',
              width:150, borderRadius:9, backgroundColor:'#011', borderColor:'#ccc'}}
            underlineColorAndroid = 'transparent'
            value = { props.value } />
          <TouchableOpacity onPress = { handleSubmit  }>
                <Text style = {{width:150, backgroundColor:'transparent', fontSize:20, paddingTop:10, textAlign:'center',color:'#71ef5e', height:40}}>
                  {props.join}
                </Text>
          </TouchableOpacity>

    </View>


  </View>);

};



export default TextBox
