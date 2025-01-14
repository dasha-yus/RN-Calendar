import * as Notifications from "expo-notifications";

import { Event } from "../store/reducers/events";

export const scheduleEventNotifications = async (event: Partial<Event>) => {
  const eventTime = new Date(event.dateStart!);
  const notificationsArray = event.notifications;

  if (!notificationsArray) {
    return;
  }

  for (const minutes of notificationsArray) {
    const notificationTime = new Date(eventTime.getTime() - minutes * 60000); // Convert minutes to milliseconds

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Event Reminder",
        body: `Your event "${event.title}" is coming up in ${minutes} minutes!`,
        data: {
          eventId: event.id,
        },
      },
      trigger: notificationTime,
    });
  }
};
