/**
 * BuzzBus React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, ScrollView
} from 'react-native';

import { fadeIn } from 'react-navigation-transitions';


import { StackNavigator, NavigationActions} from 'react-navigation';
import SplashScreen from './src/screens/splash';
import LoginScreen from './src/screens/login';
import HomeScreen from './src/screens/home';
import ProfileScreen from './src/screens/profile'
import NoteScreen from './src/screens/note'
import AddNoteScreen from './src/screens/addnote'
import FeedbackScreen from './src/screens/feedback'
import ContactScreen from './src/screens/contacts'
import WriteFeedbackScreen from './src/screens/writefeedback'
import EditNoteScreen from './src/screens/editnote'
import EmployeeProfileScreen from './src/screens/employee_profile'
import LoginPasswordScreen from './src/screens/login_password'
import TeamScreen from './src/screens/team'
import LeadScreen from './src/screens/lead'
import TeamFeedbackScreen from './src/screens/team_feedback'

// global.__DEV__=false;
const Routes1 = StackNavigator({

  //WriteFeedbackScreen: {screen:WriteFeedbackScreen, navigationOptions:{header:true}},
  SplashScreen: {screen:SplashScreen, navigationOptions:{header:true}},
  LoginScreen: {screen:LoginScreen, navigationOptions:{header:true}},

},{
  initialRouteName: 'SplashScreen',
  transitionConfig: () => fadeIn(500),
})

const Routes = StackNavigator({

    Main: {screen:Routes1},
    LoginScreen: {screen:LoginScreen, navigationOptions:{header:true}},
    LoginPasswordScreen: {screen:LoginPasswordScreen, navigationOptions:{header:true}},
    HomeScreen: {screen:HomeScreen, navigationOptions:{header:true}},
    ProfileScreen: {screen:ProfileScreen, navigationOptions:{header:true}},    
    AddNoteScreen: {screen:AddNoteScreen, navigationOptions:{header:true}},    
    FeedbackScreen: {screen:FeedbackScreen, navigationOptions:{header:true}},    
    NoteScreen: {screen:NoteScreen, navigationOptions:{header:true}},            
    ContactScreen: {screen:ContactScreen, navigationOptions:{header:true}},
    WriteFeedbackScreen: {screen:WriteFeedbackScreen, navigationOptions:{header:true}},    
    EditNoteScreen: {screen:EditNoteScreen, navigationOptions:{header:true}},      
    EmployeeProfileScreen: {screen:EmployeeProfileScreen, navigationOptions:{header:true}},      
    TeamScreen: {screen:TeamScreen, navigationOptions:{header:true}},      
    LeadScreen: {screen:LeadScreen, navigationOptions:{header:true}},      
    TeamFeedbackScreen: {screen:TeamFeedbackScreen, navigationOptions:{header:true}},      
    
    


})
//TrackPlayer.registerEventHandler(require('./src/components/RemoteControlHandler.js'));
AppRegistry.registerComponent('SpringHR', () =>  Routes);
console.disableYellowBox = false;
