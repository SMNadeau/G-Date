import { StyleSheet } from 'react-native';

const formStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    titleText: {
      color: 'black',
      //paddingLeft: 10,
      fontSize: 21,
      paddingBottom: 6,
      //fontWeight: 'bold',
      marginHorizontal: 15,
      textAlign: 'center',
    },
    formContainer: {
      borderBottomColor: '#f5f5f5',
      borderBottomWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      flexDirection: 'row',
      borderBottomWidth: 0,
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    },
    textFieldContainer: {
      alignItems: 'center',
      //textAlign: 'center',
      minHeight: 50,
      paddingHorizontal: 15,
    },
    // settingsType: {
    //   color: '#a177cb',
    //   fontSize: 14,
    //   fontWeight: '500',
    // },
    contentContainer: {
      width: '100%',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#d6d6d6',
      backgroundColor: '#ffffff',
    },
    divider: {
      height: 0.5,
      width: '96%',
      alignSelf: 'flex-end',
      backgroundColor: '#d6d6d6',
    },
    text: {
      fontSize: 16,
      //color: '#464646',
    },
    placeholderTextColor: {
      color: '#d6d6d6',
    },
    sliderView: {
      justifyContent: 'center',
      marginLeft: 'auto',
      width: '100%',
      borderStyle: 'solid',
      borderColor: 'black',
      borderWidth: 1,
      //paddingLeft: 25,
      //paddingRight: 25,
      paddingTop: 5,
      paddingBottom: 5,
    },
    sliderTitleText: {
      textAlign: 'center',
      fontSize: 22,
      //fontWeight: 'bold',
    },
    sliderNumberText: {
      textAlign: 'center',
      fontSize: 22,
      fontWeight: 'bold',
      paddingLeft: 5,
      paddingRight: 5,
    },
    sliderLabelText: {
      textAlign: 'center',
      fontSize: 18,
      paddingLeft: 8,
      paddingRight: 8,
    },
    sliderBottomLabel: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
    },
  });
};

export default formStyles;
