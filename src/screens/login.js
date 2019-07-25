import React, {Component} from 'react';
import {Alert,UIManager,LayoutAnimation,ActivityIndicator,findNodeHandle,TouchableOpacity,StyleSheet, StatusBar, View,Image,Text,TextInput} from 'react-native';
import { scale, verticalScale } from '../common/scale';
import Styles from '../common/style';
import {serviceAuthorization,serviceAuthSSO,serviceGetDomains} from '../service/api';
import {activateLoader,stopLoader} from '../common/utils';
import Modal from "react-native-modal";
import {Config} from '../doc/config';
import {Globals} from '../doc/global';
import DefaultPreference from 'react-native-default-preference';
import CheckBox from 'react-native-check-box'
import { authorize, refresh, revoke } from 'react-native-app-auth';



UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const { styles } = Styles;
var clientId = '';
var redirectUrl = '';



var self= null;
export default class LoginScreen extends Component {
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
        DefaultPreference.getMultiple(['user','password']).then(function(values) 
        {          
            if (values[0] != null)
            {                
                self.setState({email:values[0],password:values[1],isRemember:true});
            }            
        })
        .catch(err=>{            
            
        });
  }
  
  
  authorize = async (data) => {
    console.warn('Sso_URI:' + data.sso_uri);
    const config = {
      issuer: 'https://brunswickgroup.okta.com',
      clientId: data.client_id,
      redirectUrl: data.sso_uri,
      additionalParameters: {},
      scopes: ['openid', 'profile', 'email', 'offline_access']
    };

    console.warn('client_id' + data.client_id);
    console.warn('sso_redirect' + data.sso_uri);

    activateLoader(this,"Starting SSO...");
    if (Config.SSOToken != '')
    {
      const result = await revoke(config, {
        tokenToRevoke: Config.SSOToken
      });
      console.warn(result);
    }
    try {
      const authState = await authorize(config);
      Config.SSOToken = authState.accessToken;
      console.warn('Token:' + Config.SSOToken);
      this.callSso(authState.accessToken,0);
    } catch (error) {
      Alert.alert('Failed to log in', error.message);
      stopLoader(this);
    }
  };

  goSso()
  {
    this.authorize();
  }
  next()
  {
    if (this.state.email == '')
    {
        this.setState({isError:true,errorMsg:'Please fill email address'});
        return;
    }
    activateLoader(this,"Checking User Info...");
    serviceGetDomains(this.state.email)
    .then(res=>{ 
      stopLoader(this);
      console.warn(res);
      Config.BASE_URL = res.api;
      console.warn(res.SSO);
      if (res.SSO == 'none')
      {
        console.warn('here');
        Globals.mEmail = this.state.email;
        Globals.isRemember = this.state.isRemember;
        if (this.state.isRemember)
        {
          DefaultPreference.set('user',this.state.email).then(function(values) 
          {          
            this.props.navigation.navigate('LoginPasswordScreen');
          })
          .catch(err=>{
            this.props.navigation.navigate('LoginPasswordScreen');   
          });
        }
        else
        {
          DefaultPreference.clearMultiple(['user','password']).then(function() 
          {        
            this.props.navigation.navigate('LoginPasswordScreen');   
          })
          .catch(err=>{            
            this.props.navigation.navigate('LoginPasswordScreen');   
          });
        }
      }
      else
      {
        clientId = res.client_id;
        redirectUrl = res.sso_uri;
        this.authorize(res);
      }
    })
    .catch(err=>{
        stopLoader(this);
        this.props.navigation.navigate('LoginPasswordScreen');   
    });
  }
  
  callSso(accessToken,i)
  {
      console.warn(accessToken);
      console.log(accessToken);
      serviceAuthSSO(accessToken)
      //serviceAuthSSO("123")
      .then(res=>{ 
        stopLoader(this);
        console.warn('Fail');
        Globals.mUserId = res.user_id;
        Config.AuthToken = res.auth_token;

        DefaultPreference.setMultiple({userId:res.user_id,authToken:res.auth_token,domain:Config.BASE_URL}).then(function(values) 
        {          
          this.props.navigation.navigate('HomeScreen');
              
        })
        .catch(err=>{
          this.props.navigation.navigate('HomeScreen');   
        });
      })
      .catch(err=>{
        console.warn(err);
        if (i < Config.URLS.length)
        {
          i++;
          if (i == Config.URLS.length)
          {
            stopLoader(this);
            this.setState({isError:true,errorMsg:err.errors});
            return;
          }
          Config.BASE_URL = Config.URLS[i]['domain'];
          self.callSso(accessToken,i);
          return;
        }
        stopLoader(this);
        this.setState({isError:true,errorMsg:err.errors});        
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
            <TextInput autoCapitalize={'none'} value={this.state.email} style={styles.inputForm} onChangeText={(text) => this.setState({email:text})}/>
            {/* <Text style={{marginTop:10,color:'#969693'}}>Password</Text> */}
            {/* <TextInput secureTextEntry={true}  value={this.state.password} style={styles.inputForm} onChangeText={(text) => this.setState({password:text})}/> */}
            {/* <TouchableOpacity >
              <Text style={{color:'#3A75AC',marginTop:10}}>Forgotten your password?</Text>
            </TouchableOpacity> */}
            <View style={{flexDirection:'row',marginTop:10,alignItems:'center'}}>
              <CheckBox style={{flex:2}} 
                  textStyle={{color:'#888'}}
                  onClick={()=>{
                      this.setState({
                          isRemember:!this.state.isRemember
                      })
                  }}
                  rightText={"Remember Me"}
                  isChecked={this.state.isRemember}/>              
            </View>
            <View style={{alignItems:'flex-end',flexDirection:'row'}}>
              {/* <TouchableOpacity style={{marginTop:10}} onPress={()=> this.goSso()}>
                <Text style={styles.loginButton}>SSO</Text>
              </TouchableOpacity>
              <View style={{flex:1}}></View> */}
              <TouchableOpacity style={{marginTop:10,flex:1}} onPress={()=> this.next()}>
                  <View style={[styles.btnPrimary,{alignItems:'center'}]}>
                    <Text style={{color:'#5DA1DA'}}>Next</Text>
                  </View>
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