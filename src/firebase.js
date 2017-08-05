import firebase from "firebase/app"
import fbmessaging from "firebase/messaging"
import store from "./store"
import storage from "./storageHandler"
import backend from "./backend"

const config = {
  apiKey: "AIzaSyDuTwFO6i-w95_JKnxJuASRa9scXqy0YWk",
  authDomain: "misirlou-543a9.firebaseapp.com",
  messagingSenderId: "926244061789",
}

var app, messaging

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(config)
  messaging = firebase.messaging()
} else {
  app = firebase.app()
  messaging = firebase.messaging()
}

// if the page is in the foreground, this code will be run instead
messaging.onMessage(payload => {
  if (!("Notification" in window)) {
    store.commit("snackbarNotification", "Notification: " + payload.notification.title + ". But it looks like your browser doesn't support native notifications! Please use Chrome or Firefox.")
    return
  }

  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  }

  var notification = new Notification(payload.notification.title, notificationOptions)
  notification.onclick = ev => {
    event.preventDefault() // prevent the browser from focusing the Notification's tab
    window.open(payload.notification.click_action, '_blank')
    notification.close()
  }
})

var alreadyRequested = false

export default {
  requestPermission() {
    // only request permission on first click on the notif bell
    if (alreadyRequested)
      return
    alreadyRequested = true

    messaging.requestPermission()
      .then(() => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/static/firebase-messaging-sw.js', {scope: '/static/'}).then(registration => {
            messaging.useServiceWorker(registration)
            messaging.getToken()
              .then(currentToken => {
                if (!currentToken || storage.lastFCMToken() == currentToken)
                  return

                backend.misirlou.setFCMToken(currentToken, () => {
                  storage.setFCMToken(currentToken)
                  store.commit("snackbarNotification", "Push notifications have been enabled.")
                })
              })
          })
        }
      })
      .catch(err => {
        store.commit("snackbarNotification", "Seems like you don't like notifications. That's OK, but we won't be able to send you notifications in real time :(")
      })
  }
}
