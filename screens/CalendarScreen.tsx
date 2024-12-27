import { useLayoutEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import IconButton from "../components/IconButton";
import Colors from "../constants/colors";

const { width, height } = Dimensions.get("window");

const CalendarScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0);

  useLayoutEffect(() => {
    const daysInCurrentMonth = new Date(
      selectedYear,
      selectedMonth + 1,
      0
    ).getDate();
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

    setDaysInMonth(Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1));
    setFirstDayOfWeek(firstDay);
  }, [selectedMonth, selectedYear]);

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <View style={styles.row}>
        {days.map((day) => (
          <Text key={day} style={styles.dayHeader}>
            {day}
          </Text>
        ))}
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

  const renderDates = () => {
    const now = new Date();
    const isCurrentMonthYearSelected =
      now.getFullYear() === selectedYear && now.getMonth() === selectedMonth;

    const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => (
      <View key={`empty-${i}`} style={styles.emptyDay} />
    ));

    const dateCells = daysInMonth.map((date) => (
      <Text
        key={date}
        style={
          date === now.getDate() && isCurrentMonthYearSelected
            ? [styles.dateCell, styles.dateNow]
            : styles.dateCell
        }
      >
        {date}
      </Text>
    ));

    return (
      <View style={styles.grid}>
        {emptyDays}
        {dateCells}
      </View>
    );
  };

  const options: any = { year: "numeric", month: "long" };
  const formattedDate = new Date(
    selectedYear,
    selectedMonth,
    1
  ).toLocaleDateString("en-US", options);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-back" onPress={handlePrevMonth} />
        <Text style={styles.title}>{formattedDate}</Text>
        <IconButton icon="arrow-forward" onPress={handleNextMonth} />
      </View>
      {renderDays()}
      {renderDates()}
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
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
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    height: height / 7,
  },
  dateNow: {
    backgroundColor: Colors.secondary100,
  },
  emptyDay: {
    width: "14.28%",
  },
});
