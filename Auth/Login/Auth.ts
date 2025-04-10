
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = 'user123'
export type Identity = {
  id: string,
  token: string,
  profile: null | {}, // A profile is available only in case of offline authentications
};

function profileKey(id: string) {
  return `${PROFILE_KEY}-${id}`;
}

export abstract class Auth {
  abstract getIdentity(): Promise<Identity>
  abstract login(): Promise<Identity>
  abstract logout(): Promise<void>

  static async getProfile(id: string) {
    const profile = await AsyncStorage.getItem(profileKey(id));
    if (!profile) {
      console.warn('Auth::User is not found!!!!');
      return null
    };
    try {
      return JSON.parse(profile);
    } catch (error) {
      console.warn('Auth::User cannot be loaded!!!!');
      return null;
    }
  }

  static async setProfile(id: string, profile: any) {
    await AsyncStorage.setItem(profileKey(id), JSON.stringify(profile));
  }

  static async removeProfile(id: string) {
    await AsyncStorage.removeItem(profileKey(id));
  }
}