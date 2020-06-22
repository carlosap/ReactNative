import _ from "lodash";
import { dbErrors, dbLogs } from "./firebase-db";
import {Platform} from "react-native";
import Constants from 'expo-constants';

export function LogError(title, error){
   try {
    const message = (!_.isString(error)) ? JSON.stringify(error) : error;
    var today  = new Date();
    dbErrors.push({
      title: title,
      message: message,
      datetime: today.toLocaleString(),
      platform : JSON.stringify(Platform),
      appVersion : Constants.manifest.version

    });
   } catch (err) {
     //console.log('global::LogError', JSON.stringify(err));
   }
  
}

export function Log(title, msg) {
  try {
    var today = new Date();
    const message = (!_.isString(msg)) ? JSON.stringify(msg) : msg;
    dbLogs.push({
      title: title,
      message: message,
      datetime: today.toLocaleString(),
      platform : JSON.stringify(Platform),
      appVersion : Constants.manifest.version
    });
  } catch (err) {
    //console.log('global::Log', JSON.stringify(err));
  }

}

export function validatedEmail(email) {
  // var pass ="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
  // let isValidPassword =/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  let isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return isValidEmail.test(email);
}

export function validatedPassword(pwd) {
  let isValidPassword = /.{6,}/;
  return isValidPassword.test(pwd);
}

export function validatedAreaCode(code) {
  //checks for exact 3 digits numbers
  let isValidAreaCode = /^[0-9]{3}$/;
  return isValidAreaCode.test(code);
}

export function validatedZip(zip) {
  let isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  return isValidZip.test(zip);
}   

export function filterArrayByString(mainArr, searchText) {
  if (searchText === '') {
    return mainArr;
  }

  searchText = searchText.toLowerCase();

  return mainArr.filter(itemObj => {
    return this.searchInObj(itemObj, searchText);
  });
};

export function searchInObj(itemObj, searchText) {
  for (const prop in itemObj) {
    if (!itemObj.hasOwnProperty(prop)) {
      continue;
    }

    const value = itemObj[prop];

    if (typeof value === 'string') {
      if (this.searchInString(value, searchText)) {
        return true;
      }
    }

    else if (Array.isArray(value)) {
      if (this.searchInArray(value, searchText)) {
        return true;
      }
    }

    if (typeof value === 'object') {
      if (this.searchInObj(value, searchText)) {
        return true;
      }
    }
  }
}

export function searchInArray(arr, searchText) {
  for (const value of arr) {
    if (typeof value === 'string') {
      if (this.searchInString(value, searchText)) {
        return true;
      }
    }

    if (typeof value === 'object') {
      if (this.searchInObj(value, searchText)) {
        return true;
      }
    }
  }
}

export function searchInString(value, searchText) {
  return value.toLowerCase().includes(searchText);
}

export function generateGUID() {
  function S4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  return S4() + S4();
}

export const HobbiesItems = [
  {
    name: 'Hobbies',
    id: 0,
    children: [
      {
        name: 'Reading',
        id: 1,
      },
      {
        name: 'Watching TV',
        id: 2,
      },
      {
        name: 'Family Time',
        id: 3,
      },
      {
        name: 'Fishing',
        id: 4,
      },
      {
        name: 'Movies',
        id: 5,
      },
      {
        name: 'Computer',
        id: 7,
      },
      {
        name: 'Gardening',
        id: 8,
      },
      {
        name: 'Exercise',
        id: 9,
      },
      {
        name: 'Music',
        id: 10,
      },
      {
        name: 'Hunting',
        id: 11,
      },
      {
        name: 'Sports',
        id: 12,
      },
      {
        name: 'Traveling',
        id: 13,
      },
      {
        name: 'Sleeping',
        id: 14,
      },
      {
        name: 'Socializing',
        id: 15,
      },
      {
        name: 'Eating',
        id: 16,
      },
      {
        name: 'Cooking',
        id: 17,
      },
      {
        name: 'Dating Online',
        id: 18,
      },
      {
        name: 'Dancing',
        id: 19,
      },
      {
        name: 'Volunteer Work',
        id: 20,
      },
    ],
  },
];