import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";

import Colors from "../../constants/colors";
import { useSelector } from "react-redux";
import { Event, EventsState } from "../../store/reducers/events";

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const DayCalendarScreen = ({ route, navigation }: any) => {
  const now = new Date();

  const { events } = useSelector(
    (state: { events: EventsState }) => state.events
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
    const dayNow = route.params ? route.params.day : now.getDate();
    const monthNow = route.params ? route.params.month : now.getMonth();
    const yearNow = route.params ? route.params.year : now.getFullYear();

    const date = new Date(yearNow, monthNow, dayNow).toLocaleDateString(
      "en-US",
      dateOptions
    );
    setFormattedDate(date);

    setDay(dayNow);
    setMonth(monthNow);
    setYear(yearNow);
  }, [route.params]);

  useEffect(() => {
    const date = new Date(year, month, day).toLocaleDateString(
      "en-US",
      dateOptions
    );
    setFormattedDate(date);
  }, [day, month, year]);

  const handlePrevDay = () => {
    const prevDate = new Date(year, month, day - 1);
    setDay(prevDate.getDate());
    setMonth(prevDate.getMonth());
    setYear(prevDate.getFullYear());
  };

  const handleNextDay = () => {
    const nextDate = new Date(year, month, day + 1);
    setDay(nextDate.getDate());
    setMonth(nextDate.getMonth());
    setYear(nextDate.getFullYear());
  };

  const onEventSelected = (id: string) => {
    navigation.navigate("AddEventStack", {
      screen: "AddEvent",
      params: { eventId: id },
    });
  };

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
                  new Date(event.dateStart).getDate() === day &&
                  new Date(event.dateStart).getHours() === index
              )
              .sort(
                (a, b) =>
                  new Date(a.dateStart).getTime() -
                  new Date(b.dateStart).getTime()
              )
              .map((event) => (
                <Pressable
                  key={event.id}
                  style={({ pressed }) => pressed && styles.pressed}
                  onPress={() => onEventSelected(event.id)}
                >
                  <View
                    style={[
                      styles.eventContainer,
                      {
                        // height: 32 * event.duration,
                        height: 32,
                        backgroundColor: event.color,
                      },
                    ]}
                  >
                    <Text
                      style={styles.eventText}
                      // numberOfLines={event.duration > 1 ? 2 : 1}
                      numberOfLines={1}
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

  return (
    <View style={styles.container}>
      <GestureRecognizer
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80,
        }}
        onSwipeLeft={handleNextDay}
        onSwipeRight={handlePrevDay}
        style={styles.root}
      >
        <Text style={styles.title}>{formattedDate}</Text>
        {renderHours()}
      </GestureRecognizer>
    </View>
  );
};

export default DayCalendarScreen;

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
  eventContainer: {
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
