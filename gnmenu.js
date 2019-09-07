import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import React from 'react';
import styles from './styles.js';

const LINKPREFIX = 'https://golangnews.com/';

const menuOptions = {
  HOME: "index.xml",
  CODE: "stories/code.xml",
  VIDEOS: "stories.xml?q=Video:",
  JOBS: "stories.xml?q=Hiring:",
  EVENTS: "stories.xml?q=Event:",
  BOOKS: "stories.xml?q=Book:",
  CASTS: "stories.xml?q=Cast:",
  NEW: "stories.xml",
  SHOW: "stories.xml?q=Show:",
  UPVOTED: "stories/upvoted.xml"
};

export default class GNMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: menuOptions.HOME };
    this._renderMenuOptions = this._renderMenuOptions.bind(this);
  }

  _renderMenuOptions() {
    let results = [];
    for (let key in menuOptions) {
      const v = menuOptions[key];
      results.push(<CheckedOption key={key} checked={this.state.selected === v} value={v} text={key} />);
    }
    return results;
  }

  render() {
    const options = this._renderMenuOptions();
    return (
      <Menu onSelect={
        value => {
          this.setState({ selected: value });
          this.props.mAction(LINKPREFIX + value);
        }
      }>
        <MenuTrigger text={'\u2630'} customStyles={menuStyles.triggerText}></MenuTrigger>
        <MenuOptions style={{ backgroundColor: 'deepskyblue' }} customStyles={menuStyles.menuOptionsStyle}>
          {options}
        </MenuOptions>
      </Menu>

    );
  }
}

const CheckedOption = (props) => (
  <MenuOption value={props.value} text={(props.checked ? '\u2713 ' : '') + props.text} />
)

const menuStyles = {
  menuOptionsStyle: {
    optionsWrapper: { padding: 8 },
    optionText: { color: 'white', fontWeight: 'bold' }
  },
  triggerText: { triggerText: styles.HeaderText }
} 