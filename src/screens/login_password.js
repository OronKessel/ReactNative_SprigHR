import React, {Component} from 'react';
import {Alert,UIManager,LayoutAnimation,ActivityIndicator,findNodeHandle,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import { scale, verticalScale } from '../common/scale';
import Styles from '../common/style';
import {serviceAuthorization,serviceAuthSSO} from '../service/api';
import {activateLoader,stopLoader} from '../common/utils';
import Modal from "react-native-modal";
import {Config} from '../doc/config';
import {Globals} from '../doc/global';
import DefaultPreference from 'react-native-default-preference';
import CheckBox from 'react-native-check-box'
import { authorize, refresh, revoke } from 'react-native-app-auth';

const { styles } = Styles;



var self= null;
export default class LoginPasswordScreen extends Component {
  constructor(props) {
    super(props);
    self = this;
    this.state = {     
        //email:'superuser1@sprigghr.xyz',
        //password:'monkey77',
        //email:'sprigguser@sprigghr.com',
        //password:'giraffe82',
        loading:false,
        isError:false,
        errorMsg:'',
        isRemember:false,
        email:'',
        pw:''
    }
    
  }
  componentDidMount()
  {      
        DefaultPreference.get('password').then(function(value) 
        {          
            if (value != null)
            {                
                self.setState({password:value});
            }            
        })
        .catch(err=>{            
            
        });
  }
  login()
  {
    if (this.state.password == '')
    {
        this.setState({isError:true,errorMsg:'Please fill password'});
        return;
    }
    activateLoader(this,"Checking User Info...");
    this.callWeb(Globals.mEmail,this.state.password);
  }
  
  callWeb(email,pw)
  {
    console.warn(Config.BASE_URL);
    console.warn(this.state.password);
    serviceAuthorization(Globals.mEmail,this.state.password)
    .then(res=>{ 
      stopLoader(this);
      Globals.mUserId = res.user_id;
      Config.AuthToken = res.auth_token;
      if (Globals.isRemember)
      {
          DefaultPreference.setMultiple({password:this.state.password,userId:res.user_id,authToken:res.auth_token,domain:Config.BASE_URL}).then(function(values) 
          {          
            this.props.navigation.navigate('HomeScreen');            
          })
          .catch(err=>{
            this.props.navigation.navigate('HomeScreen');   
          });
      }
      else
      {
        DefaultPreference.setMultiple({userId:res.user_id,authToken:res.auth_token,domain:Config.BASE_URL}).then(function(values) 
        {          
          this.props.navigation.navigate('HomeScreen');            
        })
        .catch(err=>{
          this.props.navigation.navigate('HomeScreen');   
        });
      }
    })
    .catch(err=>{
      stopLoader(this);
      this.setState({isError:true,errorMsg:'Login Fail'});        
  });
  }
  render() {
    return (
      <View style={[styles.bg,styles.flexFull,{justifyContent:'center'}]}>
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
        

        <View style={{textAlign:'center',alignItems:'center'}}>          
          <View style={styles.vwLogin}>
            <View style={{alignItems:'center',marginTop:15,marginBottom:15}}>
              <Image style={[styles.splashLogosize]} source={require('../assets/logo_black.png')}/>
            </View>
            <Text style={{marginTop:10,color:'#969693'}}>Email</Text>
            <Text style={{marginTop:10}}>{Globals.mEmail}</Text>
            <Text style={{marginTop:10,color:'#969693'}}>Password</Text>
            <TextInput secureTextEntry={true}  value={this.state.password} style={styles.inputForm} onChangeText={(text) => this.setState({password:text})}/>
            
            {/* <View style={{flexDirection:'row',marginTop:10,alignItems:'center'}}>
              <CheckBox style={{flex:2}} 
                  textStyle={{color:'#888'}}
                  onClick={()=>{
                      this.setState({
                          isRemember:!this.state.isRemember
                      })
                  }}
                  rightText={"Remember Me"}
                  isChecked={this.state.isRemember}/>              
            </View> */}
            <View style={{alignItems:'flex-end',flexDirection:'row'}}>
              <TouchableOpacity style={{marginTop:10}} onPress={()=> this.props.navigation.goBack()}>
                <Text style={styles.loginButton}>Back</Text>
              </TouchableOpacity>
              <View style={{flex:1}}></View>
              <TouchableOpacity style={{marginTop:10}} onPress={()=> this.login()}>
                <Text style={styles.loginButton}>Submit</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
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
      </View>
    );
  }
}