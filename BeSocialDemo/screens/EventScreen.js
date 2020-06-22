import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text
} from "react-native";
import { SearchBar } from "react-native-elements";
import { P } from "nachos-ui";
import SimpleHeader from "../components/SimpleHeader";
import ModalHeader from "../components/ModalHeader";
import DetailsModal from "../components/DetailsModal";
import EventsItem from "../components/List/EventsItem";
import { Colors } from "./../styles";
import { LogError } from "../global";


const titleSplitIndex = 50;

class EventScreen extends Component {
  constructor(props) {
    super(props);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.state = {
      loading: false,
      error: null,
      modalVisible: false,
      data: [],
      searchText: "",
      selectedItem: {
        bannerurl: "",
        title: "",
        starteventat: "",
        endeventat: "",
        description: "",
        url: "",
        address: "",
        phone: "",
        coordinates: "",
        buyUrl: "",
        promocode: ""
      }
    };
  }

  setModalVisible(visible) {
    if (!visible) {
      this.setState({
        selectedItem: {
          bannerurl: "",
          title: "",
          starteventat: "",
          endeventat: "",
          description: "",
          url: "",
          address: "",
          phone: "",
          coordinates: "",
          buyUrl: "",
          promocode: ""
        }
      });
    }
    this.setState({ modalVisible: visible });
  }

  closeModal() {
    this.setModalVisible(false);
  }

  componentWillMount() {
    this.setState({ loading: true });
  }

  componentDidMount() {
    const { events } = this.props;
    this.setState({
      data: events,
      loading: false
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { events } = this.props;
    if (!_.isEqual(events, prevProps.events)) {
      this.setState({
        data: events
      });
    }
  }

  searchFilterFunction = text => {
    try {
      const { events } = this.props;
      if (!_.isEmpty(text) && text.length > 2) {
        const newData = events.filter(item => {
          const itemData = `${item.title.toUpperCase()} ${item.description.toUpperCase()} ${item.address.toUpperCase()}`;
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });

        if (!_.isEmpty(newData))
          this.setState({ data: newData, searchText: text });
        else
          this.setState({ data: [], searchText: text });

      }
      else
        this.setState({ data: events, searchText: text });

    } catch (error) {
      LogError('EventScreen::searchFilterFunction', error);
    }
  };

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

  //TODO::Add me to the Global common code
  isDoubleByte = (str) => {
    for (var i = 0, n = str.length; i < n; i++) {
      if (str.charCodeAt(i) > 255) { return i; }
    }
    return -1;
  }

  //TODO::Add me to the Global common code
  unicodeEscape = (str) => {
    if (this.isDoubleByte(str) >= titleSplitIndex - 1)
      return str.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
    else {
      return str;
    }
  }

  renderItem = data => {
    // data is part of the API
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          this.openItemDetail(data.item.id);
        }}
      >
        <EventsItem
          title={`${
            data.item.title.length > 50
              ? `${this.unicodeEscape(data.item.title).toUpperCase().substr(0, 50)}...`
              : data.item.title.toUpperCase()
            }`}
          description={data.item.description}
          starteventat={data.item.starteventat}
          endeventat={data.item.endeventat}
          image={data.item.bannerurl}
          height={100}
          width={100}
          roundCorners={false}
        />
      </TouchableOpacity>
    );
  };

  openItemDetail = item => {
    const { events } = this.props;
    if (!_.isEmpty(item) && !_.isEmpty(events)) {
      // Get all records with matching ID
      let filterContacts = _.map(events, function (contact) {
        if (_.isEqual(contact.id, item)) return contact;
      });

      // Removed undefines from array
      filterContacts = _.without(filterContacts, undefined);
      if (!_.isEmpty(filterContacts)) {
        const selectedItem = filterContacts[0];
        this.setState({
          selectedItem: {
            bannerurl: selectedItem.bannerurl,
            title: selectedItem.title,
            starteventat: selectedItem.starteventat,
            endeventat: selectedItem.endeventat,
            description: selectedItem.description,
            url: selectedItem.url,
            address: selectedItem.address,
            phone: selectedItem.phone,
            coordinates: selectedItem.coordinates,
            buyUrl: selectedItem.buyUrl,
            promocode: selectedItem.promocode
          }
        });

        this.setModalVisible(true);
      }
    } else {
      this.setState({
        selectedItem: {}
      });
    }
  };

  render() {
    const {
      data,
      modalVisible,
      selectedItem,
      searchText,
      loading
    } = this.state;

    if (loading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    }

    //TODO:: make me a function hook. this is crappy
    const NoDisplayView = (
      <View style={styles.container}>
        <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
          <P style={{ color: Colors.orange, fontSize: 15, fontWeight: "700" }}>
            <Text>No Events to display</Text>
          </P>
        </View>
      </View>
    );


    //TODO:: refactor this - too hard to read. logic is easy
    return (
      <View style={styles.container}>
        <SimpleHeader title="Events" />
        <SearchBar
          style={{ flex: 2 }}
          placeholder="search by city, state, address, title..."
          containerStyle={{ backgroundColor: Colors.black }}
          round
          onChangeText={text => this.searchFilterFunction(text)}
          value={searchText}
        />

        {_.isEmpty(data) ? (
          <View style={{ flex: 3 }} >
            {NoDisplayView}
          </View>
        ) :
          <View style={{ flex: 3 }}>
            <FlatList
              style={{
                borderTopWidth: 0, borderBottomWidth: 0, marginTop: 0,
                backgroundColor: Colors.black
              }}
              data={data}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={this.separator}
              activeOpacity={1.0}
            />

            {selectedItem ? (
              <Modal
                animationType="slide"
                transparent={false}
                swipeArea={20}
                visible={modalVisible}
                onRequestClose={() => {
                  this.setModalVisible(false);
                }}
              >
                <ModalHeader
                  title="Events"
                  selectedItem={selectedItem}
                  showBackButton={true}
                  showCloseButton={false}
                  showShareButton={true}
                  onBackPress={this.closeModal}
                />
                <DetailsModal selectedItem={selectedItem} type="events" />
              </Modal>
            ) : null}
          </View>}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.main.contacts.events,
    currentuser: state.main.contacts.currentuser
  };
}

export default connect(
  mapStateToProps,
  null
)(EventScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.black
  }
});
