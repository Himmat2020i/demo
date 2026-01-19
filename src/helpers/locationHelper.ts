import moment from "moment";
import { Alert, Linking, Platform } from "react-native";
import { request, PERMISSIONS, check } from "react-native-permissions";
import DeviceInfo from "react-native-device-info";
import Geolocation from "react-native-geolocation-service";

let locationPermissionDenied = false;

const askForLocationPermission = () => {
  setTimeout(() => {
    Alert.alert(
      "UKTSA",
      "We need access to your location to provide better services and features in the app. Please turn on location services.",
      [
        {
          text: "Yes",
          onPress: () => {
            if (Platform.OS === "ios") {
              Linking.openURL("app-settings:");
            } else {
              Linking.openSettings();
            }
          },
        },
        { text: "No", style: "cancel" },
      ],
      { cancelable: false }
    );
  }, 500);
};

const getLocation: any = () => {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve(position?.coords);
      },
      () => {
        resolve({
          latitude: 0,
          longitude: 0,
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

export const hasLocationPermission = async () => {
  const result = await check(
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  );
  return result === "granted" || false;
};

export const permissions = async () => {
  const hasPermission = await hasLocationPermission();
  if (hasPermission) {
    return;
  }
  const locationPermission =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  request(locationPermission).then((result) => {
    if (result !== "granted" && !locationPermissionDenied) {
      locationPermissionDenied = true;
      askForLocationPermission();
      //
    }
  });
};

export const prepareHandheldPayload = async (idUser: string) => {
  const { latitude, longitude } = await getLocation();
  const payload = {
    deviceID: await DeviceInfo.getUniqueId(),
    idUser,
    event: {
      appName: DeviceInfo.getBundleId(),
      version: DeviceInfo.getVersion(),
    },
    location: {
      coordinates: [latitude, longitude],
    },
    phone: {
      currentUtc: moment.utc().format(),
      manufacturer: await DeviceInfo.getManufacturer(),
      osType: Platform.OS,
      releaseDateModel: DeviceInfo.getModel(),
      osVersion: DeviceInfo.getSystemVersion(),
      serialNumber: await DeviceInfo.getSerialNumber(),
      timeZoneOffset: new Date().getTimezoneOffset().toString(),
    },
  };

  return payload;
};
