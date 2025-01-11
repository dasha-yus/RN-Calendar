import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/colors";
import { formatDate, getTimeIn12HourFormat } from "../../utils/date";

interface DatePickerProps {
  label: string;
  dateStart: Date;
  onStartDateChange: (date: Date) => void;
  dateEnd?: Date;
  onEndDateChange?: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  dateStart,
  onStartDateChange,
  dateEnd,
  onEndDateChange,
}) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<{
    type: "start" | "end";
    mode: "date" | "time";
  } | null>(null);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      if (mode?.type === "start") {
        onStartDateChange(selectedDate);
        if (
          dateEnd &&
          onEndDateChange &&
          selectedDate.getTime() > dateEnd.getTime()
        ) {
          const endDate = new Date(selectedDate.getTime() + 60 * 60 * 1000);
          onEndDateChange(endDate);
        }
      }
      if (mode?.type === "end" && dateEnd && onEndDateChange) {
        onEndDateChange(selectedDate || dateEnd);
      }
    }

    setShow(false);
  };

  const showDatePicker = (type: "start" | "end", mode: "date" | "time") => {
    setMode({ type, mode });
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="time" color={Colors.primary} size={20} />
        <Text style={styles.headerText}>{label}</Text>
      </View>
      {/* Date start */}
      <View style={styles.dateBox}>
        <Pressable
          style={({ pressed }) => [styles.date, pressed && styles.pressed]}
          onPress={() => showDatePicker("start", "date")}
        >
          <Text style={styles.text}>{formatDate(dateStart)}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.time, pressed && styles.pressed]}
          onPress={() => showDatePicker("start", "time")}
        >
          <Text style={[styles.timeText, styles.text]}>
            {getTimeIn12HourFormat(dateStart)}
          </Text>
        </Pressable>
      </View>
      {/* Date end */}
      {dateEnd && (
        <View style={styles.dateBox}>
          <Pressable
            style={({ pressed }) => [styles.date, pressed && styles.pressed]}
            onPress={() => showDatePicker("end", "date")}
          >
            <Text style={styles.text}>{formatDate(dateEnd)}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.time, pressed && styles.pressed]}
            onPress={() => showDatePicker("end", "time")}
          >
            <Text style={[styles.timeText, styles.text]}>
              {getTimeIn12HourFormat(dateEnd)}
            </Text>
          </Pressable>
        </View>
      )}

      {show && (
        <DateTimePicker
          value={mode?.type === "end" ? dateEnd || dateStart : dateStart}
          mode={mode?.mode}
          onChange={onChange}
          minimumDate={mode?.type === "end" ? dateStart : new Date()}
        />
      )}
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 500,
    marginTop: -1,
  },
  dateBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  date: {
    width: "70%",
  },
  time: {
    width: "30%",
  },
  timeText: {
    textAlign: "right",
  },
  text: {
    paddingVertical: 6,
    fontSize: 16,
  },
  pressed: {
    backgroundColor: Colors.gray200,
  },
});
