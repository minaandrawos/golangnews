import React from 'react';
import { FlatList, Text, View, TouchableOpacity, BackHandler } from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import styles from './styles.js';
import GNMenu from './gnmenu.js';
import { MenuProvider } from 'react-native-popup-menu';

const HOME = 'https://golangnews.com/index.xml';
const TAGPREFIX = 'https://golangnews.com/stories.xml?q=%23';

export default class feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      title: 'Go News',
    };
    this.renderRow = this.renderRow.bind(this);
    this._goHome = this._goHome.bind(this);
    this._loadRSS = this._loadRSS.bind(this);
    this.getDay = this.getDay.bind(this);
    this.getDomain = this.getDomain.bind(this);
    this.LastVisit = [];
    this.prev = HOME;
    this.refreshing = false;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: feed.getHeaderTitle(navigation),// <Button style={styles.HeaderText} title={'Go News'} onPress={()=>{}}/>,
      headerStyle: styles.Header,
      //headerTitleStyle: styles.HeaderText,
      headerTintColor: '#fff',
    }
  };

  static getHeaderTitle(navigation) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <GNMenu mAction={navigation.getParam('loadRSS')} />
        <TouchableOpacity onPress={navigation.getParam('goHome')}>
          <Text style={styles.HeaderText}>Go News</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _goHome() {
    this._loadRSS(HOME)
  }

  async _loadRSS(link, push = true) {
    this.refreshing = true;
    fetch(link)
      .then((response) => response.text())
      .then((responseData) => rssParser.parse(responseData))
      .then((rss) => {
        this.setState({
          title: link,
          items: rss.items.map(item => {
            let link = (item.links.length > 0) ? item.links[0].url : null;
            let obj = {};
            if (link != null) {
              obj['key'] = item.id;
              obj['title'] = item.title;
              obj['published'] = item.published;
              obj['description'] = item.description;
              obj['link'] = link;
            }
            return obj;
          })
        });
        this.refreshing = false;
      });
    if (link == HOME) {
      this.LastVisit = [];
    } else if (push) {
      this.LastVisit.push(this.prev);
    }
    this.prev = link;
  }

  async componentDidMount() {
    this.props.navigation.setParams({ goHome: this._goHome });
    this.props.navigation.setParams({ loadRSS: this._loadRSS });
    this._loadRSS(HOME);
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.LastVisit.length > 0) {
        this._loadRSS(this.LastVisit.pop(), false);
      } else {
        BackHandler.exitApp();
      }
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  renderRow({ item }) {
    let { title, published, link, description } = item;
    if (!link.includes('http') && !link.includes('https')) {
      return null;
    }
    let btns = [];
    if (item.title.includes('#')) {
      let iter = item.title.split(' ');
      for (let v of iter) {
        if (v.startsWith('#')) {
          const tag = v.substring(1);
          const btn = (<TouchableOpacity key={v} onPress={() => { this._loadRSS(TAGPREFIX + tag); }}>
            <Text style={styles.itemTag}>{tag}</Text>
          </TouchableOpacity>);
          btns.push(btn);
          title = title.replace(v, "");
        }
      }
    }
    return (
      <TouchableOpacity onPress={() => {
        this.props.navigation.navigate('Page', {
          link: link,
          title: item.title
        });
      }}>
        <View style={styles.item}>
          <Text style={styles.itemMetaText}>{this.getDomain(link)}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text style={styles.itemText}>{title}</Text>
            {btns}
          </View>
          <Text style={styles.itemMetaText}>{this.getDay(published)}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  getDomain(link) {
    let matches = link.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
    return matches && matches[1];
  }
  getDay(published) {
    const denominator = 1000 * 3600 * 24;
    const d = new Date(published);
    const now = Date.now();
    const result = Math.floor((now - d) / denominator);

    if (result === 0) {
      return "Today";
    }
    const days = (result == 1) ? ' day' : ' days'
    const r = result.toString();
    return r + days + " ago";
  }

  renderHeader() {
    return (
      <Text style={styles.Header}>Golang News</Text>
    )
  }

  renderSeparator() {
    return (
      <View style={styles.separator} />
    )
  }

  render() {
    return (
      <View style={styles.containerCenter}>
        <FlatList
          data={this.state.items}
          renderItem={this.renderRow}
          keyExtractor={item => item.key}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }

} 