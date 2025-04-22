import { Authority } from './auth';
import { User } from '../user';

export class CredentialResponse {
  authenticated: boolean;
  name: string;
  authorities: Authority[];
  authToken?: string;
  userData?: User;

  static convertToObj(obj: any): CredentialResponse {
    if (obj == null) {
      return null as any;
    }

    if (obj.errorStatus !== undefined) {
      let resp = new CredentialResponse();
      resp.authenticated = false;
      return resp;
    } else {
      let resp = new CredentialResponse();
      resp.name = obj.name;
      resp.authenticated = obj.authenticated;
      resp.authorities = obj.authorities;
      resp.authToken = obj.authToken;
      resp.userData = obj.userData;
      return resp;
    }
  }

}
