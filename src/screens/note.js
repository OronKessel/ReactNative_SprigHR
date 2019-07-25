import React, {Component} from 'react';
import {Platform, ActivityIndicator,ScrollView,FlatList,findNodeHandle,TouchableOpacity,StyleSheet, TextInput,StatusBar, Text,View,Image} from 'react-native';
import {serviceGetNotes,serviceDeleteNote} from '../service/api';
import {activateLoader,stopLoader} from '../common/utils';
import Styles from '../common/style';
import HTML from 'react-native-render-html';
import { scale, verticalScale } from '../common/scale';
import Modal from "react-native-modal";


const { styles } = Styles;

var self= null;
export default class NoteScreen extends Component {
  constructor(props) {
    super(props);
    self = this;    
    this.state = {
        loading:false,
        refreshing:false,
        isConfirmDelete:false,
        notes:[],
        currentItem:{}
    }
  }
  componentDidMount() {
    activateLoader(this,"Getting Notes...");        
    this.getNotes();
  }
  handleRefresh()
  {
    self.setState({refreshing:true});
    self.getNotes();
  }
  getNotes()
  {    
    serviceGetNotes()
    .then(res=>{ 
      stopLoader(this);
      this.setState({notes:res.notes,refreshing:false});
    })
    .catch(err=>{
      stopLoader(this);
    });
  }
  clickEditNote(item)
  {    
    self.props.navigation.navigate('EditNoteScreen',{noteInfo:item,onGoBack: () => this.onRefreshNote()});
  }
  clickDeleteNote(item)
  {
      this.setState({isConfirmDelete:true,currentItem:item});
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
            <Text style={{flex:1,color:'#8FB0D9',fontSize:16}}>{item.note_name}</Text>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity style={{marginTop:10,marginRight:5}} onPress={()=> this.clickDeleteNote(item)}>
                <View style={[styles.btnPrimary,{padding:5,justifyContent:'center',flexDirection:'row'}]}>
                  <Image style={[styles.imgSmallIcon]} source={require('../assets/ic_trash.png')}/>
                  <Text style={{marginLeft:5,color:'#548CB8'}}>Delete</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{marginTop:10,marginRight:5}} onPress={()=> this.clickEditNote(item)}>
                <View style={[styles.btnPrimary,{padding:5,justifyContent:'center',flexDirection:'row'}]}>
                  <Image style={[styles.imgSmallIcon]} source={require('../assets/ic_edit.png')}/>
                  <Text style={{marginLeft:5,color:'#548CB8'}}>Edit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>          
          <HTML style={{marginTop:10,fontSize:15,marginBottom:10}} html={item.note_description}/>
          <View style={{flexDirection:'row',marginTop:10,marginBottom:10}}>
            <View style={[{padding:5,justifyContent:'center',flexDirection:'row'}]}>
              <Image style={[styles.imgSmallIcon]} resizeMode='stretch' source={require('../assets/ic_calendar.png')}/>
              <Text style={{marginLeft:5,color:'#888888'}}>{item.timestamp}</Text>
            </View>
            {/* <View style={[{padding:5,justifyContent:'center',flexDirection:'row'}]}>
              <Image style={[styles.imgSmallIcon]} resizeMode='stretch' source={require('../assets/ic_attach.png')}/>
              <Text style={{marginLeft:5,color:'#B2C79B'}}>Attach File</Text>
            </View> */}
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
  onRefreshNote()
  {
    activateLoader(this,"Getting Notes...");
    this.getNotes();
  }
  goAddNote()
  {
    self.props.navigation.navigate('AddNoteScreen',{onGoBack: () => this.onRefreshNote()});
  }  
  clickDeleteYes()
  {
    this.setState({isConfirmDelete:false});
    activateLoader(this,"Deleting Note...");
    serviceDeleteNote(this.state.currentItem.id)
    .then(res=>{ 
      stopLoader(this);
      this.onRefreshNote();
    })
    .catch(err=>{
      stopLoader(this);
    });
  }
  clickDeleteNo()
  {
    this.setState({isConfirmDelete:false});
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
            <Text style={{fontSize:18,color:'#8FB0D9'}}>My Notes</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              style={{marginTop:10}}
              data={this.state.notes}
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
                <TouchableOpacity style={{marginTop:10,flex:1,marginLeft:5}} onPress={()=> this.goAddNote()}>
                  <View style={[styles.btnPrimary,{alignItems:'center'}]}>
                    <Text style={{color:'#5DA1DA'}}>Add</Text>
                  </View>
                </TouchableOpacity>
              </View>
        </View>
        <Modal 
          backdropColor="#000"
          isVisible={this.state.isConfirmDelete}>
          <View style={{backgroundColor:"#54c540",padding:scale(10),borderRadius:scale(10),alignItems:'center',}}>
              <View style={{marginVertical:verticalScale(0)}}>
                  
                  <Text style={{color:'#FFF',fontSize:scale(18),textAlign:"center",marginVertical:verticalScale(20)}}>
                      Are you sure delete this note?
                  </Text>
                  <View style={{flexDirection:'row'}}>
                      <TouchableOpacity 
                      style={{alignSelf:'center',flex:1}}
                      onPress={()=>this.clickDeleteYes()}>
                          <Text style={{padding:scale(10),textAlign:'center',color:'#fff',fontWeight:'bold'}}> Yes </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                      style={{alignSelf:'center',flex:1}}
                      onPress={()=>this.clickDeleteNo()}>
                          <Text style={{padding:scale(10),textAlign:'center',color:'#fff',fontWeight:'bold'}}> No </Text>
                      </TouchableOpacity>
                  </View>                 
              </View>
          </View>
        </Modal>              
      </View>
    );
  }
}