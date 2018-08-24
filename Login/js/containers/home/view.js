import React from 'react';
import styles from './styles';
import {View, Image} from 'react-native';
import {Link, LinkWithoutNavigation} from '@core-components';
import girl from '../../../assets/girl.jpg';
import left from '../../../assets/left.png';

/**
 * Returns the JSX Markup for the view
 * @returns {XML}
 */
var view = function () {
    const {drawer} = this.props;
    return (
        <View style={[styles.container]}>
            <View style={[styles.imageContainer]}>
                <Image
                    resizeMode="cover"
                    style={styles.image}
                    source={girl}/>
                {
                    !drawer?(
                        <Link link="DrawerOpen" style={[styles.trigger]}>
                            <Image
                                resizeMode="cover"
                                source={left}
                                style={styles.triggerIcon}
                            />
                        </Link>
                    ):null
                }
            </View>
        </View>
    )
}
module.exports = view;
