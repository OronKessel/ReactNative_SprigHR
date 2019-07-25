import
{
  Dimensions,
  Platform,
  StyleSheet
} from 'react-native';

const { width, height } = Dimensions.get('window');
const bottomBarHeight = 150;
import {
    scale,
    verticalScale
} from './scale';
const styles = StyleSheet.create({
  loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#777',
        opacity:0.9,
        zIndex:999999999999999999
  },
  loaderView: {
        width:scale(250),
        height:verticalScale(60),
        backgroundColor:'#54C540',
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center'
  },
  activityIndicator: {
        margin:scale(15)
  },
  loadingText:{
        color:'#fff',
        fontSize:scale(14),
  },
  primaryBg: {
    backgroundColor:'#444444',
  },
  widthEdit:
  {
    width:width - 60
  },
  whiteBG:{
  	backgroundColor:'#fff'
  },
  bg:{
  	backgroundColor:'#F7FCF1'
  },
  centerLogo:{
  	marginTop:height / 3 - 85,
  	marginLeft:width / 2 - 160
  },
  splashLogosize:
  {
  	width:190,
  	height:78
  },
  flexFull:{
  	flex:1
  },
  vwFrame:
  {
	backgroundColor:'#FFFFFF',
  	marginTop:20,
  	padding:15,
  	borderColor:'#99DD57',
  	borderRadius:10,
  	borderWidth:1
  },
  vwLogin:
  {
  	backgroundColor:'#FFFFFF',
  	width:300,
  	marginTop:20,
  	padding:15,
  	borderColor:'#99DD57',
  	borderRadius:10,
  	borderWidth:1
  },
  inputForm:{
  	height:40,
  	marginTop:10,
  	borderRadius:10,
  	borderColor:'#EDEDEA',
  	borderWidth:1,
  	padding:5,
  },
  inputFormWrap:{
  	marginTop:10,
  	borderRadius:10,
  	borderColor:'#EDEDEA',
  	borderWidth:1,
  	padding:5,
  },
  loginButton:{
  	borderWidth:1,
  	borderRadius:5,
  	textAlign:'center',
  	borderColor:'#5DA1DA',
  	backgroundColor:'#F2F8FD',
  	color:'#5DA1DA',
  	padding:10,
  	width:80
  },
  imgProfile:{
  	width:70,
  	height:70,
  	borderRadius:35
  },
  txtName:
  {
  	fontSize:20,
  	color:'#969693',
  	padding:5
  },
  txtRole:
  {
  	fontSize:16,
  	color:'#7FB2E8',
  	padding:5
  },
  btnPrimary:
  {
	borderWidth:1,
  	borderRadius:5,
  	textAlign:'center',
  	borderColor:'#5DA1DA',
  	backgroundColor:'#F2F8FD',
  	color:'#5DA1DA',
  	padding:10,
  },
  btnGreen:
  {
  	borderWidth:1,
  	borderRadius:5,
  	textAlign:'center',
  	borderColor:'#AFC996',
  	backgroundColor:'#fff',
  	padding:10,
  },
  imgIcon:
  {
  	width:40,
  	height:40
  },
  txtFieldName:
  {
  	color:'#AFC996',
  	fontSize:16,
  	fontWeight:'bold'
  },
  vwTeam:{
  	margin:2,
  	padding:5,
    height:30,
  	borderRadius:5,
  	backgroundColor:'#B7DBEE'
  },
  imgSmallIcon:
  {
  	width:15,
  	height:15
  },
  vwCellContact:
  {
  	borderColor:'#ccc',
  	borderWidth:1,
  	backgroundColor:'#F2F2F2',
  	flexDirection:'row',
  	marginTop:3,
  	justifyContent:'center',
  	alignItems:'center',
  	padding:5
  }
});

export default {
  styles 
};
