import React, {Component} from 'react';
import {Platform,ActivityIndicator,FlatList,findNodeHandle,StyleSheet, StatusBar,Text, View,Image,TouchableOpacity} from 'react-native';
import {serviceTeamEmployees} from '../service/api';
import {activateLoader,stopLoader} from '../common/utils';
import Styles from '../common/style';
import Modal from "react-native-modal";
import {Globals} from '../doc/global';
import {Config} from '../doc/config';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import DefaultPreference from 'react-native-default-preference';

const { styles } = Styles;
var self= null;
export default class TeamScreen extends Component {
  constructor(props) {
    var timer;
    super(props);
    self = this; 
    const {state} = props.navigation;    
    this.state = {
        loading:false,
        userInfo:state.params.userInfo,
        groupInfo:state.params.groupInfo,
        employees:[]
    }   
  }
  componentDidMount() {
      this.getEmployees();
  }
  
  getEmployees()
  {
    activateLoader(this,"Loading Employees...");    
    serviceTeamEmployees(this.state.groupInfo.id)
    .then(res=>{
      stopLoader(this);
      var emps = [];
      console.warn(this.state.userInfo)
      for (j = 0;j < res.employee.length;j++)
      {
          if (res.employee[j].id != this.state.userInfo.id)
            emps.push(res.employee[j]);
      }
      this.setState({employees:emps});
      console.warn(res); 
    })
    .catch(err=>{
      stopLoader(this);
      console.warn(err); 
    });
  }
  goProfile(item)
  {
    self.props.navigation.navigate('TeamFeedbackScreen',{teamInfo:this.state.groupInfo,empInfo:item});
  }
  renderEmployeeItem(item)
  {
      return(
        <View>
          <View style={styles.vwCellContact}>
            {
              item.avatar?<Image style={[styles.imgIcon,{width:30,height:30,borderRadius:15}]} source={{uri:item.avatar}}/>:
              <Image style={[styles.imgIcon,{width:30,height:30,borderRadius:15}]} source={require('../assets/placeholder.png')}/>
            }            
            <Text style={{flex:1,color:'#000',marginLeft:10,fontSize:14}}>{item.first_name + " " + item.last_name + " (" + item.position + ")"}</Text>            
            <View style={{alignItems:'flex-end',flexDirection:'row'}}>
              <TouchableOpacity style={{padding:5}} onPress={()=> this.goProfile(item)}>
                <Image style={{width:23,height:15}} source={require('../assets/ic_view.png')}/>
              </TouchableOpacity>
            </View>
          </View>
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
        <View style={[styles.vwFrame,{marginTop:10,marginLeft:20,marginRight:20,flex:1,marginBottom:10}]}>
            <Text>{Globals.mOrgInfo.group_name + ' ' + Globals.mOrgInfo.employee_name}s</Text>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              style={{marginTop:10}}
              data={this.state.employees}
              renderItem={({item}) => this.renderEmployeeItem(item)}
              ItemSeparatorComponent={this.renderSeparator}
            />
        </View>

        <View style={[styles.vwFrame,{marginTop:10,marginLeft:20,marginRight:20}]}>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={{marginTop:10,flex:1,marginRight:5}} onPress={()=> this.props.navigation.goBack()}>
                  <View style={[styles.btnPrimary,{alignItems:'center'}]}>
                    <Text style={{color:'#5DA1DA'}}>Back</Text>
                  </View>
                </TouchableOpacity>
              </View>
        </View>
      </View>
    );
  }
}