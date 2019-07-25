import React, {Component} from 'react';
import {Platform, ActivityIndicator,ScrollView,findNodeHandle,TouchableOpacity,StyleSheet, TextInput,StatusBar, Text,View,Image} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import CheckBox from 'react-native-check-box'
import Styles from '../common/style';
import {serviceSubmitFeedback,serviceRequestFeedback,serviceCompetencies} from '../service/api';
import {activateLoader,stopLoader} from '../common/utils';
import { scale, verticalScale } from '../common/scale';
import Modal from "react-native-modal";
import {Globals} from '../doc/global';
import { Dropdown } from 'react-native-material-dropdown';

const { styles } = Styles;

var self= null;
export default class WriteFeedbackScreen extends Component {
  constructor(props) {
    super(props);
    var radioForm;
    self = this;
    const {state} = props.navigation;
    
    this.state = {
      loading:false,
      isError:false,
      empInfo:state.params.empInfo,
      value:'emp_and_mgr',
      isShare:false,
      isAnony:false,
      subject:'',
      feedback:'',
      requestSub:'',
      isSuccess:false,
      isSuccessRequest:false,
      isSubjectRequest:false,
      radioData:[],
      competencies:[],
      comp_name:''

    }
  }
  componentDidMount() {    
    this.setRadioData();
    if (Globals.mOrgInfo.link_competency_to_feedback)
    {
        this.getCompetencies();
    }
  }

  getCompetencies()
  {
      serviceCompetencies(this.state.empInfo.id)
      .then(res=>{
        var coms = [];
        for (i = 0;i < res.competencies.length;i++)
        {
          coms.push({value:res.competencies[i].comp_name});
        }
        console.warn(coms);
        this.setState({competencies:coms});
        console.warn(res); 
      })
      .catch(err=>{
        console.warn(err); 
      });
  }
  setRadioData()
  {
    var radio_props = [];
    var index = 0;
    var vv = '';
    if (Globals.mOrgInfo.feedback_public)
    {
      var item = {};
      item.label = 'Visible To Everyone';
      item.value = 'public';
      vv = 'public';
      radio_props.push(item);
      index++;
    }
    if (Globals.mOrgInfo.feedback_semi_private)
    {
      var item = {};
      item.label = 'Visible to ' + this.state.empInfo.first_name + ' ' + this.state.empInfo.last_name + ' and ' + Globals.mOrgInfo.leader_name;
      item.value = 'emp_and_mgr';
      vv = 'emp_and_mgr';
      radio_props.push(item);
      index++;
    }
    if (Globals.mOrgInfo.feedback_private)
    {
      var item = {};
      item.label = 'Visible to ' + Globals.mOrgInfo.leader_name + ' only';
      item.value = 'just_mgr';
      radio_props.push(item);
    }
    
    this.setState({radioData:radio_props});
    this.radioForm.updateIsActiveIndex(index-1);
    this.setState({value:vv});
  }
  submitFeedback()
  {
    if (this.state.subject == '')
    {
        this.setState({isError:true,errorMsg:'Please fill subject'});
        return;
    }
    if (this.state.feedback == '')
    {
        this.setState({isError:true,errorMsg:'Please write feedback'});
        return;
    }    
    activateLoader(this,"Submitting Feedback...");    
    serviceSubmitFeedback(this.state.empInfo.id,this.state.subject,this.state.feedback,this.state.value,this.state.isShare,this.state.isAnony,this.state.comp_name)
    .then(res=>{ 
      stopLoader(this);
      this.setState({isSuccess:true});
    })
    .catch(err=>{
      stopLoader(this);
    });
  }
  clickGoContacts()
  {
    this.props.navigation.goBack();
  }
  requestFeedback()
  {
    // if (this.state.subject == '')
    // {
    //     this.setState({isError:true,errorMsg:'Please fill subject'});
    //     return;
    // }
    this.setState({isSubjectRequest:true});
    
  }
  clickBackRequest()
  {
    this.setState({isSubjectRequest:false});
  }
  clickSubmitRequest()
  {
    this.setState({isSubjectRequest:false});
    activateLoader(this,"Requesting Feedback...");    
    serviceRequestFeedback(this.state.empInfo.id,this.state.requestSub)
    .then(res=>{ 
      stopLoader(this);
      console.warn(res);
      this.setState({isSuccessRequest:true,requestSub:''});
    })
    .catch(err=>{
      stopLoader(this);
    });
  }
  onSelectCompetency(value,index,data)
  {
    console.warn(this.state.competencies[index]);
    this.setState({comp_name:this.state.competencies[index].value})
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
            <View style={[styles.vwFrame,{marginTop:40,marginLeft:20,marginRight:20}]}>              
              <TouchableOpacity onPress={()=> this.requestFeedback()}>
                  <View style={{flexDirection:'row',marginLeft:5,alignItems:'center'}}>
                      <Image style={{width:23,height:15}} source={require('../assets/ic_request_blue.png')}/>
                      <Text style={{marginLeft:10,color:'#5DA1DA'}}>Request feedback from {this.state.empInfo.first_name + ' ' + this.state.empInfo.last_name}</Text>
                  </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.vwFrame,{marginTop:10,marginLeft:20,marginRight:20}]}>              
              <Text style={{marginTop:10,color:'#5DA1DA'}}>Leave {this.state.empInfo.first_name + ' ' + this.state.empInfo.last_name} some feedback</Text>
              <Text style={{marginTop:10,color:'#5DA1DA'}}>Subject</Text>
              <TextInput style={[styles.inputForm]} onChangeText={(text) => this.setState({subject:text})}/>
              <Text style={{marginTop:10,color:'#5DA1DA'}}>Feedback</Text>
              <TextInput style={[styles.inputForm,{height:100}]} multiline = {true} onChangeText={(text) => this.setState({feedback:text})}/>
              {
                Globals.mOrgInfo.link_competency_to_feedback?
                <Dropdown
                  label={Globals.mOrgInfo.competency_name}
                  data={this.state.competencies}
                  textColor="#000"
                  onChangeText={(value,index,data) => this.onSelectCompetency(value,index,data)}
                />:null
              }
              <RadioForm
                ref={ref => this.radioForm = ref}
                style={{marginTop:10,marginLeft:2}}
                radio_props={this.state.radioData}
                buttonSize={10}
                buttonColor={'#CAD6DC'}
                selectedButtonColor={'#5E9FE3'}
                onPress={(value) => {this.setState({value:value})}}
              />
              {
                Globals.mOrgInfo.share_feedback_with_hr?
                <CheckBox
                  textStyle={{color:'#888'}}
                  checkBoxColor={'#CAD6DC'}
                  checkedCheckBoxColor={'#5E9FE3'}
                  uncheckedCheckBoxColor={'#CAD6DC'}
                  onClick={()=>{
                    this.setState({
                        isShare:!this.state.isShare
                    })
                  }}
                  isChecked={this.state.isShare}
                  rightText={"Share feedback with HR"}
                />
                :null
              }
              {
                Globals.mOrgInfo.allow_anonymous_feedback?
                  <CheckBox
                    textStyle={{color:'#888'}}
                    checkBoxColor={'#CAD6DC'}
                    checkedCheckBoxColor={'#5E9FE3'}
                    uncheckedCheckBoxColor={'#CAD6DC'}
                    onClick={()=>{
                      this.setState({
                          isAnony:!this.state.isAnony
                      })
                    }}
                    isChecked={this.state.isAnony}
                    rightText={"Make me anonymous"}
                />    
                :null
              }
                        
            </View>            
            <View style={[styles.vwFrame,{marginTop:10,marginLeft:20,marginRight:20}]}>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={{marginTop:10,flex:1,marginRight:5}} onPress={()=> this.props.navigation.goBack()}>
                  <View style={[styles.btnPrimary,{alignItems:'center'}]}>
                    <Text style={{color:'#5DA1DA'}}>Back</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop:10,flex:1,marginLeft:5}} onPress={()=> this.submitFeedback()}>
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
                      Feedback submitted successfully
                  </Text>
                  <TouchableOpacity 
                  style={{alignSelf:'center'}}
                  onPress={()=>this.clickGoContacts()}>
                      <Text style={{padding:scale(10),textAlign:'center',color:'#fff',fontWeight:'bold'}}> Go Back </Text>
                  </TouchableOpacity>
              </View>
          </View>
        </Modal>

        <Modal 
          backdropColor="#000"
          isVisible={this.state.isSuccessRequest}>
          <View style={{backgroundColor:"#54C540",padding:scale(10),borderRadius:scale(10),alignItems:'center',}}>
              <View style={{marginVertical:verticalScale(0)}}>
                  
                  <Text style={{color:'#FFF',fontSize:scale(18),textAlign:"center",marginVertical:verticalScale(20)}}>
                      Feedback requested successfully
                  </Text>
                  <TouchableOpacity 
                  style={{alignSelf:'center'}}
                  onPress={()=>this.clickGoContacts()}>
                      <Text style={{padding:scale(10),textAlign:'center',color:'#fff',fontWeight:'bold'}}> Go Back </Text>
                  </TouchableOpacity>
              </View>
          </View>
        </Modal>

        <Modal 
          backdropColor="#000"
          isVisible={this.state.isSubjectRequest}>
          <View style={{backgroundColor:"#54C540",padding:scale(10),borderRadius:scale(10),}}>
              <View style={{marginVertical:verticalScale(0)}}>
                  <Text style={{color:'#FFF',fontSize:scale(18),textAlign:"center",marginTop:verticalScale(20)}}>
                  Request Feedback
                  </Text>
                  <Text style={{color:'#FFF',fontSize:scale(14),textAlign:"left",marginVertical:verticalScale(10)}}>
                  Subject
                  </Text>
                  <TextInput style={{backgroundColor:'#fff',padding:5,height:40,borderRadius:10}} onChangeText={(text) => this.setState({requestSub:text})}/>
                  <View style={{flexDirection:'row'}}>
                    <TouchableOpacity 
                    style={{alignSelf:'center',flex:1}}
                    onPress={()=>this.clickBackRequest()}>
                        <Text style={{padding:scale(10),textAlign:'center',color:'#fff',fontWeight:'bold'}}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={{alignSelf:'center',flex:1}}
                    onPress={()=>this.clickSubmitRequest()}>
                        <Text style={{padding:scale(10),textAlign:'center',color:'#fff',fontWeight:'bold'}}> Submit </Text>
                    </TouchableOpacity>
                  </View>
                  
              </View>
          </View>
        </Modal>



      </View>
    );
  }
}