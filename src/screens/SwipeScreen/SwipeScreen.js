import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
  //Platform,
  AppState,
  //PermissionsAndroid, // eslint-disable-line react-native/split-platform-components
} from 'react-native';
import { useSelector, useDispatch, ReactReduxContext } from 'react-redux';
//import Geolocation from '@react-native-community/geolocation';
import { firebase } from '../../Core/firebase/config';
import ActivityModal from '../../components/ActivityModal';
import Deck from '../../components/swipe/deck';
import NoMoreCard from '../../components/swipe/no_more_card';
import NewMatch from '../../components/swipe/newMatch';
import DynamicAppStyles from '../../DynamicAppStyles';
import DatingConfig from '../../DatingConfig';
import {
  setUserData,
  setDateOne,
  setDateTwo,
  setDateOrder,
} from '../../Core/onboarding/redux/auth';
import { TNTouchableIcon } from '../../Core/truly-native';
import SwipeTracker from '../../firebase/tracker';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
//import { notificationManager } from '../../Core/notifications';
import { useIap } from '../../Core/inAppPurchase/context';
//import { getUserAwareCanUndoAsync } from '../../utils';
import { updateDoc } from '../../cs530-additions/database';
import { connect } from 'react-redux';

const SwipeScreen = (props) => {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  const { store } = useContext(ReactReduxContext);

  const { setSubscriptionVisible } = useIap();
  const [user, setUser] = useState(props.user);
  const swipes = useSelector((state) => state.dating.swipes);
  //const bannedUserIDs = useSelector((state) => state.userReports.bannedUserIDs);
  //const matches = useSelector((state) => state.dating.matches);
  //const isPlanActive = useSelector((state) => state.inAppPurchase.isPlanActive);
  const dispatch = useDispatch();

  const [recommendations, setRecommendations] = useState([]);
  const [showMode, setShowMode] = useState(0);
  const [newMatchIndex, setNewMatchIndex] = useState(null);
  //const [currentMatchData, setCurrentMatchData] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  //const [positionWatchID, setPositionWatchID] = useState(null);
  const [
    hasConsumedRecommendationsStream,
    setHasConsumedRecommendationsStream,
  ] = useState(false);

  const [numSwipesThisSession, setNumSwipesThisSession] = useState(0);
  //const recommendationBatchLimit = 75;
  const usersRef = firebase.firestore().collection('users');
  var userRef = null;

  //
  //const userAwareCanUndo = useRef(false);
  const isLoadingRecommendations = useRef(false);
  const swipeCountDetail = useRef({});
  //const didFocusSubscription = useRef(null);
  const swipeTracker = useRef(new SwipeTracker(store, user.id));
  const recommendationRef = useRef(
    usersRef.orderBy('id', 'desc'), //.limit(recommendationBatchLimit),
  );

  useEffect(() => {
    StatusBar.setHidden(false);
    swipeTracker.current.subscribeIfNeeded();

    AppState.addEventListener('change', handleAppStateChange);

    userRef = usersRef.doc(user.id);
    //fail-safe: make sure user is up-to-date (check that it has ProfileSection2)
    if (!user.ProfileSection2) {
      //user is not up to date, pull from db
      userRef.get().then((upToDateUser) => {
        setUser(upToDateUser.data());
      });
    }

    getUserSwipeCount();

    // return () => {
    //   //didFocusSubscription.current && didFocusSubscription.current.remove();
    //   AppState.removeEventListener('change', handleAppStateChange);
    //   //positionWatchID != null && Geolocation.clearWatch(positionWatchID);
    //   swipeTracker.current.unsubscribe();
    // };
  }, []);

  // useEffect(() => {
  //   if (matches != null) {
  //     // We retrieve all new matches and notify the user
  //     const unseenMatches = matches.filter((match) => !match.matchHasBeenSeen);
  //     if (unseenMatches.length > 0) {
  //       // Send push notification
  //       notificationManager.sendPushNotification(
  //         unseenMatches[0],
  //         IMLocalized('New match!'),
  //         IMLocalized('You just got a new match!'),
  //         'dating_match',
  //         { fromUser: user },
  //       );
  //       setCurrentMatchData(unseenMatches[0]);
  //     }
  //   }
  // }, [matches]);

  // useEffect(() => {
  //   if (currentMatchData) {
  //     swipeTracker.current.markSwipeAsSeen(currentMatchData, user);
  //     //setShowMode(2);
  //   }
  // }, [currentMatchData]);

  useEffect(() => {
    if (recommendations.length === 0 && swipes) {
      getMoreRecommendationsIfNeeded();
    }
  }, [swipes, recommendations]);

  const getUserSwipeCount = async () => {
    const userID = user.id || user.userID;

    const swipeCountInfo = await swipeTracker.current.getUserSwipeCount(userID);

    if (swipeCountInfo) {
      swipeCountDetail.current = swipeCountInfo;
    } else {
      resetSwipeCountDetail();
    }

    getCanUserSwipe(false);
  };

  const resetSwipeCountDetail = () => {
    swipeCountDetail.current = {
      count: 0,
      createdAt: {
        seconds: Date.now() / 1000,
      },
    };
  };

  const updateSwipeCountDetail = () => {
    const userID = user.id || user.userID;

    swipeTracker.current.updateUserSwipeCount(
      userID,
      swipeCountDetail.current.count,
    );
  };

  const getCanUserSwipe = (shouldUpdate = true) => {
    // if (swipeTimeDifference > oneDay) {
    //   resetSwipeCountDetail();
    //   updateSwipeCountDetail();

    //   return true;
    // }

    if (swipeCountDetail.current.count < DatingConfig.dailySwipeLimit) {
      if (shouldUpdate) {
        swipeCountDetail.current.count += 1;
        updateSwipeCountDetail();
      }

      //setCanUserSwipe(true);
      return true;
    }

    if (swipeCountDetail.current.count >= DatingConfig.dailySwipeLimit) {
      setCanUserSwipe(false);
      return false;
    }
  };

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      userRef
        .update({
          isOnline: true,
        })
        .then(() => {
          dispatch(setUserData({ user: { ...user, isOnline: true } }));
        })
        .then(() => {
          setAppState(nextAppState);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      userRef
        .update({
          isOnline: false,
        })
        .then(() => {
          dispatch(setUserData({ user: { ...user, isOnline: false } }));
        })
        .then(() => {
          setAppState(nextAppState);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleNewMatchButtonTap = (likeIndex, index) => {
    setShowMode(0);
    //getMoreRecommendationsIfNeeded();

    //Check if we have reached the end of the deck
    let nextIndex = index + 1;
    if (
      numSwipesThisSession >= recommendations.length ||
      nextIndex >= recommendations.length ||
      likeIndex == 999
    ) {
      setSpeedDateMatches();
    }
  };

  const setSpeedDateMatches = async () => {
    const db = firebase.firestore();

    let allRatings = [];
    let allMatches = [];
    Object.entries(user.ratings).forEach((r) => {
      allRatings.push(r[1]);
    });
    //sort ratings by highest to lowest:
    var speedDateMatches = allRatings.sort((r1, r2) => {
      return r2.rating - r1.rating;
    });
    if (speedDateMatches.length > 2) speedDateMatches.length = 2; //get top 2
    speedDateMatches.forEach((match) => {
      allMatches.push(match.botUserId);
    });
    // add these matches to the user collection
    updateDoc('users', user.id, { matches: allMatches });

    var firstMatchName;
    var firstMatchURL;
    var secondMatchName;
    var secondMatchURL;

    let matchOne = '';
    let matchTwo = '';
    // if (allMatches.length <= 0) {
    //   //user didn't swipe right on anyone. Populate a bot for the speed dates.
    //   matchOne = recommendations[0].id;
    //   matchTwo = recommendations[1].id;
    // } else if (allMatches.length <= 1) {
    //   //user only swiped right on one. Populate a bot for the second speed date.
    //   matchOne = allMatches[0];
    //   matchTwo =
    //     recommendations[0].id != allMatches[0]
    //       ? recommendations[0].id
    //       : recommendations[1].id;
    if (allMatches.length < 2) {
      //if user liked less than 2 people, show the following message:
      alert('Please see your nearst admin for help.');
    } else {
      matchOne = allMatches[0];
      matchTwo = allMatches[1];
    }

    // get name and profilePicture of first and second date
    let firstMatchDoc = db.collection('users').doc(matchOne);
    let firstMatch = await firstMatchDoc.get();
    if (firstMatch.exists) {
      firstMatchName = firstMatch.data().firstName;
      firstMatchURL = firstMatch.data().profilePictureURL;
      console.log(
        'first match id, name and url',
        matchOne,
        firstMatchName,
        firstMatchURL,
      );
      dispatch(setDateOne(matchOne, firstMatchName, firstMatchURL));
    }
    let secondMatchDoc = db.collection('users').doc(matchTwo);
    let secondMatch = await secondMatchDoc.get();
    if (secondMatch.exists) {
      secondMatchName = secondMatch.data().firstName;
      secondMatchURL = secondMatch.data().profilePictureURL;
      console.log(
        'second match id, name and url',
        matchTwo,
        secondMatchName,
        secondMatchURL,
      );
      dispatch(setDateTwo(matchTwo, secondMatchName, secondMatchURL));
    }

    //show mode 3 will redirect us to pre-date questions
    setShowMode(3);
  };

  /*
   ** Returns null if otherUser is not compatible with the search filters of the current user
   ** Otherwise, it appends the distance property to the otherUser object.
   */
  // const hydratedValidRecommendation = (otherUser) => {
  //   if (otherUser.role && otherUser.role.toLowerCase() == 'bot') {
  //     //const myLocation = user.location;
  //     const myAgePref = user.ProfileSection2.PreferredAgeGroup;
  //     //potential preferred age values: '18-23', '24-29', 'No preference'
  //     let isAgeCompatible = false;
  //     if (myAgePref == 'No preference') {
  //       isAgeCompatible = true;
  //     } else {
  //       const age = parseInt(otherUser.age);
  //       if (myAgePref == '18-23' && age >= 18 && age <= 23) {
  //         isAgeCompatible = true;
  //       } else if (myAgePref == '24-29' && age >= 24 && age <= 29) {
  //         isAgeCompatible = true;
  //       }
  //     }
  //     const { firstName, email, phone, profilePictureURL, id } = otherUser;
  //     const defaultAvatar =
  //       'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';
  //     const isNotCurrentUser = id != user.id;
  //     //const hasNotBeenBlockedByCurrentUser = bannedUserIDs != null && !bannedUserIDs.includes(id);
  //     //const hasPreviouslyNotBeenSwiped = swipes != null && !swipes.find((user) => user.id == id);

  //     if (
  //       firstName &&
  //       firstName.length > 0 &&
  //       //(email || phone) &&
  //       profilePictureURL &&
  //       profilePictureURL != defaultAvatar &&
  //       isNotCurrentUser &&
  //       //hasPreviouslyNotBeenSwiped &&
  //       //hasNotBeenBlockedByCurrentUser &&
  //       isAgeCompatible
  //     ) {
  //       console.log(
  //         `User Match ID: ${id} - Name: ${firstName} - Age: ${otherUser.age}`,
  //       );
  //       otherUser.distance = IMLocalized('> 100 miles away');
  //       return otherUser;
  //     }
  //   }
  //   return null;
  // };

  const getMoreRecommendationsIfNeeded = async () => {
    if (isLoadingRecommendations.current || hasConsumedRecommendationsStream) {
      return;
    }

    isLoadingRecommendations.current = true;

    try {
      const documentSnapshots = await recommendationRef.current.get();
      const docs = documentSnapshots.docs;

      if (docs.length > 0) {
        // Get the last visible recommendation document and construct a new query starting at this document,
        recommendationRef.current = usersRef
          .orderBy('id', 'desc')
          .startAfter(documentSnapshots.docs[docs.length - 1]);
        //.limit(recommendationBatchLimit);

        // Filter out invalid recommendations and update the UI data source
        const newRecommendations = filteredAndHydratedRecommendations(docs);

        isLoadingRecommendations.current = false;

        if (newRecommendations.length > 0) {
          setRecommendations([...recommendations, ...newRecommendations]);
        } else {
          getMoreRecommendationsIfNeeded();
        }
      } else {
        isLoadingRecommendations.current = false;
        setHasConsumedRecommendationsStream(true);
      }
    } catch (error) {
      console.log(error);
      alert(error);

      //if error relates to 'PreferredAgeGroup' not being found, the user hasn't completed their profile setup. Redirect them.
      if (error.message.includes('PreferredAgeGroup')) {
        props.navigation.navigate('ProfilePictureSelectScreen', {
          appStyles: DynamicAppStyles,
        });
      }
      isLoadingRecommendations.current = false;
    }
  };

  const filteredAndHydratedRecommendations = (docs) => {
    //potential preferred age values: '18-23', '24-29', 'No preference'
    const myAgePref = user.ProfileSection2.PreferredAgeGroup;
    let youngerCount = 0;
    let olderCount = 0;
    const hydratedRecommendations = docs.map((doc) => {
      var thisUser = doc.data();
      const age = parseInt(thisUser.age);

      if (
        thisUser.role &&
        thisUser.role.toLowerCase() == 'bot' &&
        thisUser.profilePictureURL &&
        !thisUser.profilePictureURL.includes('empty-avatar')
      ) {
        if (myAgePref == 'No preference') {
          //make sure there are no more than 30 from each age group
          if (age >= 18 && age <= 23 && youngerCount < 30) {
            youngerCount++;
            return thisUser;
          } else if (age >= 24 && age <= 29 && olderCount < 30) {
            olderCount++;
            return thisUser;
          }
        } else if (
          (myAgePref == '18-23' && age >= 18 && age <= 23) ||
          (myAgePref == '24-29' && age >= 24 && age <= 29)
        ) {
          return thisUser;
        }
      }
      return null;
    });
    return hydratedRecommendations
      .filter((recommendation) => recommendation != null)
      .slice(0, 60); //take only the first 60
  };

  const onSwipe = (type, index, swipeItem) => {
    getCanUserSwipe();
    let numSwipes = numSwipesThisSession + 1;
    setNumSwipesThisSession(numSwipes);

    if (swipeItem) {
      swipeTracker.current.addSwipe(user, swipeItem, type, (response) => {});
    }

    if (type == 'like') {
      setNewMatchIndex(index);
      setShowMode(2); //shows NewMatch (star rating screen)
    } else {
      //'dislike'
      //won't be rendering the NewMatch component, so perform this check here:
      let nextIndex = index + 1;
      if (
        numSwipes >= recommendations.length ||
        nextIndex >= recommendations.length
      ) {
        setSpeedDateMatches();
      }
    }
  };

  const goToPreDateQs = (currentId) => {
    //save updated user data to database
    updateDoc('users', user.id, user);

    let isSafeFirst = true;
    if (user.dateType == 'risky-safe') {
      isSafeFirst = false;
    }
    dispatch(setDateOrder(isSafeFirst));

    props.navigation.replace('PreDate');

    setShowMode(0);
  };

  const onAllCardsSwiped = (likeIndex) => {
    handleNewMatchButtonTap(likeIndex, 999);
  };

  const saveRatingData = (data) => {
    let updatedRatings = { ...user.ratings, [data.botFirstName]: data };
    let updatedUser = {
      ...user,
      ratings: updatedRatings,
    };

    updateDoc('users', props.user.id, {
      ratings: updatedRatings,
    });

    setUser(updatedUser);
  };
  // const shouldAlertCanUndo = async () => {
  //   const isUserAware = await getUserAwareCanUndoAsync();

  //   if (isUserAware) {
  //     userAwareCanUndo.current = true;

  //     return;
  //   }
  //   userAwareCanUndo.current = true;
  // };

  const renderEmptyState = () => {
    return <NoMoreCard profilePictureURL={user.profilePictureURL} />;
  };

  const renderNewMatch = (botUser, likeIndex) => {
    return (
      <View>
        <NewMatch
          matchedUser={botUser}
          url={botUser.profilePictureURL}
          saveRatingData={saveRatingData}
          onKeepSwiping={() =>
            handleNewMatchButtonTap(likeIndex, newMatchIndex)
          }
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.container}>
          {(recommendations.length > 0 || hasConsumedRecommendationsStream) && (
            <Deck
              data={recommendations}
              setShowMode={setShowMode}
              onSwipe={onSwipe}
              showMode={showMode}
              onAllCardsSwiped={onAllCardsSwiped}
              //isPlanActive={isPlanActive}
              setSubscriptionVisible={setSubscriptionVisible}
              renderEmptyState={renderEmptyState}
              renderNewMatch={renderNewMatch}
              newMatchIndex={newMatchIndex}
              //canUserSwipe={canUserSwipe}
              goToPreDateQs={goToPreDateQs}
            />
          )}
          <ActivityModal
            loading={
              !hasConsumedRecommendationsStream && recommendations.length === 0
            }
            title={IMLocalized('Please wait')}
            size={'large'}
            activityColor={'white'}
            titleColor={'white'}
            activityWrapperStyle={{
              backgroundColor: '#404040',
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

SwipeScreen.navigationOptions = ({ screenProps, navigation }) => {
  let currentTheme = DynamicAppStyles.navThemeConstants[screenProps.theme];
  return {
    headerTitle: (
      <TNTouchableIcon
        imageStyle={{
          tintColor:
            DynamicAppStyles.colorSet[screenProps.theme]
              .mainThemeForegroundColor,
        }}
        iconSource={DynamicAppStyles.iconSet.fireIcon}
        onPress={() =>
          //navigation.navigate('MainStack', { appStyles: DynamicAppStyles })
          alert('This feature is not available in BETA version.')
        }
        appStyles={DynamicAppStyles}
      />
    ),
    headerRight: (
      <TNTouchableIcon
        imageStyle={{ tintColor: '#d1d7df' }}
        iconSource={DynamicAppStyles.iconSet.conversations}
        onPress={
          () =>
            // onLogout()
            // navigation.navigate('Conversations', { appStyles: DynamicAppStyles })
            navigation.replace('PreDate')
          //alert('This feature is not available in BETA version.')
        }
        appStyles={DynamicAppStyles}
      />
    ),
    headerLeft: (
      <TNTouchableIcon
        imageStyle={{ tintColor: '#d1d7df' }}
        iconSource={DynamicAppStyles.iconSet.userProfile}
        onPress={() =>
          //RACHEL TEMP for testing. This will be replaced with the alert before a release.
          //navigation.navigate('ProfilePictureSelectScreen', {
          //  appStyles: DynamicAppStyles,
          //})
          alert('This feature is not available in BETA version.')
        }
        appStyles={DynamicAppStyles}
      />
    ),
    headerStyle: {
      backgroundColor: currentTheme.backgroundColor,
      borderBottomWidth: 0,
    },
    headerTintColor: currentTheme.fontColor,
  };
};

//'https://pbs.twimg.com/profile_images/681369932207013888/CHESpTzF.jpg'

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

export default connect(mapStateToProps)(SwipeScreen);
