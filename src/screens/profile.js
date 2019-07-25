import React, {Component} from 'react';
import {Platform, ActivityIndicator,ScrollView,findNodeHandle,TouchableOpacity,StyleSheet, TextInput,StatusBar, Text,View,Image} from 'react-native';
import {serviceGetProfile} from '../service/api';
import Styles from '../common/style';
import {activateLoader,stopLoader} from '../common/utils';
import HTML from 'react-native-render-html';

const { styles } = Styles;

var self= null;
export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    self = this; 
    const {state} = props.navigation;    
    this.state = {
        loading:false,
        userInfo:state.params.userInfo,
        fields:[]
        
    }      
  }
  componentDidMount() {    
    this.getProfile();
  }
  getProfile()
  {
    activateLoader(this,"Getting Employee Info...");    
    serviceGetProfile()
    .then(res=>{ 
      stopLoader(this);
      console.warn(res);
      this.setState({fields:res.employee_profile_fields});
    })
    .catch(err=>{
      stopLoader(this);
    });
  }

  renderProfileFields()
  {
    return (      
        this.state.fields.map((value, i) => (
            i == 0?
            value.field_value==''? null:
            <View style={{marginTop:10}}>
              <Text style={[styles.txtFieldName,{marginBottom:10}]}>{value.field_name}</Text>
              <HTML style={styles.inputFormWrap} html={value.field_value}/>
            </View> :
            value.field_value==''? null:
            <View style={{marginTop:20}}>
              <Text style={[styles.txtFieldName,{marginBottom:10}]}>{value.field_name}</Text>
              <HTML style={styles.inputFormWrap} html={value.field_value}/>
            </View>
        ))
    );
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
              <View style={{flexDirection:'row'}}>
              {
                this.state.userInfo.avatar?<Image style={[styles.imgProfile]} source={{uri:this.state.userInfo.avatar}}/>:
                <Image style={[styles.imgProfile]} source={require('../assets/placeholder.png')}/>              
              }
              <View style={{marginLeft:10,justifyContent:'center',flex:1}}>
                <Text style={styles.txtName}>{this.state.userInfo.first_name + ' ' + this.state.userInfo.last_name}</Text>
                <Text style={styles.txtRole}>{this.state.userInfo.position_name}</Text>
              </View>
            </View>
            </View>
            <View style={[styles.vwFrame,{marginTop:10,marginLeft:20,marginRight:20}]}>
              {this.renderProfileFields()}              
            </View>
            <View style={[styles.vwFrame,{marginTop:10,marginLeft:20,marginRight:20}]}>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={{marginTop:10,flex:1}} onPress={()=> this.props.navigation.goBack()}>
                  <View style={[styles.btnPrimary,{alignItems:'center'}]}>
                    <Text style={{color:'#5DA1DA'}}>Back</Text>
                  </View>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{marginTop:10,flex:1,marginLeft:5}} onPress={()=> this.goProfie()}>
                  <View style={[styles.btnPrimary,{alignItems:'center'}]}>
                    <Text style={{color:'#5DA1DA'}}>Update</Text>
                  </View>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </ScrollView>        
      </View>
    );
  }
}