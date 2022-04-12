import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import Swiper from 'react-native-deck-swiper';
import TinderCard from './tinder_card';
import BottomTabBar from './bottom_tab_bar';
import CardDetailsView from './CardDetailsView/CardDetailsView';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Date1Intro from '../../DateAssessments/Date1Intro';
import { firebase } from '../../Core/firebase/config';
import DynamicAppStyles from '../../DynamicAppStyles';
import DatingConfig from '../../DatingConfig';
import AppStyles from '../../AppStyles';
import { exists } from 'react-native-fs';
import { app } from 'firebase';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Deck = (props) => {
  const {
    data,
    setShowMode,
    onUndoSwipe,
    onSwipe,
    showMode,
    onAllCardsSwiped,
    setSubscriptionVisible,
    renderEmptyState,
    renderNewMatch,
    goToPreDateQs,
    newMatchIndex,
  } = props;

  const useSwiper = useRef(null);
  const hasActivePlan = useRef(false);
  const currentDeckIndex = useRef(0);
  const currentLikeIndex = useRef(0);
  const currentDislikeIndex = useRef(0);

  const onDislikePressed = () => {
    useSwiper.current.swipeLeft();
    currentDislikeIndex.current++;
    currentDeckIndex.current++;
  };

  const onSuperLikePressed = () => {
    useSwiper.current.swipeTop();
  };

  const onLikePressed = () => {
    useSwiper.current.swipeRight();
    currentDeckIndex.current++;
    currentLikeIndex.current++;
    console.log('Current Like Index:');
    console.log(currentLikeIndex);
  };

  const handleSwipe = (type, index) => {
    if (index >= data.length) {
      console.log('Everyone has been swiped');
      console.log(currentLikeIndex);
      if (currentLikeIndex > 2) {
        console.log('Unreachable.');
      } else {
        console.log("You've Liked enough people");
        onSwipedAll();
      }
    }
    const currentDeckItem = data[index];

    currentDeckIndex.current = index;

    onSwipe(type, index, currentDeckItem);
  };

  const onSwipedLeft = (index) => {
    console.log('Dislike has been swiped');
    handleSwipe('dislike', index);
  };

  const onSwipedRight = (index) => {
    console.log('Like has been swiped');
    handleSwipe('like', index);
  };

  const onSwipedAll = () => {
    console.log('Everything has been swiped');

    onAllCardsSwiped(999);
  };

  const undoSwipe = () => {
    if (!hasActivePlan.current) {
      requestUpgrade();

      return;
    }

    useSwiper.current.swipeBack((index) => {
      const prevDeckItem = data[index - 1];

      currentDeckIndex.current = index;
      onUndoSwipe(prevDeckItem);
    });
  };

  const requestUpgrade = () => {
    Alert.alert(
      IMLocalized('Upgrade account'),
      IMLocalized('Upgrade your account now to undo a swipe.'),
      [
        {
          text: IMLocalized('Upgrade Now'),
          onPress: () => setSubscriptionVisible(true),
        },
        {
          text: IMLocalized('Cancel'),
        },
      ],
      { cancelable: true },
    );
  };

  const renderCard = (item) => {
    if (item) {
      return (
        <TinderCard
          key={'TinderCard' + item.id}
          url={item.profilePictureURL}
          name={item.firstName}
          age={item.age}
          //school={item.school}
          setShowMode={setShowMode}
          undoSwipe={undoSwipe}
        />
      );
    }
  };

  const renderCardDetail = (item, isDone) => {
    return (
      item && (
        <CardDetailsView
          key={'CardDetail' + item.id}
          profilePictureURL={item.profilePictureURL}
          firstName={item.firstName}
          lastName={item.lastName}
          age={item.age}
          school={item.school}
          bio={item.bio}
          instagramPhotos={item.photos ? item.photos : []}
          setShowMode={setShowMode}
          onSwipeTop={onSuperLikePressed}
          onSwipeRight={onLikePressed}
          onSwipeLeft={onDislikePressed}
          isDone={isDone}
          bottomTabBar={true}
        />
      )
    );
  };

  const renderOverlayLabel = (label, color) => {
    return (
      <View style={[styles.overlayLabel, { borderColor: color }]}>
        <Text style={[styles.overlayLabelText, { color }]}>{label}</Text>
      </View>
    );
  };

  const renderBottomTabBar = (containerStyle, buttonContainerStyle) => {
    return (
      <View style={styles.bottomTabBarContainer}>
        <BottomTabBar
          onDislikePressed={onDislikePressed}
          onSuperLikePressed={onSuperLikePressed}
          onLikePressed={onLikePressed}
          containerStyle={containerStyle}
          buttonContainerStyle={buttonContainerStyle}
        />
      </View>
    );
  };

  if (data.length === 0) {
    return <View style={styles.noMoreCards}>{renderEmptyState()}</View>;
  }

  return (
    <View style={styles.container}>
      <Swiper
        ref={useSwiper}
        animateCardOpacity={true}
        containerStyle={styles.swiperContainer}
        cards={data}
        renderCard={renderCard}
        cardIndex={0}
        backgroundColor="white"
        stackSize={2}
        verticalSwipe={false}
        horizontalSwipe={false}
        infinite={false}
        showSecondCard={true}
        animateOverlayLabelsOpacity={true}
        onSwipedRight={onSwipedRight}
        onSwipedLeft={onSwipedLeft}
        // onSwipedAll={onSwipedAll}
        swipeBackCard={true}
        overlayLabels={{
          left: {
            title: 'NOPE',
            element: renderOverlayLabel('NOPE', '#E5566D'),
            style: {
              wrapper: styles.overlayWrapper,
            },
          },
          right: {
            title: 'LIKE',
            element: renderOverlayLabel('LIKE', '#4CCC93'),
            style: {
              wrapper: {
                ...styles.overlayWrapper,
                alignItems: 'flex-start',
                marginLeft: 30,
              },
            },
          },
        }}
      />
      {renderBottomTabBar()}
      {showMode == 1 && data[currentDeckIndex.current] && (
        <Modal animationType={'slide'}>
          <View style={styles.cardDetailContainer}>
            <View style={styles.cardDetailL}>
              {renderCardDetail(data[currentDeckIndex.current])}
            </View>
          </View>
        </Modal>
      )}
      {showMode == 2 && (
        <Modal transparent={false} visible={true} animationType={'slide'}>
          <View style={styles.newMatch}>
            {renderNewMatch(data[newMatchIndex], currentLikeIndex.current)}
          </View>
        </Modal>
      )}
      {showMode == 3 && (
        <Modal transparent={false} visible={true} animationType={'slide'}>
          <View style={styles.newMatch}>
            <Date1Intro goToPreDateQs={goToPreDateQs} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlayLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  overlayLabelText: {
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
  },
  swiperContainer: {
    marginLeft: -20,
    marginTop: -Math.floor(SCREEN_HEIGHT * 0.06),
    backgroundColor: 'transparent',
  },
  overlayWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: Math.floor(SCREEN_HEIGHT * 0.04),
  },
  cardDetailContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardDetailL: {
    // position: 'absolute',
    // bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.95,
    // paddingBottom: size(100),
    backgroundColor: 'white',
  },
  bottomTabBarContainer: {
    // marginBottom: -8
    position: 'absolute',
    bottom: 0,
    width: '95%',
    alignSelf: 'center',
  },
  noMoreCards: {
    position: 'absolute',
    top: 0,
    bottom: 50,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
  },
  newMatch: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'white',
  },
});

export default Deck;
