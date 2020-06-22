import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import SimpleHeader from "../components/SimpleHeader";
import ModalHeader from "../components/ModalHeader";
import DetailsModal from "../components/DetailsModal";
import NotificationItem from "../components/List/NotificationItem";
import { P } from "nachos-ui";
import { dbUsers } from "../firebase-db";
import { LogError } from "../global";
import { Colors } from "./../styles";

class NotifyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      modalVisible: false,
      selectedItem: {
        title: "",
        description: "",
        bannerurl: "",
        starteventat: "",
        navigateto: ""
      }
    };

    this.setNotificationCount();
  }

  setNotificationCount = () => {
    const { currentnotificationscount, navigation } = this.props;
    if (navigation) {
      navigation.setParams({ notifyCount: currentnotificationscount });
    }
  };

  setModalVisible = (visible) => {
    if (!visible) {
      this.setState({
        selectedItem: {
          title: "",
          description: "",
          bannerurl: "",
          starteventat: "",
          navigateto: ""
        }
      });
    }
    this.setState({ modalVisible: visible });
  }

  closeModal = () => {
    try {
      const { id } = this.state.selectedItem;
      this.setModalVisible(false);
      this.setUserNotificationAsRead(id);
    } catch (error) {
      LogError('NotifyScreen::closeModal', error);
    }

  }

  componentWillMount() {
    this.setState({ loading: true });
  }

  componentDidMount() {
    this.setState({
      error: null,
      loading: false
    });
  }

  componentDidUpdate(prevPros) {
    const { currentnotificationscount } = this.props;
    if (
      !_.isEqual(currentnotificationscount, prevPros.currentnotificationscount)
    ) {
      this.setNotificationCount();
    }
  }

  separator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "100%",
          backgroundColor: Colors.primaryColor,
        }}
      />
    );
  };

  renderItem = data => {
    try {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            this.openModalDetailPage(data.item.key);
          }}
        >
          <NotificationItem
            title={`${
              data.item.title.length > 50
                ? `${data.item.title.toUpperCase().substr(0, 50)}...`
                : data.item.title.toUpperCase()
              }`}
            description={`${
              data.item.description.length > 50
                ? `${data.item.description.substr(0, 50)}...`
                : data.item.description
              }`}
            icon={true}
            isRead={data.item.isRead}
            roundCorners={true}
          />
        </TouchableOpacity>
      );
    } catch (error) {
      LogError('NotifyScreen::closeModal', error);
    }

  };

  openModalDetailPage = id => {
    try {
      const selectedItem = this.filterSelectedItem(id);
      this.setState({
        selectedItem: {
          id: id,
          title: selectedItem.title,
          description: selectedItem.description,
          bannerurl: selectedItem.imageurl,
          starteventat: selectedItem.dateofevent,
          navigateto: selectedItem.navigateto
        }
      });
      this.setModalVisible(true);
    } catch (error) {
      LogError('NotifyScreen::openModalDetailPage', errror.message);
    }
  };

  setUserNotificationAsRead = notificationid => {
    try {
      const { currentuser } = this.props;
      if (currentuser && !_.isEmpty(currentuser.id)) {
        if (!_.isEmpty(notificationid)) {
          dbUsers
            .child(currentuser.id)
            .child("notifications")
            .child(notificationid)
            .update({ isactive: false });
        }
      }
    } catch (error) {
      LogError('NotifyScreen::setUserNotificationAsRead', error);
    }

  };

  filterSelectedItem = id => {
    try {
      const { currentnotifications } = this.props;
      const selectedItem = _.find(currentnotifications, item => item.id === id);
      return selectedItem;
    } catch (error) {
      LogError('NotifyScreen::filterSelectedItem', error);
    }
  };

  filterUnWantedData = data => {
    try {
      let filterData = [];
      if (!_.isEmpty(data)) {
        for (let index = 0; index < data.length; index++) {
          const notification = data[index];
          if (
            !_.isEmpty(notification.id) &&
            !_.isEmpty(notification.title) &&
            !_.isEmpty(notification.description)
          ) {
            filterData.push({
              key: notification.id,
              title: notification.title,
              description: notification.description,
              isRead: notification.isactive
            });
          }
        }
      }
      return filterData.reverse();
    } catch (error) {
      LogError('NotifyScreen::filterUnWantedData', errror.message);
    }

  };

  render() {
    const { currentnotifications } = this.props;
    const { loading, modalVisible, selectedItem } = this.state;
    const data = this.filterUnWantedData(currentnotifications);

    if (loading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    }

    if (_.isEmpty(data)) {
      return (
        <View style={styles.container}>
          <SimpleHeader title="Notifications" />
          <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }} >
            <P style={{ color: Colors.orange, fontSize: 15, fontWeight: "700" }}>
              <Text> No Notification to display</Text>
            </P>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <SimpleHeader title="Notifications" />
        <ScrollView 
            contentContainerStyle={{ paddingBottom: 20 }} 
            style={styles.container} 
            keyboardShouldPersistTaps={'handled'}
          >
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={item => item.key}
            ItemSeparatorComponent={this.separator}
          />
          {selectedItem ? (
            <Modal
              animationType="slide"
              transparent={false}
              swipeArea={20}
              visible={modalVisible}
              onRequestClose={() => {
                this.closeModal();
              }}
            >
              <ModalHeader
                title="Notifications"
                showBackButton={false}
                showCloseButton={true}
                onBackPress={this.closeModal}
              />

              <DetailsModal selectedItem={selectedItem} type="notification" />
            </Modal>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentuser: state.main.contacts.currentuser,
    currentnotifications: state.main.contacts.currentnotifications,
    currentnotificationscount: state.main.contacts.currentnotificationscount
  };
}

export default connect(
  mapStateToProps,
  null
)(NotifyScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black
  }
});
