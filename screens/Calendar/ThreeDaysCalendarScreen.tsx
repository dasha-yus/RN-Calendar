import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";

import Colors from "../../constants/colors";

export const events: any[] = [
  { date: new Date(2025, 0, 2, 12, 30, 0), title: "Event", duration: 1 },
  {
    date: new Date(2025, 0, 2, 14, 20, 0),
    title: "Another test",
    duration: 2,
  },
  { date: new Date(2025, 0, 2, 14, 0, 0), title: "Test", duration: 1 },
  { date: new Date(2025, 0, 4, 12, 30, 0), title: "Event-2", duration: 1 },
];

const ThreeDaysCalendarScreen = ({ route }: any) => {
  const now = new Date();

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
    endDate.setDate(startDate.getDate() + 2);

    const isDiffYear = startDate.getFullYear() !== endDate.getFullYear();
    const datesInterval = `${formatDate(startDate, isDiffYear)} - ${formatDate(
      endDate,
      isDiffYear
    )}`;
    setFormattedDate(datesInterval);
  }, [day, month, year]);

  const formatDate = (date: Date, withYear: boolean = false) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: withYear ? "numeric" : undefined,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handlePrevThreeDays = () => {
    const prevDate = new Date(year, month, day - 3);
    setDay(prevDate.getDate());
    setMonth(prevDate.getMonth());
    setYear(prevDate.getFullYear());
  };

  const handleNextThreeDays = () => {
    const nextDate = new Date(year, month, day + 3);
    setDay(nextDate.getDate());
    setMonth(nextDate.getMonth());
    setYear(nextDate.getFullYear());
  };

  const renderEvents = (hour: number) => {
    return (
      <View style={styles.eventColumn}>
        {events
          .filter(
            (event) =>
              new Date(event.date).getDate() === day &&
              new Date(event.date).getHours() === hour
          )
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .map((event, idx) => (
            <Pressable
              key={idx}
              style={({ pressed }) => pressed && styles.pressed}
              onPress={onEventSelected}
            >
              <View
                style={[styles.eventContainer, { height: 32 * event.duration }]}
              >
                <Text
                  style={styles.eventText}
                  numberOfLines={event.duration > 1 ? 2 : 1}
                >
                  {event.title}
                </Text>
              </View>
            </Pressable>
          ))}
      </View>
    );
  };

  const onEventSelected = () => {};

  const renderHours = () => {
    return (
      <ScrollView style={styles.scrollView} ref={scrollViewRef}>
        {Array.from({ length: 24 }, (_, index) => (
          <View key={index} style={styles.hourContainer}>
            <Text style={styles.hourText}>
              {index.toString().length === 1 ? `0${index}` : index}:00
            </Text>
            <View style={styles.eventsWrapper}>
              {renderEvents(index)}
              {renderEvents(index)}
              {renderEvents(index)}
            </View>
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
        {Array.from({ length: 3 }, (_, index) => (
          <View
            key={index}
            style={[styles.line, { right: `${28 * (index + 1)}%` }]}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <GestureRecognizer
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80,
        }}
        onSwipeLeft={handleNextThreeDays}
        onSwipeRight={handlePrevThreeDays}
        style={styles.root}
      >
        <Text style={styles.title}>{formattedDate}</Text>
        {renderHours()}
      </GestureRecognizer>
    </View>
  );
};

export default ThreeDaysCalendarScreen;

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
    fontSize: 16,
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
    width: "28%",
    padding: 4,
  },
  eventContainer: {
    backgroundColor: Colors.primary,
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
