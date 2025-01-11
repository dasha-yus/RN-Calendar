import { useLayoutEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Pressable } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";

import Colors from "../../constants/colors";
import { useSelector } from "react-redux";
import { SettingsState } from "../../store/reducers/settings";
import { EventsState } from "../../store/reducers/events";

const { height } = Dimensions.get("window");

const MonthCalendarScreen = ({ navigation }: any) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  const { firstDay } = useSelector(
    (state: { settings: SettingsState }) => state.settings
  );
  const { events } = useSelector(
    (state: { events: EventsState }) => state.events
  );

  useLayoutEffect(() => {
    const daysInCurrentMonth = new Date(
      selectedYear,
      selectedMonth + 1,
      0
    ).getDate();
    setDaysInMonth(Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1));
  }, [selectedMonth, selectedYear]);

  const renderDays = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Adjust the order of days based on firstDay value
    const adjustedDays = [...days.slice(firstDay), ...days.slice(0, firstDay)];

    return (
      <View style={styles.row}>
        {adjustedDays.map((day) => (
          <Text key={day} style={styles.dayHeader}>
            {day}
          </Text>
        ))}
      </View>
    );
  };

  const convertDayNumber = (day: number) => {
    return (day + 6) % 7;
  };

  const renderDates = () => {
    const now = new Date();
    const isCurrentMonthYearSelected =
      now.getFullYear() === selectedYear && now.getMonth() === selectedMonth;

    const firstDayInMonth = new Date(selectedYear, selectedMonth, 1).getDay(); // Sunday - Saturday : 0 - 6
    const emptyDays = Array.from(
      { length: convertDayNumber(firstDayInMonth - firstDay) },
      (_, i) => <View key={`empty-${i}`} style={styles.emptyDay} />
    );

    const dateCells = daysInMonth.map((date) => (
      <Pressable
        key={date}
        onPress={() => dateSelectHandler(date)}
        style={({ pressed }) =>
          isCurrentMonthYearSelected && date === now.getDate()
            ? [styles.dateCell, styles.dateNow, pressed && styles.pressedToday]
            : [styles.dateCell, pressed && styles.pressed]
        }
      >
        <View>
          <Text>{date}</Text>
          {events
            .filter(
              (event) =>
                isCurrentMonthYearSelected &&
                new Date(event.dateStart).getDate() === date
            )
            .sort(
              (a, b) =>
                new Date(a.dateStart).getTime() -
                new Date(b.dateStart).getTime()
            )
            .map((event, idx) => (
              <View
                key={idx}
                style={[
                  styles.eventContainer,
                  { backgroundColor: event.color },
                ]}
              >
                <Text style={styles.eventText} numberOfLines={1}>
                  {event.title}
                </Text>
              </View>
            ))}
        </View>
      </Pressable>
    ));

    return (
      <View style={styles.grid}>
        {emptyDays}
        {dateCells}
      </View>
    );
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11); // December
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0); // January
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const dateSelectHandler = (day: number) => {
    navigation.navigate({
      name: "Day",
      params: { year: selectedYear, month: selectedMonth, day },
    });
  };

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  const formattedDate = new Date(
    selectedYear,
    selectedMonth,
    1
  ).toLocaleDateString("en-US", options);

  return (
    <View style={styles.container}>
      <GestureRecognizer
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80,
        }}
        onSwipeLeft={handleNextMonth}
        onSwipeRight={handlePrevMonth}
      >
        <Text style={styles.title}>{formattedDate}</Text>
        {renderDays()}
        {renderDates()}
      </GestureRecognizer>
    </View>
  );
};

export default MonthCalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    width: "100%",
  },
  dateCell: {
    width: "14.28%", // 100% / 7 days
    textAlign: "center",
    padding: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    height: height / 7,
    overflow: "hidden",
  },
  dateNow: {
    backgroundColor: Colors.secondary100,
  },
  emptyDay: {
    width: "14.28%",
  },
  pressed: {
    backgroundColor: Colors.gray200,
  },
  pressedToday: {
    opacity: 0.75,
  },
  eventContainer: {
    padding: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  eventText: {
    color: "#fff",
    fontSize: 10,
  },
});
