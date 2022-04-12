import { Platform } from 'react-native';
import { IMLocalized, setI18nConfig } from './Core/localization/IMLocalization';
setI18nConfig();

const DatingConfig = {
  isSMSAuthEnabled: true,
  appIdentifier: 'rn-dating-android',
  onboardingConfig: {
    welcomeTitle: IMLocalized('Find your soul mate'),
    welcomeCaption: IMLocalized(
      'Match and chat with people you like from your area.',
    ),
    walkthroughScreens: [
      {
        icon: require('../assets/images/fire-icon.png'),
        title: 'Get a Date',
        description: IMLocalized(
          'Swipe right to get a match with people you like from your area.',
        ),
      },
      {
        icon: require('../assets/images/chat.png'),
        title: 'Private Messages',
        description: IMLocalized('Chat privately with people you match.'),
      },
      {
        icon: require('../assets/images/instagram.png'),
        title: 'Send Photos & Videos',
        description: IMLocalized(
          'Have fun with your matches by sending photos and videos to each other.',
        ),
      },
      {
        icon: require('../assets/images/notification.png'),
        title: 'Get Notified',
        description: IMLocalized(
          'Receive notifications when you get new messages and matches.',
        ),
      },
    ],
  },
  tosLink: 'https://www.instamobile.io/eula-instachatty/',
  userSettingsFields: {
    sections: [
      {
        title: IMLocalized('DISCOVERY'),
        fields: [
          {
            displayName: IMLocalized('Show Me on Instadating'),
            type: 'switch',
            editable: true,
            key: 'show_me',
            value: true,
          },
          {
            displayName: IMLocalized('Gender'),
            type: 'select',
            options: ['female', 'male', 'none'],
            displayOptions: ['Female', 'Male', 'None'],
            editable: true,
            key: 'gender',
            value: 'None',
          },
          {
            displayName: IMLocalized('Gender Preference'),
            type: 'select',
            options: ['female', 'male', 'all'],
            displayOptions: ['Female', 'Male', 'All'],
            editable: true,
            key: 'gender_preference',
            value: 'All',
          },
        ],
      },
      {
        title: IMLocalized('PUSH NOTIFICATIONS'),
        fields: [
          {
            displayName: IMLocalized('New matches'),
            type: 'switch',
            editable: true,
            key: 'push_new_matches_enabled',
            value: true,
          },
          {
            displayName: IMLocalized('Messages'),
            type: 'switch',
            editable: true,
            key: 'push_new_messages_enabled',
            value: true,
          },
          {
            displayName: IMLocalized('Super Likes'),
            type: 'switch',
            editable: true,
            key: 'push_super_likes_enabled',
            value: true,
          },
          {
            displayName: IMLocalized('Top Picks'),
            type: 'switch',
            editable: true,
            key: 'push_top_picks_enabled',
            value: true,
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Save'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  dailySwipeLimit: 500,
  subscriptionSlideContents: [
    {
      title: IMLocalized('Go VIP'),
      description: IMLocalized(
        'When you subscribe, you get unlimited daily swipes, undo actions, VIP badge and more.',
      ),
      src: require('../assets/images/fencing.png'),
    },
    {
      title: IMLocalized('Undo Actions'),
      description: IMLocalized('Get undo swipe actions when you subscribe.'),
      src: require('../assets/images/vip_1.png'),
    },
    {
      title: IMLocalized('Vip Badge'),
      description: IMLocalized(
        'Stand out with vip badge amongst other swipes when you subscribe',
      ),
      src: require('../assets/images/vip_2.png'),
    },
    {
      title: IMLocalized('Enjoy Unlimited Access'),
      description: IMLocalized(
        'Get unlimited app access and more features to come.',
      ),
      src: require('../assets/images/vip-pass.png'),
    },
  ],
  IAP_SHARED_SECRET: '699db7fcf10c4922bf148caf334c89c6',
  IAP_SKUS: Platform.select({
    ios: [
      'com.instaswipey.FreeTrial.InstaswipeyAutoRenewableSubscriptionByMonth',
      'com.instaswipey.FreeTrial.InstaswipeyAutoRenewableSubscriptionByYear',
    ],
    android: ['android.test.purchased', 'android.test.canceled'],
  }),
  facebookIdentifier: '285315185217069',
};

export default DatingConfig;
