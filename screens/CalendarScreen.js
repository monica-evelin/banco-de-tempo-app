import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // ajuste o caminho conforme o seu projeto

export default function CalendarScreen({ route }) {
  // Recebe o uid do usuário logado (pode vir do contexto, props, etc)
  const userId = route?.params?.uid || "usuarioPadrao";

  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState({}); // compromissos organizados por data
  const [modalVisible, setModalVisible] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Query para ouvir compromissos do usuário
    const q = query(collection(db, "compromissos"), where("uid", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userAppointments = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateObj = data.datetime.toDate();
        const dateStr = dateObj.toISOString().split("T")[0]; // yyyy-mm-dd
        const timeStr = dateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (!userAppointments[dateStr]) userAppointments[dateStr] = [];

        userAppointments[dateStr].push({
          id: doc.id,
          title: data.title,
          time: timeStr,
          descricao: data.descricao || "",
          tipo: data.tipo || "",
        });
      });

      setAppointments(userAppointments);
    });

    return () => unsubscribe();
  }, [userId]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const addAppointment = async () => {
    if (!newTitle.trim()) {
      Alert.alert("Please enter the appointment title");
      return;
    }
    if (!selectedDate) {
      Alert.alert("Please select a date first");
      return;
    }

    // Cria um Date combinando selectedDate + newTime
    const [year, month, day] = selectedDate.split("-");
    const dateTime = new Date(
      year,
      parseInt(month, 10) - 1,
      day,
      newTime.getHours(),
      newTime.getMinutes()
    );

    try {
      await addDoc(collection(db, "compromissos"), {
        uid: userId,
        title: newTitle,
        descricao: "",
        tipo: "default",
        email: "",
        telemovel: "",
        datetime: Timestamp.fromDate(dateTime),
      });

      setNewTitle("");
      setNewTime(new Date());
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error saving appointment:", error.message);
    }
  };

  // Marca os dias com compromissos no calendário
  const markedDates = Object.keys(appointments).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: "#76ff03" };
    if (date === selectedDate) {
      acc[date].selected = true;
      acc[date].selectedColor = "#43a047";
    }
    return acc;
  }, {});

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "#020381",
      }}
    >
      <View style={styles.container}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          theme={{
            backgroundColor: "#020381",
            calendarBackground: "#020381",
            textSectionTitleColor: "white",
            selectedDayBackgroundColor: "#43a047",
            selectedDayTextColor: "white",
            todayTextColor: "#43a047",
            dayTextColor: "white",
            monthTextColor: "white",
            arrowColor: "#43a047",
            disabledDayTextColor: "#555",
          }}
        />

        <View style={{ marginVertical: 10 }}>
          <Button
            title="Add Appointment"
            onPress={() => {
              if (!selectedDate) {
                Alert.alert("Please select a date first");
                return;
              }
              setModalVisible(true);
            }}
            color="#43a047"
          />
        </View>

        {selectedDate && (
          <>
            <Text style={styles.selectedDateText}>
              Appointments on {selectedDate}:
            </Text>

            <FlatList
              data={appointments[selectedDate] || []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.appointmentItem}>
                  <Text style={styles.appointmentText}>
                    {item.time} - {item.title}
                  </Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={{ color: "white", textAlign: "center" }}>
                  No appointments
                </Text>
              }
            />
          </>
        )}

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Appointment</Text>

              <TextInput
                placeholder="Title"
                value={newTitle}
                onChangeText={setNewTitle}
                style={styles.input}
              />

              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={styles.timePickerButton}
              >
                <Text style={styles.timePickerText}>
                  Time:{" "}
                  {newTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={newTime}
                  mode="time"
                  display="default"
                  onChange={(event, date) => {
                    setShowTimePicker(Platform.OS === "ios");
                    if (date) setNewTime(date);
                  }}
                />
              )}

              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  color="#d32f2f"
                />
                <Button title="Save" onPress={addAppointment} color="#43a047" />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  selectedDateText: { color: "white", fontSize: 18, marginVertical: 10 },
  appointmentItem: {
    backgroundColor: "#e1e1f8",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  appointmentText: { fontSize: 16 },
  modalBackground: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 20, marginBottom: 10, fontWeight: "bold" },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    paddingVertical: 5,
    fontSize: 16,
  },
  timePickerButton: { marginBottom: 20 },
  timePickerText: { fontSize: 16, color: "#333" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
});
