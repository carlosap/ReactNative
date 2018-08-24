import React from 'react-native';
import {Colors} from '@core-styles';

var styles = React.StyleSheet.create({
  drawerItemText : {color : 'rgba(0, 0, 0, 0.85)',fontSize:13},
  drawerNavList : { flex : 1, paddingBottom : 120},
  drawerNavItem : { flexDirection : 'row', padding : 20,paddingBottom:15,paddingTop:15,borderBottomWidth : 1,borderColor : '#e9e9e9'},
  drawerNavItemIcon:{marginRight : 15,marginTop : -5,width:22,height:22,color:Colors.brandRed},
  drawerNavItemText : { fontSize : 15, marginLeft : 10, color : '#707070'}
});

export default styles;
