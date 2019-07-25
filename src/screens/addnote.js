import React, {Component} from 'react';
import {Platform, ActivityIndicator,ScrollView,findNodeHandle,TouchableOpacity,StyleSheet, TextInput,StatusBar, Text,View,Image} from 'react-native';
import {activateLoader,stopLoader} from '../common/utils';
import Styles from '../common/style';

import {serviceAddNote} from '../service/api';
import { scale, verticalScale } from '../common/scale';
import Modal from "react-native-modal";


const { styles } = Styles;

var self= null;
export default class AddNoteScreen extends Component {
  constructor(props) {
    super(props);
    self = this;    
    this.state = {             
        loading:false,
        isError:false,
        errorMsg:'',        
        title:'',
        content:'',
        isSuccess:false 
    }
  }
  componentDidMount() {    

  }
  addNote()
  {
    if (this.state.title == '')
    {
        this.setState({isError:true,errorMsg:'Please fill title'});
        return;
    }
    if (this.state.content == '')
    {
        this.setState({isError:true,errorMsg:'Please fill content'});
        return;
    }
    activateLoader(this,"Creating Note...");    
    serviceAddNote(this.state.title,this.state.content)
    .then(res=>{ 
      stopLoader(this);
      this.setState({isSuccess:true});

    })
    .catch(err=>{
      stopLoader(this);
    });
  }
  clickGoNote()
  {
    this.setState({isSuccess:false});
    this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack();
  }
  render() {
    return (
      <View style={[styles.bg,styles.flexFull]}>
        {
          this.state.loading == true &&
          <View style={styles.loading}>
              <View style={styles.loaderView}>
                  <ActivityIndicator color="#fff" style={styles.activityIndicator}/>
                  <Text style={styles.loadingText}>{this.state.loadingText}</Text>
              </View>
          </View>
        }
        <StatusBar hidden={true} />
        <ScrollView style={{flex:1}}>
          <View>
            <View style={[styles.vwFrame,{marginTop:20,marginLeft:20,marginRight:20}]}>
              <Text style={{color:'#5DA1DA',textAlign:'center',fontSize:18}}>New Note</Text>              
              <Text style={{marginTop:10,color:'#5DA1DA'}}>Title</Text>
              <TextInput style={styles.inputForm} onChangeText={(text) => this.setState({title:text})}/>
              <Text style={{marginTop:10,color:'#5DA1DA'}}>Content</Text>
              <TextInput style={[styles.inputForm,{height:100}]} multiline = {true} onChangeText={(text) => this.setState({content:text})}/>
            </View>            
            <View style={[styles.vwFrame,{marginTop:10,marginLeft:20,marginRight:20}]}>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={{marginTop:10,flex:1,marginRight:5}} onPress={()=> this.props.navigation.goBack()}>
                  <View style={[styles.btnPrimary,{alignItems:'center'}]}>
                    <Text style={{color:'#5DA1DA'}}>Back</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop:10,flex:1,marginLeft:5}} onPress={()=>this.addNote()}>
                  <View style={[styles.btnPrimary,{alignItems:'center'}]}>
                    <Text style={{color:'#5DA1DA'}}>Submit</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>        
        <Modal 
          backdropColor="#000"
          isVisible={this.state.isError}>
          <View style={{ backgroundColor:"#FC4236",padding:scale(10),borderRadius:scale(10),alignItems:'center',}}>
              <View style={{marginVertical:verticalScale(0)}}>
                  
                  <Text style={{color:'#FFF',fontSize:scale(18),textAlign:"center",marginVertical:verticalScale(20)}}>
                      {this.state.errorMsg}
                  </Text>
                  <TouchableOpacity 
                  style={{alignSelf:'center'}}
                  onPress={()=>this.setState({
                      isError:false
                  })}>
                      <Text style={{padding:scale(10),textAlign:'center',color:'#fff',fontWeight:'bold'}}> Dismiss </Text>
                  </TouchableOpacity>
              </View>
          </View>
        </Modal>

        <Modal 
          backdropColor="#000"
          isVisible={this.state.isSuccess}>
          <View style={{backgroundColor:"#54C540",padding:scale(10),borderRadius:scale(10),alignItems:'center',}}>
              <View style={{marginVertical:verticalScale(0)}}>
                  
                  <Text style={{color:'#FFF',fontSize:scale(18),textAlign:"center",marginVertical:verticalScale(20)}}>
                      Note created successfully!
                  </Text>
                  <TouchableOpacity 
                  style={{alignSelf:'center'}}
                  onPress={()=>this.clickGoNote()}>
                      <Text style={{padding:scale(10),textAlign:'center',color:'#fff',fontWeight:'bold'}}> Go My notes </Text>
                  </TouchableOpacity>
              </View>
          </View>
        </Modal>

      </View>
    );
  }
}