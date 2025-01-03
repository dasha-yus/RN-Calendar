import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";

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

const DayCalendarScreen = ({ route }: any) => {
  const now = new Date();
  const { day, month, year } = route.params || {
    day: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
  };

  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());

  const scrollViewRef = useRef<any>(null);
  const targetRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
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

  const onEventSelected = () => {};

  const renderHours = () => {
    return (
      <ScrollView style={styles.scrollView} ref={scrollViewRef}>
        {Array.from({ length: 24 }, (_, index) => (
          <View key={index} style={styles.hourContainer}>
            <Text style={styles.hourText}>
              {index.toString().length === 1 ? `0${index}` : index}:00
            </Text>
            {events
              .filter(
                (event) =>
                  new Date(event.date).getDate() === day &&
                  new Date(event.date).getHours() === index
              )
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((event, idx) => (
                <Pressable
                  key={idx}
                  style={({ pressed }) => pressed && styles.pressed}
                  onPress={onEventSelected}
                >
                  <View
                    style={[
                      styles.eventContainer,
                      { height: 32 * event.duration },
                    ]}
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
      </ScrollView>
    );
  };

  const options: any = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = new Date(year, month, day).toLocaleDateString(
    "en-US",
    options
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formattedDate}</Text>
      {renderHours()}
    </View>
  );
};

export default DayCalendarScreen;

const styles = StyleSheet.create({
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
  eventContainer: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 4,
    width: "85%",
    alignSelf: "flex-end",
  },
  eventText: {
    color: "#fff",
  },
  pressed: {
    opacity: 0.9,
  },
});
