import React, {Component} from 'react';
import {Platform,ActivityIndicator,FlatList,findNodeHandle,StyleSheet, StatusBar,Text, View,Image,TouchableOpacity} from 'react-native';
import {serviceTeamGroups} from '../service/api';
import {activateLoader,stopLoader} from '../common/utils';
import Styles from '../common/style';
import Modal from "react-native-modal";
import {Globals} from '../doc/global';
import {Config} from '../doc/config';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import DefaultPreference from 'react-native-default-preference';

const { styles } = Styles;
var self= null;
export default class LeadScreen extends Component {
  constructor(props) {
    var timer;
    super(props);
    self = this; 
    const {state} = props.navigation;    
    this.state = {
        loading:false,
        userInfo:state.params.userInfo,
        groups:[]
    }   
  }
  componentDidMount() {
      this.getTeams();
  }
  
  getTeams()
  {
      activateLoader(this,"Loading Groups...");    
      serviceTeamGroups()
      .then(res=>{
        stopLoader(this);
        this.setState({groups:res.groups});
        console.warn(res); 
      })
      .catch(err=>{
        stopLoader(this);
        console.warn(err); 
      });
  }
  goGroupDetail(item)
  {
    self.props.navigation.navigate('TeamScreen',{groupInfo:item,userInfo:this.state.userInfo});
  }
  renderGroupItem(item)
  {
      return(
        <View>
          <View style={styles.vwCellContact}>
            <Image style={[styles.imgIcon,{width:30,height:30}]} source={require('../assets/ic_group.png')}/>            
            <Text style={{flex:1,color:'#000',marginLeft:10,fontSize:14}}>{item.group_name}</Text>            
            <View style={{alignItems:'flex-end',flexDirection:'row'}}>
              <TouchableOpacity style={{padding:5}} onPress={()=> this.goGroupDetail(item)}>
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
            <Text>{Globals.mOrgInfo.group_name}s</Text>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              style={{marginTop:10}}
              data={this.state.groups}
              renderItem={({item}) => this.renderGroupItem(item)}
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