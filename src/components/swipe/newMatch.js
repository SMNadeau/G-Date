import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { size } from '../../helpers/devices';
import FastImage from 'react-native-fast-image';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Stars from '../../../node_modules/react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//import { addDocument, updateDoc } from '../../cs530-additions/database';

const NewMatch = (props) => {
  const { url, onKeepSwiping, matchedUser } = props;
  const [starValue, setStarValue] = useState(0);

  const onStarSubmit = () => {
    if (starValue < 1) {
      Alert.alert('No Rating', 'Please rate your match', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } else {
      props.saveRatingData({
        botUserId: matchedUser.id,
        botFirstName: matchedUser.firstName,
        rating: starValue,
      });
      console.log('keep swiping');

      return onKeepSwiping();
    }
  };

  return (
    <FastImage source={{ uri: url }} style={styles.container}>
      <Text style={styles.name_style}>{IMLocalized('Rate your interest')}</Text>

      <Stars
        half={false}
        count={5}
        default={0}
        update={(val) => {
          console.log('stars' + val);
          setStarValue(val);
        }}
        spacing={10}
        starSize={100}
        // count={5}
        fullStar={<Icon name={'star'} size={50} style={[styles.myStarStyle]} />}
        emptyStar={
          <Icon
            name={'star-outline'}
            size={50}
            style={[styles.myStarStyle, styles.myEmptyStarStyle]}
          />
        }
        halfStar={
          <Icon name={'star-half'} size={50} style={[styles.myStarStyle]} />
        }
      />
      <TouchableOpacity disabled={false} onPress={onStarSubmit}>
        <Text style={styles.button}>Submit</Text>
      </TouchableOpacity>
    </FastImage>
  );
};

NewMatch.propTypes = {
  onSendMessage: PropTypes.func,
  onKeepSwiping: PropTypes.func,
  url: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  name_style: {
    fontSize: size(40),
    fontWeight: 'bold',
    color: '#09EE8F',
    // marginBottom: size(100),
    backgroundColor: 'transparent',
  },
  button: {
    fontSize: size(40),
    width: '85%',
    backgroundColor: '#09EE8F',
    borderRadius: 12,
    padding: 15,
    marginBottom: size(15),
  },
  label: {
    fontSize: size(18),
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent',
  },
  detailBtn: {
    marginBottom: size(75),
  },
  myStarStyle: {
    color: 'gold',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: size(100),
  },
  myEmptyStarStyle: {
    color: 'silver',
  },
});

export default NewMatch;
