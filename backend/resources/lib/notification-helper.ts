import type { Message } from "firebase-admin/lib/messaging/messaging-api";
import admin from "../../common/firebase";

export function sendFCMNotification(message: Message) {
  // Send the notification to a specific device token using send()
  admin
    .messaging()
    .send(message)
    .then(async (response: any) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error: any) => {
      console.log("Error sending message:", error);
      throw error;
    });
}
