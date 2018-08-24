import React from 'react';
import {ScrollView, View, Text, Image} from 'react-native';
import styles from './styles';
import DrawerItems from './config';
import DrawerItem from './drawer-item';
import {Link, Button, Icon} from '@core-components';
import girl from '../../../assets/girl.jpg';
import right from '../../../assets/right.png';
/**
 * Returns the JSX Markup for the view
 * @returns {XML}
 */
var view = function () {
    const {navigation, user,drawer,translate} = this.props;
    const drawerFunctions = this.getDrawerFunctions();
    return user ? (
        <View>
            <ScrollView style={[styles.scrollView]}>
                <View style={[styles.drawerHeader]}>
                    <Image resizeMode="cover" source={(user && user.photoURL) ? {uri: user.photoURL} : girl}
                           style={[styles.drawerProfileImg]}/>
                    <View style={[styles.username]}>
                        <Text style={[styles.name]}>{user.displayName}</Text>
                        <Link link="editProfile"><Text style={[styles.link]}>{translate("drawer.editProfile")}</Text></Link>
                    </View>
                </View>
                <View>
                    {
                        DrawerItems.map((item, index) => {
                            const hidden = item.hidden?item.hidden(user):false;
                            return !hidden?(
                                <DrawerItem onPress = {drawerFunctions[item.onPress]} navigation={navigation} item={item} key={index}/>
                            ):null
                        })
                    }
                </View>
            </ScrollView>
            {
                drawer?(

                    <Link link="DrawerClose" style={[styles.trigger]}>
                        <Image
                            resizeMode="cover"
                            source={right}
                            style={styles.triggerIcon}
                        />
                    </Link>
                ):null
            }
        </View>
    ) : null
};

module.exports = view;
