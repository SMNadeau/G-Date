import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import DynamicAppStyles from '../DynamicAppStyles';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ComparisonBaseScreen = (props) => {
  return (
    <ScrollView>
      {/* <Text style={(DynamicAppStyles.navThemeConstants.light, styles.title)}>
        Date Comparison
      </Text> */}
      <View style={styles.imageContainer}>
        <Image style={styles.dateImage1} source={{ uri: props.dateOneUrl }} />
        <Image style={styles.dateImage2} source={{ uri: props.dateTwoUrl }} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.dateName}>{props.dateOneName}</Text>
        <Text style={styles.dateName}>{props.dateTwoName}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // title: {
  //   fontWeight: 'bold',
  //   fontSize: 36,
  //   textAlign: 'center',
  //   padding: 10,
  // },
  imageContainer: {
    flexDirection: 'row',
    height: hp('42%'),
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateImage1: {
    flex: 1,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 5,
  },
  dateImage2: {
    flex: 1,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 5,
  },
  dateName: {
    fontSize: 24,
  },
});

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
    dateOneName: auth.dateOneName,
    dateOneUrl: auth.dateOneUrl,
    dateOneId: auth.dateOneId,
    dateTwoName: auth.dateTwoName,
    dateTwoUrl: auth.dateTwoUrl,
    dateTwoId: auth.dateTwoId,
    onSecondDate: auth.onSecondDate,
    isSafeFirst: auth.isSafeFirst,
    timer: auth.timer,
  };
};

export default connect(mapStateToProps)(ComparisonBaseScreen);
