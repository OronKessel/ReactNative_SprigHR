import React, {Component} from 'react';
import {Platform, ActivityIndicator,FlatList,TextInput,SectionList,findNodeHandle,StyleSheet, StatusBar,Text, View,Image,TouchableOpacity} from 'react-native';
import {serviceCompanyDirectory} from '../service/api';
import {activateLoader,stopLoader} from '../common/utils';

import Styles from '../common/style';


const { styles } = Styles;

var self= null;
export default class ContactScreen extends Component {
  constructor(props) {
    var timer;
    var inputSearch;

    super(props);
    self = this;    
    this.state = {
        loading:false,
        refreshing:false,                
        employees:[],
        filterEmployees:[],
        prefixes : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    }
  }
  componentDidMount() { 
      activateLoader(this,"Loading Employees...");           
      this.getCompanyDirectory();
  }

  sortByName(res) {
      var result = [];
      var datas = [];
      for (i = 0;i < this.state.prefixes.length;i++)
      {
        datas = [];
        for (j = 0;j < res.length;j++)
        {
          if (res[j].first_name.startsWith(this.state.prefixes[i]))
          {
            datas.push(res[j]);
          }
        }
        if (datas.length > 0)
        {
          var item = {};
          item.title = this.state.prefixes[i];
          for (k = 0;k < datas.length - 1;k++)
          {
            for (t = k + 1;t < datas.length;t++)
            {
              name = datas[k].first_name + datas[k].last_name;
              name1 = datas[t].first_name + datas[t].last_name;              
              if (name > name1)
              {
                var temp = datas[k];
                datas[k] = datas[t];
                datas[t] = temp;
              }
            }          
          }
          item.data = datas;
          result.push(item);
        }
      }
      return result;
  } 
  getCompanyDirectory()
  {
    serviceCompanyDirectory()
    .then(res=>{
      console.warn(res); 
      stopLoader(this);      
      result = this.sortByName(res.employees);            
      this.setState({filterEmployees:result,employees:result,refreshing:false});
    })
    .catch(err=>{
      console.warn(err);
      stopLoader(this);
    });
  }
  filter(text)
  {
      var filters = [];

      if (text == '')
      {          
          filters = this.state.employees;
          this.setState({filterEmployees:filters});
          return;
      }
      else
      {
          var prefix = text[0];          
          for (i = 0;i < this.state.employees.length;i++)
          {            
                         
            var item = {}
            item.title = this.state.employees[i].title;
            var datas = [];
            for (var k = 0;k < this.state.employees[i].data.length;k++)
            {
              var name = this.state.employees[i].data[k].first_name + this.state.employees[i].data[k].last_name;                
              if (name.toLowerCase().includes(text.toLowerCase()))
              {
                datas.push(this.state.employees[i].data[k]);
              }
            }
            if (datas.length > 0)
            {
              item.data = datas;
              filters.push(item);
            }
                                     
          }
          this.setState({filterEmployees:filters});
      }      
  }
  goWriteFeedback(item)
  {
    self.props.navigation.navigate('WriteFeedbackScreen',{empInfo:item});
  }
  goProfile(item)
  {
    self.props.navigation.navigate('EmployeeProfileScreen',{empInfo:item});
  }
  renderFeedbackitem(item)
  {
      return(
        <View>
          <View style={styles.vwCellContact}>
            {
              item.avatar?<Image style={[styles.imgIcon,{width:30,height:30,borderRadius:15}]} source={{uri:item.avatar}}/>:
              <Image style={[styles.imgIcon,{width:30,height:30,borderRadius:15}]} source={require('../assets/placeholder.png')}/>
            }            
            <Text style={{flex:1,color:'#000',marginLeft:10,fontSize:14}}>{item.first_name + " " + item.last_name}</Text>            
            <View style={{alignItems:'flex-end',flexDirection:'row'}}>
              <TouchableOpacity style={{padding:5,marginRight:10}} onPress={()=> this.goProfile(item)}>
                <Image style={{width:23,height:15}} source={require('../assets/ic_view.png')}/>
              </TouchableOpacity>              
              <TouchableOpacity style={{padding:5,marginRight:5}} onPress={()=> this.goWriteFeedback(item)}>
                <Image style={{width:18,height:15}} source={require('../assets/ic_write.png')}/>
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
        <View style={[styles.vwFrame,{marginTop:20,marginLeft:20,marginRight:20,marginBottom:0,flex:1}]}>
            <Text style={{fontSize:18,color:'#8FB0D9'}}>Company Directory</Text>
            <TextInput autoCapitalize={'none'} autoComplete={'off'} ref={ref => this.inputSearch = ref}  placeholder="Search" style={styles.inputForm}  onChangeText={(text) => this.filter(text)}/>
            <SectionList
              showsVerticalScrollIndicator={false}
              style={{marginTop:10}}
              sections={this.state.filterEmployees}
              renderItem={({item}) => this.renderFeedbackitem(item)}
              renderSectionHeader={({section}) => <Text style={{marginTop:10,fontSize:18,color:"#A5C384",fontWeight:'bold'}}>{section.title}</Text>}
              keyExtractor={(item, index) => index}
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