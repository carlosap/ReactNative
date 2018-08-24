/**
 * Configure all the changes related  to store
 */
import {setLanguages, addTranslation} from 'react-localize-redux';
import {supportedLanguages} from './config';
import {load} from '../../../utils/storage';
/**
 * Get Language from browser
 * @returns {*}
 */
const getLanguage = () => {
    let language = null;
    //todo : get language from client's mobile
    language = supportedLanguages[0];
    if (supportedLanguages.indexOf(language) == -1) {
        language = "en"
    }

    return language
}
/**
 * Configure localization by dispatching neccesary actions
 * @param dispatch
 */
export default function (dispatch, translations,language) {
    dispatch(setLanguages(supportedLanguages, language || getLanguage()));
    for (var key in translations) {
        dispatch(addTranslation((translations[key] || [])));
    }

}
