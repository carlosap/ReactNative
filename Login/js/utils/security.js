/**
 * Security and authentication related helper methods
 */
import axios from 'axios';
import Storage from './storage';
const LOGIN_KEY = "loginData";
/**
 * Save Authentication Data to Local Storage and Set Header
 * @param data
 * @returns {boolean}
 */
export function saveAuthData(data) {

    return Storage.save({
        key: LOGIN_KEY,
        value: {
            data : data
        }
    })
}
/**
 * Get Authentication Data from Local Storage and Set Header
 * @param data
 * @returns {boolean}
 */
export function getAuthData() {
    return Storage.load({
        key : LOGIN_KEY
    }).then((data)=>{
        return data.data;
    });
}
/**
 * Remove Authentication Data from Local Storage and Set Header
 * @param data
 * @returns {boolean}
 */
export function removeAuthData() {
    return Storage.remove(LOGIN_KEY)
}
