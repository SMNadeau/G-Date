import { createStackNavigator } from 'react-navigation-stack';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import { createReduxContainer } from 'react-navigation-redux-helpers';
import { createSwitchNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import ProfileSetup1 from '../ProfileSetup/ProfileSetup1';
import ProfileSetup2 from '../ProfileSetup/ProfileSetup2';
import ProfileSetup3 from '../ProfileSetup/ProfileSetup3';
import ProfileSetup4 from '../ProfileSetup/ProfileSetup4';
import ProfileSetup3Intro from '../ProfileSetup/ProfileSetup3Intro';
import PreDate from '../DateAssessments/PreDate';
import PostDate from '../DateAssessments/PostDate';
import ComparisonScreen1 from '../DateAssessments/ComparisonScreen1';
import ComparisonScreen2 from '../DateAssessments/ComparisonScreen2';
import ComparisonScreen3 from '../DateAssessments/ComparisonScreen3';
import ComparisonScreen4 from '../DateAssessments/ComparisonScreen4';
import ComparisonScreen5 from '../DateAssessments/ComparisonScreen5';
import ComparisonScreen6 from '../DateAssessments/ComparisonScreen6';
import ComparisonComplete from '../DateAssessments/ComparisonComplete';
import { IMChatScreen } from '../Core/chat';
import ConversationsScreen from '../screens/ConversationsScreen/ConversationsScreen';
import LoadScreen from '../Core/onboarding/LoadScreen/LoadScreen';
import SwipeScreen from '../screens/SwipeScreen/SwipeScreen';
import ProfilePictureSelectScreen from '../ProfileSetup/ProfilePictureSelectScreen';
import LoginScreen from '../Core/onboarding/LoginScreen/LoginScreen';
import DeveloperScreen from '../Core/onboarding/DeveloperScreen/DeveloperScreen';
import ResearcherScreen from '../Core/onboarding/ResearcherScreen/ResearcherScreen';
import QuestionsScreen from '../Core/onboarding/QuestionsScreen/QuestionsScreen';
import SignupScreen from '../Core/onboarding/SignupScreen/SignupScreen';
import WelcomeScreen from '../Core/onboarding/WelcomeScreen/WelcomeScreen';
import AdminInput from '../cs530-additions/AdminPassScreen/AdminPass';
import WalkthroughScreen from '../Core/onboarding/WalkthroughScreen/WalkthroughScreen';
import SmsAuthenticationScreen from '../Core/onboarding/SmsAuthenticationScreen/SmsAuthenticationScreen';
import DynamicAppStyles from '../DynamicAppStyles';
import DatingConfig from '../DatingConfig';
import SpeedDate from '../Core/speedDate/SpeedDate';
import Date2Intro from '../DateAssessments/Date2Intro';
import PreProfileSetup from '../ProfileSetup/PreProfileSetup';
import ProfileSetupEnd from '../ProfileSetup/ProfileSetupEnd';
import ProfileSetupIntro from '../ProfileSetup/ProfileSetupIntro';

const middleware = createReactNavigationReduxMiddleware((state) => state.nav);

const LoginStack = createStackNavigator(
  {
    Welcome: { screen: WelcomeScreen },
    Login: { screen: LoginScreen },
    Developer: { screen: DeveloperScreen },
    Researcher: { screen: ResearcherScreen },
    Questions: { screen: QuestionsScreen },
    Signup: { screen: SignupScreen },
    Admin: { screen: AdminInput },
    Sms: { screen: SmsAuthenticationScreen },
  },
  {
    initialRouteName: 'Welcome',
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: DatingConfig,
    },
    headerMode: 'none',
    gestureEnabled: false,
  },
);

const DeveloperStack = createStackNavigator(
  {
    Welcome: { screen: WelcomeScreen },
    Login: { screen: LoginScreen },
    Developer: { screen: DeveloperScreen },
    Researcher: { screen: ResearcherScreen },
    Questions: { screen: QuestionsScreen },
    Signup: { screen: SignupScreen },
    Sms: { screen: SmsAuthenticationScreen },
  },
  {
    initialRouteName: 'Developer',
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: DatingConfig,
    },
    headerMode: 'none',
    gestureEnabled: false,
  },
);

const ResearcherStack = createStackNavigator(
  {
    Welcome: { screen: WelcomeScreen },
    Login: { screen: LoginScreen },
    Developer: { screen: DeveloperScreen },
    Researcher: { screen: ResearcherScreen },
    Questions: { screen: QuestionsScreen },
    Signup: { screen: SignupScreen },
    Sms: { screen: SmsAuthenticationScreen },
  },
  {
    initialRouteName: 'Researcher',
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: DatingConfig,
    },
    headerMode: 'none',
    gestureEnabled: false,
  },
);

const DateStack = createStackNavigator(
  {
    Welcome: { screen: WelcomeScreen },
    Login: { screen: LoginScreen },
    Developer: { screen: DeveloperScreen },
    Researcher: { screen: ResearcherScreen },
    Questions: { screen: QuestionsScreen },
    Signup: { screen: SignupScreen },
    Sms: { screen: SmsAuthenticationScreen },
    SpeedDateScreen: { screen: SpeedDate },
  },
  {
    initialRouteName: 'SpeedDateScreen',
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: DatingConfig,
    },
    headerMode: 'none',
    gestureEnabled: false,
  },
);

const QuestionsStack = createStackNavigator(
  {
    Welcome: { screen: WelcomeScreen },
    Login: { screen: LoginScreen },
    Developer: { screen: DeveloperScreen },
    Researcher: { screen: ResearcherScreen },
    Questions: { screen: QuestionsScreen },
    Signup: { screen: SignupScreen },
    Sms: { screen: SmsAuthenticationScreen },
    ComparisonComplete: { screen: ComparisonComplete },
  },
  {
    initialRouteName: 'Questions',
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: DatingConfig,
    },
    headerMode: 'none',
    gestureEnabled: false,
  },
);

const MyProfileStack = createStackNavigator(
  {
    ProfilePictureSelectScreen: { screen: ProfilePictureSelectScreen },
    AccountDetails: { screen: ProfileSetup1 },
    AccountDetails2: { screen: ProfileSetup2 },
    AccountDetails3: { screen: ProfileSetup3 },
    AccountDetails4: { screen: ProfileSetup4 },
    ProfileInstructions: { screen: ProfileSetup3Intro },
    //Settings: { screen: IMUserSettingsScreen },
    //ContactUs: { screen: IMContactUsScreen },
    PreDate: { screen: PreDate },
    PostDate: { screen: PostDate },
    SpeedDateScreen: { screen: SpeedDate },
    Date2Intro: { screen: Date2Intro },
    Comparison1: { screen: ComparisonScreen1 },
    Comparison2: { screen: ComparisonScreen2 },
    Comparison3: { screen: ComparisonScreen3 },
    Comparison4: { screen: ComparisonScreen4 },
    Comparison5: { screen: ComparisonScreen5 },
    Comparison6: { screen: ComparisonScreen6 },
    ComparisonComplete: { screen: ComparisonComplete },
    PreProfileSetup: { screen: PreProfileSetup },
    ProfileSetupEnd: { screen: ProfileSetupEnd },
    Swipe: { screen: SwipeScreen },
    ProfileSetupIntro: { screen: ProfileSetupIntro },
  },
  {
    initialRouteName: 'ProfilePictureSelectScreen',
    initialRouteParams: {
      appStyles: DynamicAppStyles,
    },
    //headerMode: 'none',
    //header: null,
    headerLayoutPreset: 'center',
    gestureEnabled: false,
  },
);

const ConversationsStack = createStackNavigator(
  {
    Conversations: { screen: ConversationsScreen },
  },
  {
    initialRouteName: 'Conversations',
    initialRouteParams: {
      appStyles: DynamicAppStyles,
    },
    // headerLayoutPreset: 'center',
    header: null,
    gestureEnabled: false,
  },
);

const doNotShowHeaderOption = {
  navigationOptions: {
    header: null,
    gestureEnabled: false,
  },
};

const DrawerStack = createStackNavigator(
  {
    Swipe: { screen: SwipeScreen },
    Conversations: { screen: ConversationsStack, ...doNotShowHeaderOption },
    MyProfileStack: { screen: MyProfileStack, ...doNotShowHeaderOption },
    AccountDetails: { screen: ProfileSetup1 },
    AccountDetails2: { screen: ProfileSetup2 },
    AccountDetails3: { screen: ProfileSetup3 },
    AccountDetails4: { screen: ProfileSetup4 },
    ProfileInstructions: { screen: ProfileSetup3Intro },
    PreDate: { screen: PreDate },
    PostDate: { screen: PostDate },
    SpeedDateScreen: { screen: SpeedDate },
    Date2Intro: { screen: Date2Intro },
    Comparison1: { screen: ComparisonScreen1 },
    Comparison2: { screen: ComparisonScreen2 },
    Comparison3: { screen: ComparisonScreen3 },
    Comparison4: { screen: ComparisonScreen4 },
    Comparison5: { screen: ComparisonScreen5 },
    Comparison6: { screen: ComparisonScreen6 },
    ComparisonComplete: { screen: ComparisonComplete },
  },
  {
    initialRouteName: 'Swipe',
    initialRouteParams: {
      appStyles: DynamicAppStyles,
    },
    mode: 'modal',
    headerMode: 'screen',
    headerLayoutPreset: 'center',
    gestureEnabled: false,
  },
);

const MainStackNavigator = createStackNavigator(
  {
    NavStack: {
      screen: DrawerStack,
      navigationOptions: { header: null },
    },
    PersonalChat: { screen: IMChatScreen },
  },
  {
    initialRouteName: 'NavStack',
    initialRouteParams: {
      appStyles: DynamicAppStyles,
    },
    headerMode: 'none',
    header: null,
    gestureEnabled: false,
  },
);

// Manifest of possible screens
const RootNavigator = createSwitchNavigator(
  {
    ProfileIncomplete: { screen: MyProfileStack, ...doNotShowHeaderOption },
    LoadScreen: { screen: LoadScreen },
    Admin: { screen: AdminInput },
    Walkthrough: { screen: WalkthroughScreen },
    LoginStack: { screen: LoginStack },
    DeveloperStack: { screen: DeveloperStack },
    ResearcherStack: { screen: ResearcherStack },
    QuestionsStack: { screen: QuestionsStack },
    MainStack: { screen: MainStackNavigator },
    DateStack: { screen: DateStack },
    // IntermediateStack: {screen: Date2Intro},
  },
  {
    initialRouteName: 'LoadScreen',
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: DatingConfig,
      gestureEnabled: false,
    },
  },
);

const AppContainer = createReduxContainer(RootNavigator);

const mapStateToProps = (state) => ({
  state: state.nav,
});

const AppNavigator = connect(mapStateToProps)(AppContainer);

export { RootNavigator, AppNavigator, middleware };
