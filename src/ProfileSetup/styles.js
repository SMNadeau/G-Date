import { StyleSheet, Platform, Dimensions } from 'react-native';
//import DynamicAppStyles from '../DynamicAppStyles';
//const width = Dimensions.get('window').width;

const profileSetupStyles = (colorScheme) => {
  return StyleSheet.create({
    container: {
      marginLeft: 50,
      marginRight: 50,
      alignItems: 'center',
    },
    pageTitle: {
      fontSize: 32,
      paddingBottom: 10,
      textAlign: 'center',
      marginTop: 15,
      //marginBottom: 10,
    },
    boldPageTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      paddingBottom: 10,
      textAlign: 'center',
      marginTop: 15,
      //marginBottom: 10,
    },
    boldHeader: {
      fontSize: 29,
      paddingBottom: 10,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 15,
    },
    header: {
      fontSize: 29,
      paddingBottom: 10,
      textAlign: 'center',
      marginTop: 15,
    },
    text: {
      fontSize: 22,
      paddingBottom: 10,
      textAlign: 'center',
    },
    textButton: {
      marginTop: 10,
      fontSize: 22,
      textAlign: 'center',
      color: '#0067ff',
    },
    textButton25: {
      marginTop: 10,
      fontSize: 25,
      textAlign: 'center',
      color: '#0067ff',
    },
    dropdown: {
      width: 650,
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      fontSize: 25,
      fontWeight: 'bold',
    },
    label: {
      paddingTop: 10,
      alignSelf: 'flex-start',
      position: 'relative',
      backgroundColor: 'white',
      left: 15,
      top: 5,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 25,
      fontWeight: 'bold',
    },
    placeholderStyle: {
      fontSize: 20,
    },
    selectedTextStyle: {
      fontSize: 20,
    },
    multiSelectItem: {
      fontSize: 20,
      color: '#801dd1',
    },
    textSelectedStyle: {
      marginRight: 5,
      fontSize: 20,
      color: '#801dd1',
    },

    // bottomLogo: {
    //   position: 'absolute',
    //   top: appStyles.WINDOW_HEIGHT - 375,
    //   height: 300,
    //   width: 300,
    // },
  });
};

export default profileSetupStyles;
