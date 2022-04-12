import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import PropTypes from 'prop-types';
import IMConversationIconView from './IMConversationIconView/IMConversationIconView';
import dynamicStyles from './styles';

function IMConversationView(props) {
  const {
    onChatItemPress,
    formatMessage,
    item,
    user,
    appStyles,
    participants,
  } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const userID = user.userID || user.id;
  // TODO: item holds the users data, we will use this to flip who is seen and who is not on the convo screen
  let title = item.name;
  if (!title) {
    if (item.participants.length > 0) {
      let friend = item.participants[0];
      title = friend.firstName + ' ' + friend.lastName;
    }
  }
  const getIsRead = () => {
    return item.readUserIDs?.includes(userID);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => onChatItemPress(item)}
        style={styles.chatItemContainer}>
        <IMConversationIconView
          participants={item.participants}
          appStyles={appStyles}
        />

        <View style={styles.chatItemContent}>
          <Text>Start the date with</Text>
          <Text
            style={[
              styles.chatFriendName,
              !getIsRead() && styles.unReadmessage,
            ]}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

IMConversationView.propTypes = {
  formatMessage: PropTypes.func,
  item: PropTypes.object,
  onChatItemPress: PropTypes.func,
};

export default IMConversationView;
