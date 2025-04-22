import { Auth, Identity } from './Auth';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';


export class Facebook extends Auth {
  login(): Promise<Identity> {
    throw new Error('Method not implemented.');
  }

  async getIdentity(): Promise<Identity> {
    const token = await AccessToken.getCurrentAccessToken();
    if (token) return {
      id: token.userID,
      token: token.accessToken,
      profile: null,
    };

    const result = await LoginManager.logInWithPermissions(['public_profile']);
    if (result.isCancelled) throw new Error('Login operation cancelled');

    // Try again after the successful login
    return this.getIdentity();
  }

  async logout() {
    LoginManager.logOut();
  }
}
