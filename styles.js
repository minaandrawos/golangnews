
import { StyleSheet } from 'react-native';
import { grey } from 'ansi-colors';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },

  containerCenter: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center'
  },

  Header: {
    backgroundColor: 'deepskyblue',
    height: 50
  },
  HeaderText: {
    textAlign: 'center',
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center'
  },
  itemText: {
    // padding: 10,
    fontSize: 16
  },
  itemMetaText: {
    fontSize: 12,
    color: 'grey'
  },
  itemTag: {
    color: 'white',
    backgroundColor: 'grey',
    padding: 3,
    margin: 3,
    borderRadius: 10,
    alignSelf: 'center'
  },
  item: {
    backgroundColor: 'oldlace',
    flexDirection: 'column',
    padding: 10,
    flex: 1,
    flexWrap: 'wrap'
  },
  separator: {
    height: 1,
    backgroundColor: "#CED0CE"
  },
});   

