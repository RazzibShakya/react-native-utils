import { UserType } from './Login/Auth.type';
const auths: { [key: string]: UserType } = {

}

export function getAuth(type: UserType) {
  return auths[type];
}