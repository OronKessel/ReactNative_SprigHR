import React, {Component} from 'react';
import {Platform,ActivityIndicator,FlatList,findNodeHandle,StyleSheet, StatusBar,Text, View,Image,TouchableOpacity} from 'react-native';
import {serviceGetEmpProfile,serviceTeamGroups,serviceGetFeedbacks,serviceGetEmployeeInfo,serviceOrganizationInfo} from '../service/api';
import {activateLoader,stopLoader} from '../common/utils';
import Styles from '../common/style';
import { scale, verticalScale } from '../common/scale';
import Modal from "react-native-modal";
import {Globals} from '../doc/global';
import {Config} from '../doc/config';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import DefaultPreference from 'react-native-default-preference';

const { styles } = Styles;
var self= null;
export default class HomeScreen extends Component {
  constructor(props) {
    var timer;
    super(props);
    self = this; 
    this.state = {
        isError:false,
        errorMsg:'',
        loading:false,
        userInfo:{},
        feedbacks:[],
        leaderName:'',
        teams:[]
    }   
  }
  componentDidMount() {
      this.getProfile();
      this.getFeedbacks();
      this.getOrgInfo();
      this.getTeams();
      
  }
  getOrgInfo()
  {
    console.warn('call org info');
    serviceOrganizationInfo()
    .then(res=>{
      console.warn(res); 
      Globals.mOrgInfo = res.organization;
      self.setState({leaderName:res.organization.leader_name})
    })
    .catch(err=>{
    });
  }
  revokeSso = async() => {
    console.warn(Config.SSOToken);
    if (Config.SSOToken != '')
    {
      const result = await revoke(config, {
        tokenToRevoke: Config.SSOToken
      });
      console.warn(result);
      self.props.navigation.navigate('LoginScreen');
    }
    else
    {
      self.props.navigation.navigate('LoginScreen');
    }
  }
  getFeedbacks()
  {
    serviceGetFeedbacks()
    .then(res=>{ 
      console.warn(res);
      this.setState({feedbacks:res.feedbacks});
      timer = setInterval(this.getFeedbackSender, 1000);
    })
    .catch(err=>{
    });
  }
  getProfile()
  {
    activateLoader(this,"Getting Employee Info...");    
    serviceGetEmployeeInfo()
    .then(res=>{ 
      stopLoader(this);
      console.warn(res);
      this.setState({userInfo:res.employee});
    })
    .catch(err=>{
      stopLoader(this);
      this.setState({isError:true,errorMsg:'Your session has expired. Please log in again'});
    });
  }
  getFeedbackSender()
  {
    clearInterval(timer);
    for (i = 0;i <  self.state.feedbacks.length;i++)
    {
      self.getProfileFeedback(i);

    }
  }
  getProfileFeedback(index)
  {
    var id = self.state.feedbacks[index].submitter_id;
    serviceGetEmpProfile(id)
    .then(res=>{ 
      console.warn(res);
      //this.setState({empInfo:res.employee});
      var feedbacks = self.state.feedbacks;
      feedbacks[index].sender = res.employee.first_name + ' ' + res.employee.last_name;
      self.setState({feedbacks:feedbacks});
    })
    .catch(err=>{
      console.warn(err);
      //stopLoader(this);
    });
  }

  goProfie()
  {
    self.props.navigation.navigate('ProfileScreen',{userInfo:this.state.userInfo});
  }
  goFeedback()
  {
    self.props.navigation.navigate('FeedbackScreen');
  }
  goWriteFeedback()
  {
    self.props.navigation.navigate('ContactScreen');
  }
  goNotes()
  {
    self.props.navigation.navigate('NoteScreen');
  }
  goLeader()
  {
    self.props.navigation.navigate('LeadScreen',{userInfo:this.state.userInfo});
  }

  getTeams()
  {
      serviceTeamGroups()
      .then(res=>{
        stopLoader(this);
        this.setState({teams:res.groups});
        console.warn(res); 
      })
      .catch(err=>{
        stopLoader(this);
        console.warn(err); 
      });
  }


  renderFeedbackitem(item)
  {
      var date = new Date(item.created_at);      
      currentDate = ("0" + (date.getMonth() + 1)).slice(-2) + "/" 
            +  ("0" + date.getDate()).slice(-2)  + "/"  + date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
      item.timestamp = currentDate;
      return(
        <View>
          <View style={{flexDirection:'row',marginTop:10,justifyContent:'center',alignItems:'center'}}>
            {
              item.sender?
              <Text style={{flex:1,fontStyle:'italic',fontWeight:'bold',color:'#A5C384',fontSize:16}}>{item.sender}</Text>
              :
              null
            }
            <Text style={{flex:1,textAlign:'right',color:'#A4A4A4',fontSize:12}}>{item.linked_competency} {item.timestamp}</Text>            
          </View>          
          <Text style={{marginTop:10,color:'#000',fontWeight:'bold',fontSize:14}}>{item.subject}</Text>
          <Text style={{marginTop:10,fontSize:15,marginBottom:10}}>{item.message}</Text>
        </View>
      );
  }
  renderSeparator()
  {
    return(
        <View style={{backgroundColor:'#cccccc',height:1}}>
          
        </View>
      );
  }
  logout()
  {
    DefaultPreference.clearMultiple(['userId','authToken']).then(function() 
    {        
      self.props.navigation.navigate('LoginScreen');
    })
    .catch(err=>{            
      self.props.navigation.navigate('LoginScreen');
    });
    
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
        <View style={[styles.vwFrame,{marginTop:20,marginLeft:20,marginRight:20,flexDirection:'row'}]}>
            {
              this.state.userInfo.avatar?<Image style={[styles.imgProfile]} source={{uri:this.state.userInfo.avatar}}/>:
              <Image style={[styles.imgProfile]} source={require('../assets/placeholder.png')}/>              
            }
            <View style={{marginLeft:10,justifyContent:'center'}}>
              <Text style={styles.txtName}>{this.state.userInfo.first_name + ' ' + this.state.userInfo.last_name}</Text>
              <Text style={styles.txtRole}>{this.state.userInfo.position_name}</Text>
            </View>
            <View style={[styles.widthEdit,{flexDirection:'row',position:'absolute',marginTop:10}]}>
                <View style={{flex:1,alignItems:'flex-end'}}>
                  <TouchableOpacity onPress={()=> this.logout()}>
                    <View style={[styles.btnGreen,{alignItems:'center'}]}>
                      <Image style={{width:15,height:15}} source={require('../assets/ic_logout.png')}/>                
                    </View>                  
                  </TouchableOpacity>
                </View>
            </View>
        </View>
        <View style={[styles.vwFrame,{marginTop:10,marginLeft:20,marginRight:20}]}>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity style={{marginTop:10,flex:1,marginRight:5}} onPress={()=> this.goFeedback()}>
                <View style={[styles.btnGreen,{alignItems:'center'}]}>
                  <Image style={[styles.imgIcon]} source={require('../assets/ic_feedback.png')}/>
                  <Text style={{color:'#AFC996',fontSize:12}}>My Feedback</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{marginTop:10,flex:1,marginLeft:5}} onPress={()=> this.goNotes()}>
                <View style={[styles.btnGreen,{alignItems:'center'}]}>
                  <Image style={[styles.imgIcon]} source={require('../assets/ic_note.png')}/>
                  <Text style={{color:'#AFC996',fontSize:12}}>My Notes</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity style={{marginTop:10,flex:1,marginRight:5}} onPress={()=> this.goWriteFeedback()}>
                <View style={[styles.btnGreen,{alignItems:'center',paddingLeft:5,paddingRight:5}]}>
                  <Image style={[styles.imgIcon]} source={require('../assets/ic_feedback_write.png')}/>
                  <Text style={{color:'#AFC996',fontSize:12}}>Give/Request Feedback</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{marginTop:10,flex:1,marginLeft:5}} onPress={()=> this.goProfie()}>
              <View style={[styles.btnGreen,{alignItems:'center'}]}>
                  <Image style={[styles.imgIcon]} source={require('../assets/Profile-icon-9.png')}/>
                  <Text style={{color:'#AFC996',fontSize:12}}>Profile</Text>
                </View>
              </TouchableOpacity>
            </View>
            {
              this.state.teams.length > 0?
              <View style={{flexDirection:'row'}}>
              
              <TouchableOpacity style={{marginTop:10,flex:1,marginRight:5}} onPress={()=> this.goLeader()}>
              <View style={[styles.btnGreen,{alignItems:'center'}]}>
                  <Image style={[styles.imgIcon]} source={require('../assets/ic_leader.png')}/>
                  <Text style={{color:'#AFC996',fontSize:12}}>{this.state.leaderName}</Text>
                </View>
              </TouchableOpacity>
              <View style={{flex:1}}>

              </View>
            </View>
            : null
            }
            

        </View>
        <View style={[styles.vwFrame,{marginTop:10,marginLeft:20,marginRight:20,flex:1,marginBottom:10}]}>
            <Text>Recent Feedback</Text>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              style={{marginTop:10}}
              data={this.state.feedbacks}
              renderItem={({item}) => this.renderFeedbackitem(item)}
              ItemSeparatorComponent={this.renderSeparator}
            />
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
                  onPress={()=>{
                    this.logout();
                    this.setState({
                      isError:false
                  })}}>
                      <Text style={{padding:scale(10),textAlign:'center',color:'#fff',fontWeight:'bold'}}> Try Sign In again </Text>
                  </TouchableOpacity>
              </View>
          </View>
        </Modal>

      </View>
    );
  }
}