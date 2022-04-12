import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

const dynamicStyles = () => {
  return StyleSheet.create({
    timer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: '#aaa',
    },
    value: {
      fontSize: 20,
    },
  });
};

export default dynamicStyles;
