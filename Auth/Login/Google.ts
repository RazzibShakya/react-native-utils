import { Auth, Identity } from "./Auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';


export class Google extends Auth {
  constructor() {
    super()
    this.init();
  }

  init() {
    try {
      GoogleSignin.configure({
        scopes: [], // what API you want to access on behalf of the user, default is email and profile
        webClientId: GOOGLE_WEB_CLIENT_ID, // '105970488742-vfun45g91q2lhca4bosu0p3likg01ice.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        hostedDomain: '', // specifies a hosted domain restriction
        loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        accountName: '', // [Android] specifies an account name on the device that should be used
        iosClientId: GOOGLE_IOS_CLIENT_ID, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        // @ts-ignore
        forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      })
    } catch (error) {
      throw new Error("Google Sign In Configuration Failed!!");
    }
  }
  async getIdentity(): Promise<Identity> {
    let user;
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.signInSilently();
      user = await GoogleSignin.getCurrentUser();
    }
    if (!user) {
      user = await GoogleSignin.signIn();
      if (!user) throw new Error('Failed to login');
    }
    return {
      id: user.user.id,
      token: user.idToken as string,
      profile: null,
    };
  }

  login(): Promise<Identity> {
    throw new Error("Method not implemented.");
  }

  async logout(): Promise<void> {
    await GoogleSignin.signOut()
  }
}