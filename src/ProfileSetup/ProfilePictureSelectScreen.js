import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import { firebase } from '../Core/firebase/config';
import { firebaseStorage } from '../Core/firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import FastImage from 'react-native-fast-image';
import ActivityModal from '../components/ActivityModal';
import DynamicAppStyles from '../DynamicAppStyles';
import { IMLocalized } from '../Core/localization/IMLocalization';
import { setUserData } from '../Core/onboarding/redux/auth';
import { TNProfilePictureSelector } from '../Core/truly-native';
import { useColorScheme } from 'react-native-appearance';
import { firebaseAuth } from '../Core/firebase';
import { Dropdown } from 'react-native-element-dropdown';
import { setTimer } from '../Core/onboarding/redux/auth';
import profileSetupStyles from './styles';

const ProfilePictureSelectScreen = (props) => {
  const defaultPictureURL =
    'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

  const [loading, setLoading] = useState(false);
  const [timerValue, setTimerValue] = useState([]); //default to 120
  const [myphotos, setMyphotos] = useState([]);
  //const { setSubscriptionVisible } = useIap();
  const photoDialogActionSheetRef = useRef(null);
  const photoUploadDialogActionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const colorScheme = useColorScheme();
  const styles = profileSetupStyles(colorScheme);
  var selectedItemIndex = -1;

  const pageStyles = {
    body: {
      width: '100%',
    },
    myPhotosView: {
      //width: '100%',
      paddingHorizontal: 12,
      //marginTop: 10,
      //marginBottom: 15,
    },
    itemView: {
      paddingVertical: 2,
      marginVertical: 2,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      marginBottom: 10,
    },
    photoTitleLabel: {
      fontWeight: '500',
      fontSize: 17,
      paddingLeft: 22,
      color: DynamicAppStyles.colorSet[colorScheme].mainTextColor,
    },
    inactiveDot: {
      backgroundColor: DynamicAppStyles.colorSet[colorScheme].grey6,
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    slideActivity: {
      height: '100%',
      width: '90%',
    },
    myPhotosItemView: {
      width: Math.floor(DynamicAppStyles.windowW * 0.24),
      height: Math.floor(DynamicAppStyles.windowW * 0.24),
      marginHorizontal: 8,
      marginVertical: 8,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'grey',
      overflow: 'hidden',
    },
    iconView: {
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoutView: {
      marginTop: 20,
      marginBottom: 50,
      marginHorizontal: 12,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: DynamicAppStyles.colorSet[colorScheme].inputBgColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: 24,
      height: 24,
    },
    textLabel: {
      fontSize: 22,
      marginTop: 20,
      marginBottom: 20,
      color: DynamicAppStyles.colorSet[colorScheme].mainTextColor,
    },
  };

  const userRef = firebase.firestore().collection('users').doc(props.user.id);

  const updatePhotos = (photos) => {
    let myUpdatePhotos = [];
    let pphotos = photos ? [...photos] : [];
    let temp = [];

    pphotos.push({ add: true });
    pphotos.map((item, index) => {
      temp.push(item);

      if (index % 6 == 5) {
        myUpdatePhotos.push(temp);
        temp = [];
      } else if (item && item.add) {
        myUpdatePhotos.push(temp);
        temp = [];
      }
    });

    setMyphotos(myUpdatePhotos);
    selectedItemIndex = -1;
  };

  useEffect(() => {
    if (props.user) {
      updatePhotos(props.user.photos);
    }

    StatusBar.setHidden(false);
  }, []);

  const onLogout = () => {
    firebaseAuth.logout();
    props.navigation.navigate('LoadScreen', { appStyles: DynamicAppStyles });
  };
  // only allow user to leave if profile is complete and there is a profile picture
  const goToProfileSetup = () => {
    if (
      props.user.profilePictureURL == '' ||
      props.user.profilePictureURL == defaultPictureURL
    )
      alert("You haven't selected a profile photo!");
    else if (timerValue == '')
      alert('Please select a time limit value before continuing');
    else {
      props.navigation.replace('PreProfileSetup', {
        appStyles: DynamicAppStyles,
      });
    }
  };
  const onSelectAddPhoto = () => {
    photoUploadDialogActionSheetRef.current.show();
  };

  const onPhotoUploadDialogDone = (index) => {
    if (index == 0) {
      onLaunchCamera();
    }

    // if (index == 1) {
    //   onOpenPhotos();
    // }
  };

  const updateUserPhotos = (uri) => {
    const { photos } = props.user;
    let pphotos = photos ? photos : [];

    pphotos.push(uri);

    const data = {
      photos: pphotos,
    };

    updateUserInfo(data);
    updatePhotos(pphotos);
  };

  const onLaunchCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
    }).then((image) => {
      startUpload(image.path, updateUserPhotos);
    });
  };

  // const onOpenPhotos = () => {
  //   ImagePicker.openPicker({
  //     cropping: false,
  //   })
  //     .then((image) => {
  //       startUpload(image.path, updateUserPhotos);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setTimeout(() => {
  //         alert(
  //           IMLocalized(
  //             'An error occurred while loading image. Please try again.',
  //           ),
  //         );
  //       }, 1000);
  //     });
  // };

  const startUpload = (source, updateUserData) => {
    setLoading(true);

    if (!source) {
      updateUserData(null);
      return;
    }

    firebaseStorage
      .uploadImage(source)
      .then(({ downloadURL }) => {
        if (downloadURL) {
          updateUserData(downloadURL);
        } else {
          // an error occurred
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const updateUserInfo = (data) => {
    const tempUser = currentUser;
    // optimistically update the UI
    dispatch(setUserData({ user: { ...currentUser, ...data } }));
    userRef
      .update(data)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        const { message } = error;
        setLoading(false);
        dispatch(setUserData({ user: { ...tempUser } }));
        console.log('upload error', error);
      });
  };

  const updateProfilePictureURL = (uri) => {
    startUpload(uri, (firestoreURL) =>
      updateUserInfo({ profilePictureURL: firestoreURL }),
    );
  };

  const onSelectDelPhoto = (index) => {
    selectedItemIndex = index;
    photoDialogActionSheetRef.current.show();
  };

  const onPhotoDialogDone = (actionSheetActionIndex) => {
    const { photos } = props.user;

    if (selectedItemIndex == -1 || selectedItemIndex >= photos.length) {
      return;
    }

    if (actionSheetActionIndex == 0) {
      if (photos) {
        photos.splice(selectedItemIndex, 1);
      }

      updateUserInfo({ photos });
      updatePhotos(photos);
    }

    if (actionSheetActionIndex == 2) {
      const photoToUpdate = photos[selectedItemIndex];
      updateUserInfo({ profilePictureURL: photoToUpdate });
    }
  };

  onChangeTimer = (item) => {
    setTimerValue(item);

    dispatch(setTimer(item.value));
  };

  const { firstName, lastName, profilePictureURL } = currentUser;
  return (
    <SafeAreaView style={{ marginLeft: 10, marginRight: 10 }}>
      <ScrollView style={pageStyles.body}>
        <View style={{ marginTop: 30 }}>
          <TNProfilePictureSelector
            setProfilePictureURL={updateProfilePictureURL}
            appStyles={DynamicAppStyles}
            profilePictureURL={profilePictureURL}
          />
        </View>
        <View>
          <Text style={[styles.header, { fontWeight: 'bold' }]}>
            {'Profile Picture Selection'}
          </Text>
          <Text style={styles.text}>
            {
              'Our associate will take several pictures of you. Then you can select your favorite\n\n'
            }
          </Text>
        </View>

        <View
          style={[
            pageStyles.myPhotosView,
            myphotos[0] && myphotos[0].length <= 3
              ? { height: 400 }
              : { height: 268 },
          ]}>
          <View style={pageStyles.itemView}>
            <Text style={pageStyles.photoTitleLabel}>
              {IMLocalized('My Photos')}
            </Text>
          </View>
          <Swiper
            removeClippedSubviews={false}
            showsButtons={false}
            loop={false}
            paginationStyle={{ top: -230, left: null, right: 0 }}
            dot={<View style={pageStyles.inactiveDot} />}
            activeDot={
              <View
                style={{
                  backgroundColor: '#a471cb',
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginLeft: 3,
                  marginRight: 3,
                  marginTop: 3,
                  marginBottom: 3,
                }}
              />
            }>
            {myphotos.map((photos, i) => (
              <View key={'photos' + i} style={pageStyles.slide}>
                <View style={pageStyles.slideActivity}>
                  <FlatList
                    horizontal={false}
                    numColumns={3}
                    data={photos}
                    scrollEnabled={false}
                    renderItem={({ item, index }) =>
                      item.add ? (
                        <TouchableOpacity
                          key={'item' + index}
                          style={[
                            pageStyles.myPhotosItemView,
                            {
                              backgroundColor:
                                DynamicAppStyles.colorSet[colorScheme]
                                  .mainThemeForegroundColor,
                            },
                          ]}
                          onPress={onSelectAddPhoto}>
                          <Icon
                            name="ios-camera"
                            size={40}
                            color={
                              DynamicAppStyles.colorSet[colorScheme]
                                .mainThemeBackgroundColor
                            }
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          key={'item' + index}
                          style={pageStyles.myPhotosItemView}
                          onPress={() => onSelectDelPhoto(i * 6 + index)}>
                          <FastImage
                            style={{ width: '100%', height: '100%' }}
                            source={{ uri: item }}
                          />
                        </TouchableOpacity>
                      )
                    }
                  />
                </View>
              </View>
            ))}
          </Swiper>
          <View>
            <Text style={styles.label}>Speed date time limit</Text>
            <Dropdown
              style={[styles.dropdown, { marginBottom: 10 }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              showsVerticalScrollIndicator={true}
              data={[
                { label: '5 seconds', value: 5 },
                { label: '90 seconds', value: 90 },
                { label: '120 seconds', value: 120 },
              ]}
              maxHeight={170}
              labelField="label"
              valueField="value"
              value={timerValue.value}
              onChange={onChangeTimer}
            />
          </View>
        </View>

        <TouchableOpacity onPress={goToProfileSetup}>
          <Text style={styles.textButton25}>All done</Text>
        </TouchableOpacity>

        <TouchableOpacity style={pageStyles.logoutView} onPress={onLogout}>
          <Text style={pageStyles.textLabel}>{IMLocalized('Logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <ActionSheet
        ref={photoDialogActionSheetRef}
        title={IMLocalized('Photo Dialog')}
        options={[
          IMLocalized('Remove Photo'),
          IMLocalized('Cancel'),
          IMLocalized('Make Profile Picture'),
        ]}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        onPress={onPhotoDialogDone}
      />
      <ActionSheet
        ref={photoUploadDialogActionSheetRef}
        title={IMLocalized('Photo Upload')}
        options={[IMLocalized('Launch Camera'), IMLocalized('Cancel')]}
        cancelButtonIndex={1}
        onPress={onPhotoUploadDialogDone}
      />
      <ActivityModal
        loading={loading}
        title={IMLocalized('Please wait')}
        size={'large'}
        activityColor={'white'}
        titleColor={'white'}
        activityWrapperStyle={{
          backgroundColor: '#404040',
        }}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ProfilePictureSelectScreen);
