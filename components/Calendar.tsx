import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import Colors from "../constants/colors";
import { Event, EventsState } from "../store/reducers/events";
import { getDaysDifference, getHoursDifference } from "../utils/date";
import { SettingsState } from "../store/reducers/settings";
import {
  Notification,
  NotificationsState,
} from "../store/reducers/notifications";

interface CalendarProps {
  days: number;
}

const Calendar = (props: CalendarProps) => {
  const { days } = props;
  const now = new Date();

  const navigation = useNavigation<any>();

  const { notificationsDefaultColor } = useSelector(
    (state: { settings: SettingsState }) => state.settings
  );
  const { events } = useSelector(
    (state: { events: EventsState }) => state.events
  );
  const { notifications } = useSelector(
    (state: { notifications: NotificationsState }) => state.notifications
  );

  const [day, setDay] = useState(now.getDate());
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());
  const [formattedDate, setFormattedDate] = useState("");

  const scrollViewRef = useRef<any>(null);
  const targetRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(now.getHours());
      setCurrentMinute(now.getMinutes());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Scroll to current time
    targetRef.current.measureLayout(
      scrollViewRef.current,
      (x: number, y: number) => {
        scrollViewRef.current.scrollTo({ y: y - 32, animated: true });
      },
      () => {}
    );
  }, []);

  useEffect(() => {
    const startDate = new Date(year, month, day);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (days - 1));

    const isDiffYear = startDate.getFullYear() !== endDate.getFullYear();
    const datesInterval = `${formatDate(startDate, isDiffYear)} - ${formatDate(
      endDate,
      isDiffYear
    )}`;
    setFormattedDate(datesInterval);
  }, [day, month, year, days]);

  const formatDate = (date: Date, withYear: boolean = false) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: withYear ? "numeric" : undefined,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handlePrevDays = () => {
    const prevDate = new Date(year, month, day - days);
    setDay(prevDate.getDate());
    setMonth(prevDate.getMonth());
    setYear(prevDate.getFullYear());
  };

  const handleNextDays = () => {
    const nextDate = new Date(year, month, day + days);
    setDay(nextDate.getDate());
    setMonth(nextDate.getMonth());
    setYear(nextDate.getFullYear());
  };

  const renderEvents = (hour: number) => {
    return Array.from({ length: days }, (_, index) => {
      const currentDay = day + index;
      return (
        <View
          key={index}
          style={[styles.eventColumn, { width: `${100 / (days + 1)}%` }]}
        >
          {[...events, ...notifications]
            .filter((event) => {
              const startDate =
                event.type === "event"
                  ? new Date((event as Event).dateStart)
                  : new Date((event as Notification).date);

              if (event.type === "event") {
                const endDate = new Date((event as Event).dateEnd);
                const selectedDate = new Date(year, month, currentDay);

                const diffDays = getDaysDifference(startDate, endDate);

                // If the event lasts more than a day, check if the selected date is within the range
                if (diffDays > 1) {
                  return (
                    selectedDate >= startDate &&
                    selectedDate <= endDate &&
                    startDate.getHours() === hour
                  );
                }
              }

              return (
                ((event.repeat === "none" &&
                  startDate.getDate() === currentDay) ||
                  event.repeat === "daily" ||
                  (event.repeat === "weekly" &&
                    startDate.getDay() ===
                      new Date(year, month, currentDay).getDay()) ||
                  (event.repeat === "monthly" &&
                    new Date(year, month, currentDay).getMonth() === month &&
                    startDate.getDate() === currentDay)) &&
                startDate.getHours() === hour
              );
            })
            .sort((a, b) =>
              a.type === "event"
                ? new Date((a as Event).dateStart).getTime() -
                  new Date((b as Event).dateStart).getTime()
                : 0
            )
            .map((event) => {
              const duration =
                event.type === "event"
                  ? getHoursDifference(
                      (event as Event).dateStart,
                      (event as Event).dateEnd
                    )
                  : 1;
              return (
                <Pressable
                  key={event.id}
                  style={({ pressed }) => pressed && styles.pressed}
                  onPress={() => onEventSelected(event.id, event.type)}
                >
                  <View
                    style={[
                      styles.eventContainer,
                      {
                        height:
                          32 * (duration < 1 ? 1 : duration > 4 ? 5 : duration),
                        backgroundColor:
                          event.type === "event"
                            ? (event as Event).color
                            : notificationsDefaultColor,
                      },
                    ]}
                  >
                    <Text
                      style={styles.eventText}
                      numberOfLines={
                        duration < 1 ? 1 : duration > 4 ? 5 : duration
                      }
                    >
                      {event.type === "event"
                        ? (event as Event).title
                        : (event as Notification).text}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
        </View>
      );
    });
  };

  const onEventSelected = (id: string, type: string) => {
    navigation.navigate("AddEventStack", {
      screen: "AddEvent",
      params: {
        eventId: type === "event" && id,
        notificationId: type !== "event" && id,
      },
    });
  };

  const renderHours = () => {
    return (
      <ScrollView style={styles.scrollView} ref={scrollViewRef}>
        {Array.from({ length: 24 }, (_, index) => (
          <View key={index} style={styles.hourContainer}>
            <Text
              style={[
                styles.hourText,
                { width: `${100 / (days + 1)}%`, fontSize: days > 5 ? 12 : 16 },
              ]}
            >
              {index.toString().length === 1 ? `0${index}` : index}:00
            </Text>
            <View style={styles.eventsWrapper}>{renderEvents(index)}</View>
            {index === currentHour && (
              <View
                ref={targetRef}
                style={[
                  styles.currentTimeLine,
                  { top: `${(200 * currentMinute) / 60}%` }, // 200% is the height of the whole block
                ]}
              />
            )}
          </View>
        ))}
        <View style={styles.line} />
        {Array.from({ length: days }, (_, index) => (
          <View
            key={index}
            style={[
              styles.line,
              { right: `${(100 / (days + 1)) * (index + 1)}%` },
            ]}
          />
        ))}
      </ScrollView>
    );
  };

  const dayLabels = Array.from({ length: days }, (_, index) => {
    const currentDay = new Date(year, month, day + index).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );

    return (
      <Text
        key={index}
        style={[
          styles.date,
          { width: `${100 / (days + 1)}%`, fontSize: days > 5 ? 12 : 14 },
        ]}
      >
        {currentDay}
      </Text>
    );
  });

  return (
    <View style={styles.container}>
      <GestureRecognizer
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80,
        }}
        onSwipeLeft={handleNextDays}
        onSwipeRight={handlePrevDays}
        style={styles.root}
      >
        <Text style={styles.title}>{formattedDate}</Text>
        <View style={styles.dates}>{dayLabels}</View>
        {renderHours()}
      </GestureRecognizer>
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
  },
  dates: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  date: {
    padding: 4,
    textAlign: "center",
    fontWeight: 500,
  },
  scrollView: {
    flex: 1,
  },
  hourContainer: {
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300,
    position: "relative",
    paddingVertical: 12,
  },
  hourText: {
    textAlign: "center",
  },
  currentTimeLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.secondary500,
  },
  eventsWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  eventColumn: {
    padding: 4,
  },
  eventContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 4,
    width: "100%",
  },
  eventText: {
    color: "#fff",
  },
  pressed: {
    opacity: 0.9,
  },
  line: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: Colors.gray300,
    right: 0,
  },
});
