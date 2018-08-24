import Expo from 'expo';
/**
 * Check if permission is present
 * @param type
 * @returns {Promise.<*>}
 */
export async function checkPermission(type){
    const {status}=  await Expo.Permissions.getAsync(type);
    if (status !== 'granted') {
        return true;
    } else {
        return false;
    }
}

/**
 * Ask for permission
 * @param type
 * @returns {Promise.<*>}
 */
export async function askPermission(type){
    const data=  await Expo.Permissions.askAsync(type);
    return data;
}

/**
 * Check if permission is present
 * @param type
 * @returns {Promise.<*>}
 */
export async function askPermissions(types){
    types = types || [];
    let promises = [];
    types.map((type)=>{
        promises.push(Expo.Permissions.askAsync(type));
    })
    return await Promise.all(promises);
}

