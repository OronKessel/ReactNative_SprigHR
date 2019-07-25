import React, {Component} from 'react';
import {Platform, ActivityIndicator,FlatList,findNodeHandle,StyleSheet, StatusBar,Text, View,Image,TouchableOpacity} from 'react-native';
import {serviceGetEmpProfile,serviceGetFeedbacks} from '../service/api';
import {activateLoader,stopLoader} from '../common/utils';
import Styles from '../common/style';


const { styles } = Styles;

var self= null;
export default class FeedbackScreen extends Component {
  constructor(props) {
    var timer;
    super(props);
    self = this;    
    this.state = {
        loading:false,
        feedbacks:[],
        refreshing:false,
    }  
  }
  componentDidMount() {    
    activateLoader(this,"Getting My Feedback...");
    this.getFeedbacks();
  }
  handleRefresh()
  {
    self.setState({refreshing:true});
    self.getFeedbacks();
  }
  getFeedbacks()
  {    
    serviceGetFeedbacks()
    .then(res=>{ 
      stopLoader(this);
      console.warn(res.feedbacks);
      this.setState({feedbacks:res.feedbacks,refreshing:false});
      timer = setInterval(this.getFeedbackSender, 1000);
    })
    .catch(err=>{
      stopLoader(this);
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
        <View style={[styles.vwFrame,{marginTop:40,marginLeft:20,marginRight:20,flex:1}]}>
            <Text style={{fontSize:18,color:'#8FB0D9'}}>Feedback Inbox</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{marginTop:10}}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.feedbacks}
              renderItem={({item}) => this.renderFeedbackitem(item)}
              ItemSeparatorComponent={this.renderSeparator}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
        </View>
        <View style={[styles.vwFrame,{marginBottom:10,marginLeft:20,marginRight:20}]}>
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