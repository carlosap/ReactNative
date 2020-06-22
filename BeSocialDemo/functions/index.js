const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const _ = require("lodash");

admin.initializeApp(functions.config().firebase);
const database = admin.database();
const storage = admin.storage();

//TODO
//firebase functions:config:set stripe.testkey="SECRET_STRIPE_KEY"
//firebase functions:config:get
//firebase deploy --only functions
const stripe = require("stripe")(functions.config().stripe.testkey);

// dependancy for google storage and image optimize
const isImage = require("is-image");
const mkdirpPromise = require("mkdirp-promise");
const os = require("os");
const fs = require("fs");
const path = require("path");
const spawn = require("child-process-promise").spawn;

// Expired - Constants
const MAX_NOTIFICATION_DAYS = 30;

//Date Objects- inputs are timeticks vs. current date
const getDateDiff = {
  inHours: function(d1Time) {
    var date2 = new Date();
    var utc_timestamp = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate(),
      date2.getHours(),
      date2.getMinutes(),
      date2.getSeconds(),
      date2.getMilliseconds()
    );
    //var timeDiff = Math.abs(utc_timestamp - d1Time);
    var timeDiff = d1Time - utc_timestamp;
    var hourDiff = Math.ceil(timeDiff / (1000 * 60 * 60));
    return hourDiff;
  },

  inDays: function(d1Time) {
    var date2 = new Date();
    var timeDiff = Math.abs(date2.getTime() - d1Time);
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  },

  inWeeks: function(d1Time) {
    var date2 = new Date();
    var timeDiff = Math.abs(date2.getTime() - d1Time);
    var diffWeeks = Math.ceil(timeDiff / (24 * 3600 * 1000 * 7));
    return diffWeeks;
  }
};

//send the push notification (onCreate, onUpdate, onDelete, onWrite)
exports.sendPushNotification = functions.database
  .ref("notifications/{id}")
  .onWrite(event => {
    let title,
      description,
      icon,
      imageurl,
      navigateto,
      areacodes,
      dateofevent = "";
    let msg = {};
    let messages = [];

    // 1- make sure we only keep new messages.
    for (key in event.before) {
      if (!event.before.hasOwnProperty(key)) continue;

      if (!_.isNull(event.before[key])) {
        // title
        if (!_.isUndefined(event.before[key].title)) {
          title = event.before[key].title;
        }
        // description
        if (!_.isUndefined(event.before[key].description)) {
          description = event.before[key].description;
        }
      }
    }

    if (!_.isEmpty(title) || !_.isEmpty(description)) {
      console.log(
        "Existing Notification was detected. This was an update. We will not send any notificaiton. Notifications are only send when they are new"
      );
      return null;
    }

    // 2- (cleanse)make sure we have good data
    for (key in event.after) {
      if (!event.after.hasOwnProperty(key)) continue;

      if (!_.isNull(event.after[key])) {
        // title
        if (!_.isUndefined(event.after[key].title)) {
          title = event.after[key].title;
        }
        // description
        if (!_.isUndefined(event.after[key].description)) {
          description = event.after[key].description;
        }
        // icon
        if (!_.isUndefined(event.after[key].icon)) {
          icon = event.after[key].icon;
        }
        // image url
        if (!_.isUndefined(event.after[key].imageurl)) {
          imageurl = event.after[key].imageurl;
        }
        // navigate to url
        if (!_.isUndefined(event.after[key].navigateto)) {
          navigateto = event.after[key].navigateto;
        }
        // date of event <string>
        if (!_.isUndefined(event.after[key].dateofevent)) {
          dateofevent = event.after[key].dateofevent;
        }
        // date of areacodes <string>
        if (!_.isUndefined(event.after[key].areacodes)) {
          areacodes = event.after[key].areacodes;
        }
      }
    }

    // Require inorder to proceed with notification
    if (_.isEmpty(title) || _.isEmpty(description)) {
      console.log("Message is incomplete. No Mssages were sent to users");
      return null;
    }

    // 3- Send the msg to all valid users
    msg.title = title;
    msg.description = description;
    msg.icon = icon;
    msg.dateofevent = dateofevent;
    msg.navigateto = navigateto;
    msg.imageurl = imageurl;
    msg.datecreated = Date.now();

    //areacode
    let areaCodeList = [];
    let areaCodeSize = 0;
    if(areacodes.includes(',')) {
      areaCodeList = areacodes.split(',');
      areaCodeSize = areaCodeList.length;
    }

    return database
      .ref("users")
      .once("value")
      .then(function(snapshot) {
        console.log("New Message: " + JSON.stringify(msg));
        let tempTokens = [];
        snapshot.forEach(function(childSnapshot) {
          const id = childSnapshot.val().id;
          const isActive = childSnapshot.val().isActive;
          const expoToken = childSnapshot.val().token;
          const email = childSnapshot.val().email;
          const enablenotificaiton = childSnapshot.val().enablenotificaiton;
          const areacode = childSnapshot.val().areacode;
          notifications = childSnapshot.val().notifications;

          // prevent duplicate entries. Fix me bug reported #68
          //if (tempTokens.indexOf(expoToken) === -1) {
          if (tempTokens.indexOf(email) === -1) {
            tempTokens.push(email);
            if (_.isBoolean(enablenotificaiton)) {

              if (isActive && enablenotificaiton && !_.isEmpty(expoToken)) {

                //validate areacode.
                //1- Send to all users if the areacodes were blank
                if(areaCodeSize === 0) {
                  console.log(`Sending Notificaiton To All Users-> Email: [${email}]- ${expoToken}`);
                  SaveUserNotification(childSnapshot, id, msg, messages, expoToken);

                } else if (!_.isEmpty(areacode)){
                  //2- if notification has areacodes and the user does have an areacode - filter
                  //   if found send it
                  if (areaCodeList.indexOf(areacode) !== -1) {
                    console.log(`Sending Notificaiton By Area Code-> Email: [${email}] AreaCode:[${areacode}]- ${expoToken}`);
                    SaveUserNotification(childSnapshot, id, msg, messages, expoToken);
                  }

                } else{
                  //3- No notification due to areacode possibly being blank
                  console.log(`No Notificaiton Sent-> Email: [${email}] AreaCode:[${areacode}]- ${expoToken}`);
                }
              }
            }
          }
        });

        return Promise.all(messages);
      })
      .then(messages => {
        if (_.isArray(messages) && !_.isEmpty(messages)) {
          console.log("Sending Messages to Expo Server:..." + messages.length);
          fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "accept-encoding": "gzip, deflate",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(messages)
          });
        }
      })
      .catch(reason => {
        console.log(reason);
      });
  });

  function SaveUserNotification(childSnapshot, id, msg, messages, expoToken) {
    const ref = childSnapshot.ref.parent
      .child(id)
      .child("notifications")
      .push();
    ref.set({
      title: msg.title,
      description: msg.description,
      dateofevent: msg.dateofevent,
      navigateto: msg.navigateto,
      imageurl: msg.imageurl,
      isactive: true,
      datacreated: new Date().getTime()
    });
    messages.push({
      to: expoToken,
      sound: "default",
      body: msg.description,
      title: msg.title
    });
  }

//send stripe charge
exports.stripeCharge = functions.database
  .ref("/payments/{userId}/{paymentId}")
  .onWrite((change, context) => {
    const payment = change.after.val();
    const userId = context.params.userId;
    const paymentId = context.params.paymentId;

    // checks if payment exists or if it has already been charged
    if (!payment || payment.charge) return null;

    return admin
      .database()
      .ref(`/users/${userId}`)
      .once("value")
      .then(snapshot => {
        return snapshot.val();
      })
      .then( () => {
        const amount = payment.amount;
        const receipt_email = payment.userInfo.email;
        const idempotency_key = paymentId; // prevent duplicate charges
        const source = payment.token.id;
        const currency = "usd";
        let charge;

        if (receipt_email) charge = { amount, currency, source, receipt_email };
        else charge = { amount, currency, source };

        return stripe.charges.create(charge, { idempotency_key });
      })
      .then(charge => {
        admin
          .database()
          .ref(`/payments/${userId}/${paymentId}/charge`)
          .set(charge);
        return true;
      }).catch(error => {

        var errorArr = { 
          code : error.code, 
          message : error.message,
          rawType: error.rawType, 
          stack : error.stack, 
          statusCode: error.statusCode ,
          type : error.type 
        }; 

        admin
            .database()
              .ref(`/payments/${userId}/${paymentId}/error`)
              .set(JSON.parse(JSON.stringify(errorArr)));              
        
          console.error(error);
      });
  });

// optimize image
exports.optimizeImage = functions.storage.object().onFinalize(object => {
  if (!object.name) {
    console.warn(`'${object.id}' has invalid name`);
    return null;
  }

  if (!object.contentType || !object.contentType.startsWith("image/")) {
    if (!isImage(object.name)) {
      console.info(
        `'${isImage(object.name)}' - '${object.name}' is not an image`
      );
      return null;
    }
  }

  const bucket = storage.bucket(object.bucket);
  const originalFile = bucket.file(object.name);
  const tempFilePath = path.join(os.tmpdir(), object.name);
  const tempFolderPath = path.dirname(tempFilePath);
  let metadata = null;
  return originalFile
    .getMetadata()
    .then(data => {
      if (Array.isArray(data) && data.length > 0 && data[0].metadata) {
        metadata = data[0].metadata;
        if (!metadata.optimized) {
          return Promise.resolve();
        } else {
          return Promise.reject("Image has been already optimized");
        }
      } else {
        return Promise.reject("Invalid metadata response");
      }
    })
    .then(() => mkdirpPromise(tempFolderPath))
    .then(() =>
      originalFile.download({
        destination: tempFilePath
      })
    )
    .then(() => {
      console.log(`Original file downloaded to ${tempFilePath}`);
      return spawn("convert", [
        tempFilePath,
        "-strip",
        "-sampling-factor",
        "4:2:0",
        "-interlace",
        "Plane",
        "-quality",
        "85",
        tempFilePath
      ]);
    })
    .then(() => {
      console.log(`Optimized image converted at ${tempFilePath}`);
      return bucket.upload(tempFilePath, {
        destination: originalFile,
        metadata: {
          metadata: {
            ...metadata,
            optimized: true
          }
        }
      });
    })
    .then(() => {
      console.log(`Optimized image uploaded at ${originalFile.name}`);
      fs.unlinkSync(tempFilePath);
    })
    .catch(error => {
      console.error(error);
    });
});

/**
 * Run once a day at midnight, to cleanup - 'every day 00:00'
 * Run once every 5 minutes, to clean up - ''every 5 minutes'
 * Run once every 1 hours, to clean up - 'every 1 hours'
 */
exports.notificationsCleanup = functions.pubsub
  .schedule("every day 00:00")
  .onRun(async context => {
    const activeUsers = await getActiveUsers(); //retrieves all active users
    const userNotifications = await getUserNotifications(activeUsers); //user and notifications with valid datacreated
    await removeExpiredNotifications(userNotifications); //removes expired items by date
  });

exports.eventsCleanup = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async context => {
    const events = await getEvents(); //retrieves all events and proivides id props.
    await removeExpiredEvents(events); //removes all expired dates
  });

exports.syncMobileEvents = functions.pubsub
  .schedule("every 10 minutes")
  .onRun(async context => {
    const events = await getEvents(); //retrieves all events and proivides id props.
    const activeUsers = await getActiveUsers(); //retrieves all active users
    //console.log(`found number of users: ${activeUsers.length}`)
    for (let index = 0; index < activeUsers.length; index++) {
      const x = activeUsers[index];
      //console.log(`validating: ${x.val().id}`);
      if (x.val().id) {
        updateMobileEventsByUser(events, x.val())
      }
    }
});

//change me to 15 min in the future
exports.triggerBackGroundOverride = functions.pubsub
  .schedule("every 2 minutes")
  .onRun(async context => {
    //console.log('Triggering Background Process to Mobile App');
    try {
      await database.ref("backgroundtrigger").update({
        lastupdate: new Date().getTime(),
      }).then(function () {
        console.log('Executed backgroundtrigger successfully...');
      }).catch(function (error) {
        console.log("Error: firebase Executed backgroundtrigger: " + error.message);
      });
    } catch (error) {
      console.log("Error: triggerBackGroundOverride: " + error.message);
    }
  });

async function updateMobileEventsByUser(events, user) {
  if (Array.isArray(events)) {
    _.map(events, x => {
      if (x.id !== "1") {

        if(x.mobileevent || x.mobileevent === "true") {

          //compare the userid with user.id
          if(x.userid === user.id) {
            const coordinates = {
              latitude: user.coordinates.latitude,
              longitude: user.coordinates.longitude,
              latitudeDelta: user.coordinates.latitudeDelta,
              longitudeDelta: user.coordinates.longitudeDelta,
              lastupdate: new Date().getTime(),
            }
            console.log(`Updating Mobile Event with ID: ${x.id} name: ${x.title} - from user: ${user.email}`)
            updateCoordinateEvent(x.id, coordinates);
          }

        }
      }
    });
  }
}

async function updateCoordinateEvent(eventid, value) {
  if (!_.isEmpty(eventid)) {
    try {
      //console.log(`updateCoordinateEvent  ID: ${eventid} Value: ${JSON.stringify(value)}`)
      await database.ref("events").child(eventid).update({ 
        coordinates: value,
      }).then(function() {
        console.log(
          `Update Event Coordinates succeeded from UserID: ${eventid} -> ${JSON.stringify(value)}`
        );
      }).catch(function(error) {
        console.log("Error: firebase Update Event Coordinates failed: " + error.message);
      });
    } catch (error) {
      console.log("Error: updateCoordinateEvent: " + error.message);
    }
  }
}


exports.floatUserCleanup = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async context => {
    const activeUsers = await getActiveUsers(); //retrieves all active users
    await refreshLiveUsers(activeUsers); //Updates isliveuser if current time is > by 3-4 hours
  });



/**
 * Removes expired notifications (30 days >) from users
 */
async function removeExpiredNotifications(userNotifications) {
  console.log(
    `[Running]Scheduler::notificaitonCleanup::removeExpiredNotifications`
  );
  _.map(userNotifications, x => {
    if (x.notifications) {
      _.map(x.notifications, y => {
        if (y && y.datacreated) {
          const days = getDateDiff.inDays(y.datacreated);
          if (days >= MAX_NOTIFICATION_DAYS) {
            console.log(`Expired Alert- days: ${days}`);
            deleteNotification(x.userid, y.id);
          }
        }
      });
    }
  });
}

/**
 * Removes Notification Item from UserID
 */
async function deleteNotification(userid, notificationid) {
  if (!_.isEmpty(userid) && !_.isEmpty(notificationid)) {
    await database
      .ref("users")
      .child(userid)
      .child("notifications")
      .child(notificationid)
      .remove()
      .then(function() {
        console.log(
          `Notification Remove succeeded from userID: ${userid}-> NotificationID: ${notificationid}`
        );
      })
      .catch(function(error) {
        console.log("Remove Notification failed: " + error.message);
      });
  }
}



async function deleteEvent(eventid) {
  if (!_.isEmpty(eventid)) {
    await database
      .ref("events")
      .child(eventid)
      .remove()
      .then(function() {
        console.log(`Event Remove succeeded from eventID: ${eventid}`);
      })
      .catch(function(error) {
        console.log("Remove Event failed: " + error.message);
      });
  }
}

async function updateLiveUser(userid, value) {
  await database
    .ref("users")
    .child(userid)
    .update({ isliveuser: value })
    .then(function() {
      console.log(
        `Update Live User succeeded from UserID: ${userid} -> ${value}`
      );
    })
    .catch(function(error) {
      console.log("Update Live User failed: " + error.message);
    });
}

/**
 * Returns the list of all active users
 */
async function getActiveUsers(users = []) {
  results = await database.ref("users").once("value");
  results.forEach(x => {
    if (x.val().isActive) {
      users.push(x);
    }
  });
  return users;
}

/**
 * Returns the list of all events as array
 */
async function getEvents(events = []) {
  results = await database.ref("events").once("value");
  if (!_.isEmpty(results.val())) {
    events = convertObjectToArray(results.val());
  }
  return events;
}

/**
 * Returns Notifications with User's ID
 * <input> users is expected to be active users
 * See. getActiveUsers function for more details
 */
async function getUserNotifications(users) {
  let retVal = [];
  if (Array.isArray(users)) {
    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      const userID = user.val().id;
      const userNotifications = user.val().notifications || null;
      if (!_.isEmpty(userNotifications)) {
        //remove any invalid datacreated fields.
        const data = await validateUserNotificationsByDates(
          userID,
          convertObjectToArray(userNotifications)
        );

        retVal.push({ userid: userID, notifications: data });
      }
    }
  }
  return retVal;
}

async function removeExpiredEvents(events) {
  if (Array.isArray(events)) {
    _.map(events, x => {
      if (x.id !== "1") {
        if (_.isNumber(x.expirationdate || null)) {
          const hours = getDateDiff.inHours(x.expirationdate);
          if (hours <= 0) {
            console.log(
              `The EventID*: ${x.id}-> EXPIRED AT: [hours: ${hours}]`
            );
            deleteEvent(x.id);
          }
        } else {
          deleteEvent(x.id);
        }
      }
    });
  }
}

async function refreshLiveUsers(users) {
  if (Array.isArray(users)) {
    _.map(users, x => {
      if (_.isNumber(x.val().lastupdate || null)) {
        const hours = getDateDiff.inHours(x.val().lastupdate);
        if (hours <= -3 && x.val().isliveuser) {
          console.log(
            `The User LastUpdate In Hours: ${x.val().id}-> [hours: ${hours}]`
          );
          updateLiveUser(x.val().id, false);
        }
      }
    });
  }
}

/**
 * Cleanse of Elements with valid dates
 * If datacreated is not valid, it will delete the element
 */
async function validateUserNotificationsByDates(userid, notifications) {
  let retVal = [];
  retVal = _.map(notifications, el => {
    if (_.isNumber(el.datacreated)) {
      return el;
    } else {
      deleteNotification(userid, el.id);
    }
  });
  return retVal;
}

/**
 * returs an Array from a firebase obj[key-value] collection
 * @param {} obj - firebase object collection
 */
function convertObjectToArray(obj) {
  let data = [];
  for (let [key, value] of Object.entries(obj)) {
    data.push(_.extend({ id: key }, value));
  }
  return data;
}