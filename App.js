import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { MenuProvider } from 'react-native-popup-menu';
import Feed from './feed.js';
import PageView from './pageview.js';

const RootStack = createStackNavigator(
  {
    Home: Feed,
    Page: PageView
  },
  {
    initialRouteName: 'Home'
  }
);

const AppConatiner = createAppContainer(RootStack);

export default class App extends React.Component {

  render() {
    return (
      <MenuProvider>
        <AppConatiner/>
        </MenuProvider>
    );
  }

}
