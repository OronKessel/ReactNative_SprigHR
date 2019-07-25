import React, {Component} from 'react';
import {Platform, ActivityIndicator,ScrollView,findNodeHandle,TouchableOpacity,StyleSheet, TextInput,StatusBar, Text,View,Image} from 'react-native';
import {serviceGetEmpProfile} from '../service/api';
import Styles from '../common/style';
import {activateLoader,stopLoader} from '../common/utils';
import HTML from 'react-native-render-html';

const { styles } = Styles;

var self= null;
export default class EmployeeProfileScreen extends Component {
  constructor(props) {
    super(props);
    self = this; 
    const {state} = props.navigation;    
    this.state = {
        loading:false,
        userInfo:{},
        empInfo:state.params.empInfo,
        fields:[]
        
    }      
  }
  componentDidMount() {    
    this.getProfile();
  }
  getProfile()
  {
    activateLoader(this,"Getting Employee Info...");    
    serviceGetEmpProfile(this.state.empInfo.id)
    .then(res=>{ 
      stopLoader(this);
      console.warn(res);
      this.setState({empInfo:res.employee});
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
                this.state.empInfo.avatar?<Image style={[styles.imgProfile]} source={{uri:this.state.empInfo.avatar}}/>:
                <Image style={[styles.imgProfile]} source={require('../assets/placeholder.png')}/>              
              }
              
                <View style={{marginLeft:10,justifyContent:'center',flex:1}}>
                  <Text style={styles.txtName}>{this.state.empInfo.first_name + ' ' + this.state.empInfo.last_name}</Text>
                  <Text style={styles.txtRole}>{this.state.empInfo.position}</Text>
                </View>
              </View>
              {/* <View style={{marginTop:10}}>
                <Text style={styles.txtFieldName}>Member of:</Text>
                <View style={{alignSelf:'baseline',flex:1,flexWrap:'wrap',flexDirection:'row'}}>
                  <View style={[styles.vwTeam]}>
                    <Text style={{color:'#000'}}>Information Technology</Text>
                  </View>
                  <View style={[styles.vwTeam]}>
                    <Text style={{color:'#000'}}>Ruby on Rails</Text>
                  </View>
                </View>
              </View> */}
              {/* <View style={[styles.widthEdit,{flexDirection:'row',position:'absolute',marginTop:10}]}>
                <View style={{flex:1,alignItems:'flex-end'}}>
                  <View style={[styles.btnGreen,{alignItems:'center'}]}>
                    <Image style={{width:15,height:15}} source={require('../assets/ic_pencil.png')}/>                
                  </View>                  
                </View>
              </View> */}
            </View>
            {/* <View style={[styles.vwFrame,{marginTop:10,marginLeft:20,marginRight:20}]}>
              {this.renderProfileFields()}              
            </View> */}
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