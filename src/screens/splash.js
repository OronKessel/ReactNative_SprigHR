import React, {Component} from 'react';
import {Dimensions,StatusBar, View} from 'react-native';

import Styles from '../common/style';
import Video from 'react-native-video';
import {serviceGetDomains} from '../service/api';
import {Config} from '../doc/config';
import {Globals} from '../doc/global';
import DefaultPreference from 'react-native-default-preference';

const { styles } = Styles;

var self= null;
export default class SplashScreen extends Component {
  constructor(props) {
    var timer;
    var player;
    super(props);    
    self = this;    
  }
  componentDidMount() {    
    //timer = setInterval(this.goLogin, 4000);    
    //this.webGetDomains();
  }
  goLogin() {
    clearInterval(timer);
    self.props.navigation.navigate('LoginScreen');    
  }
  goHome() {
    clearInterval(timer);
    self.props.navigation.navigate('HomeScreen');    
  }
  onEndVideo()
  {
    timer = setInterval(self.webGetDomains, 100);    
    
  }

  webGetDomains()
  {
    clearInterval(timer);
    
    DefaultPreference.getMultiple(['userId','authToken','domain']).then(function(values) 
    {          
        if (values[0] != null)
        {                
            Globals.mUserId = values[0];
            Config.BASE_URL = values[2];
            console.warn(Globals.mUserId);
            Config.AuthToken = values[1];
            self.goHome();
        }
        else
        {
          self.goLogin();
        }
    }).catch(err=>{            
      self.goLogin();
    });
    // serviceGetDomains()
    // .then(res=>{ 
    //   Config.URLS = res;
    //   Config.BASE_URL = Config.URLS[0]['domain'];
    //   )
    //   .catch(err=>{            
    //     self.goLogin();
    //   });
    // })
    // .catch(err=>{
        
    // });
  }
  render() {
    return (
      <View style={[{backgroundColor:'#000'},styles.flexFull]}>
        <StatusBar hidden={true} />
        <Video source={require('../assets/intro.mp4')}   // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref
          }}                                      // Store reference
          onEnd={this.onEndVideo}
          fullscreen={true}       
          fullscreenAutorotate={false}             
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            minWidth: Dimensions.get('window').width,
            minHeight: Dimensions.get('window').height}} />
      </View>
    );
  }
}
