import firebase from 'firebase';

/**
 * Get Custom RecaptchaApplicationVerifier in order
 * to support Recaptcha Verification
 * @param token
 * @returns {ApplicationVerifier}
 */
export function getRecaptchaApplicationVerifier(token){
    let ApplicationVerifier = function (token) {
        this.type = "recaptcha";
        this.verify = () => {
            return new firebase.Promise.resolve(token);
        }
    };
    ApplicationVerifier.prototype = firebase.auth.ApplicationVerifier;
    return new ApplicationVerifier(token);
}
