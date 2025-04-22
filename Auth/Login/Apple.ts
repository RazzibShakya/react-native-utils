
import { Auth, Identity } from './Auth';
import {
  appleAuth,
  AppleRequestResponseFullName,
} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APPLE_STORAGE_KEY = 'apple_user';

function append(pre: string, post: string) {
  if (!post) return pre;
  return `${pre} ${post}`;
}

function getName(fullName: AppleRequestResponseFullName) {
  if (!fullName) return null;
  let name = fullName?.givenName || '';
  name = append(name, fullName?.middleName || '');
  name = append(name, fullName?.familyName || '');
  return name;
}

export class Apple extends Auth {
  login(): Promise<Identity> {
    throw new Error('Method not implemented.');
  }

  saveAppleProfile(profile: Identity) {
    AsyncStorage.setItem(APPLE_STORAGE_KEY, JSON.stringify(profile, null, 2));
  }

  async getAppleProfile() {
    const k = await AsyncStorage.getItem(APPLE_STORAGE_KEY);
    if (!k) return null;
    try {
      return JSON.parse(k) as Identity;
    } catch (err) {
      return null;
    }
  }

  async getIdentity(): Promise<Identity> {
    /**
     * `@invertase/react-native-apple-authentication` doesn't have sign-in silently functionality
     * so persisting the user profile when logging in from apple
     * and checking the credentialState to not show user the login modal everytime the app is opened.
     */
    const storedProfile = await this.getAppleProfile();
    if (storedProfile) {
      try {
        const credentialState = await appleAuth.getCredentialStateForUser(storedProfile.id);
        if (credentialState === appleAuth.State.AUTHORIZED) return storedProfile;
      } catch (err) {
        console.log(err);
      }
    }

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const appleProfile = {
      id: appleAuthRequestResponse.user,
      token: JSON.stringify({
        fullName: getName(appleAuthRequestResponse.fullName as AppleRequestResponseFullName),
        identityToken: appleAuthRequestResponse.identityToken,
      }),
      profile: null,
    };

    this.saveAppleProfile(appleProfile);
    return appleProfile;
  }

  async logout() {
    await this.deleteAppleProfile();
  }

  async deleteAppleProfile() {
    await AsyncStorage.removeItem(APPLE_STORAGE_KEY);
  }
}






