// @flow

import { StackNavigator } from "react-navigation";

import * as Pages from "d3formation/src/pages";

export default StackNavigator(
  {
    home: {
      screen: Pages.Home,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "home"
  }
);
