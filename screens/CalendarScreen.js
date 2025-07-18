import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Calendar } from "react-native-calendars";


export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    
    <View style={styles.container}>
      <View style={styles.calendarWrapper}>
        <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#43a047" },
          }}
          theme={{
            selectedDayBackgroundColor: "#43a047",
            todayTextColor: "#43a047",
            arrowColor: "#43a047",
          }}
        />
      </View>

      <View style={styles.footer}>
        <Image
          source={require("../assets/images/calendario.png")}
          style={styles.footerImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#020381",
    justifyContent: "space-between",
  },
  calendarWrapper: {
    opacity: 0.9,
    transform: [{ scale: 0.8 }],
  },
  footer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  footerImage: {
    width: 350,
    height: 300,
    opacity: 0.9,
  },
});
