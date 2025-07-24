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
  Alert,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function CalendarScreen({ route }) {
  const userId = route?.params?.uid || "usuarioPadrao";

  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "compromissos"), where("uid", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userAppointments = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateObj = data.datetime.toDate();
        const dateStr = dateObj.toISOString().split("T")[0];
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

  const openEditModal = (appointment) => {
    setEditingAppointment(appointment);
    setNewTitle(appointment.title);

    const [hours, minutes] = appointment.time.split(":");
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours, 10));
    timeDate.setMinutes(parseInt(minutes, 10));
    setNewTime(timeDate);

    setModalVisible(true);
  };

  const saveAppointment = async () => {
    if (!newTitle.trim()) {
      Alert.alert("Please enter the appointment title");
      return;
    }
    if (!selectedDate) {
      Alert.alert("Please select a date first");
      return;
    }

    const [year, month, day] = selectedDate.split("-");
    const dateTime = new Date(
      year,
      parseInt(month, 10) - 1,
      day,
      newTime.getHours(),
      newTime.getMinutes()
    );

    try {
      if (editingAppointment) {
        await updateDoc(doc(db, "compromissos", editingAppointment.id), {
          title: newTitle,
          datetime: Timestamp.fromDate(dateTime),
        });
      } else {
        await addDoc(collection(db, "compromissos"), {
          uid: userId,
          title: newTitle,
          descricao: "",
          tipo: "default",
          email: "",
          telemovel: "",
          datetime: Timestamp.fromDate(dateTime),
        });
      }

      setNewTitle("");
      setNewTime(new Date());
      setEditingAppointment(null);
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error saving appointment:", error.message);
    }
  };

  const deleteAppointment = () => {
    Alert.alert(
      "Delete Appointment",
      "Are you sure you want to delete this appointment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "compromissos", editingAppointment.id));
              setNewTitle("");
              setNewTime(new Date());
              setEditingAppointment(null);
              setModalVisible(false);
            } catch (error) {
              Alert.alert("Error deleting appointment:", error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const markedDates = Object.keys(appointments).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: "#76ff03" };
    if (date === selectedDate) {
      acc[date].selected = true;
      acc[date].selectedColor = "#43a047";
    }
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={{
          uri: "https://www.transparenttextures.com/patterns/inspiration-geometry.png",
        }}
        style={styles.background}
        resizeMode="repeat"
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.container}>
            <Calendar
              onDayPress={onDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: "transparent",
                calendarBackground: "transparent",
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
                  setEditingAppointment(null);
                  setNewTitle("");
                  setNewTime(new Date());
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
                    <TouchableOpacity
                      style={styles.appointmentItem}
                      onPress={() => openEditModal(item)}
                    >
                      <Text style={styles.appointmentText}>
                        {item.time} - {item.title}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={{ color: "white", textAlign: "center" }}>
                      No appointments
                    </Text>
                  }
                />
              </>
            )}
          </ScrollView>
        </View>
      </ImageBackground>

      {/* Modal fora da estrutura de ScrollView/View */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingAppointment ? "Edit Appointment" : "New Appointment"}
            </Text>

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
                onPress={() => {
                  setModalVisible(false);
                  setEditingAppointment(null);
                }}
                color="#d32f2f"
              />
              <Button title="Save" onPress={saveAppointment} color="#43a047" />
            </View>

            {editingAppointment && (
              <View style={{ marginTop: 10 }}>
                <Button
                  title="Delete"
                  onPress={deleteAppointment}
                  color="#d32f2f"
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#3b5998",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  container: {
    paddingBottom: 30,
  },
  selectedDateText: {
    color: "white",
    fontSize: 18,
    marginVertical: 10,
  },
  appointmentItem: {
    backgroundColor: "#e1e1f8",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  appointmentText: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
  timePickerButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  timePickerText: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
