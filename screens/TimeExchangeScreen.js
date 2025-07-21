import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function TimeExchangeScreen() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    // Fetch users
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        uid: doc.data().uid,
        fullName: doc.data().fullName,
        email: doc.data().email,
        phone: doc.data().telemovel,
      }));
      setUsers(usersData);
    });

    // Fetch appointments
    const unsubscribeAppointments = onSnapshot(
      collection(db, "appointments"),
      (snapshot) => {
        const appointmentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentsData);
      }
    );

    return () => {
      unsubscribeUsers();
      unsubscribeAppointments();
    };
  }, []);

  useEffect(() => {
    // Group appointments by type, then by user
    const grouped = {};

    appointments.forEach((appointment) => {
      const uid = appointment.uid;
      const type = appointment.type?.toLowerCase();

      if (!uid || !type) return; // Ignore incomplete data

      if (!grouped[type]) grouped[type] = {};

      if (!grouped[type][uid]) {
        // Find user by uid
        const user = users.find((u) => u.uid === uid);
        grouped[type][uid] = {
          name: user?.fullName || "Unknown User",
          email: user?.email,
          phone: user?.phone,
          appointments: [],
        };
      }

      grouped[type][uid].appointments.push(appointment);
    });

    setGroupedData(grouped);
  }, [appointments, users]);

  const contactOptions = (email, phone) => {
    const options = [];
    if (email) {
      options.push({
        text: "Send Email",
        onPress: () => Linking.openURL(`mailto:${email}`),
      });
    }
    if (phone) {
      options.push({
        text: "Call",
        onPress: () => Linking.openURL(`tel:${phone}`),
      });
    }
    options.push({ text: "Cancel", style: "cancel" });

    Alert.alert("Contact Options", "Choose an option:", options, {
      cancelable: true,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {Object.keys(groupedData).length === 0 ? (
        <Text style={styles.noData}>No appointments found.</Text>
      ) : (
        Object.entries(groupedData).map(([type, usersMap]) => (
          <View key={type} style={styles.typeContainer}>
            <Text style={styles.typeTitle}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>

            {Object.entries(usersMap).map(([uid, userData]) => (
              <View key={uid} style={styles.userContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.userName}>{userData.name}</Text>
                  {(userData.email || userData.phone) && (
                    <TouchableOpacity
                      onPress={() =>
                        contactOptions(userData.email, userData.phone)
                      }
                      style={styles.contactButton}
                    >
                      <Text style={styles.contactButtonText}>Contact</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {userData.appointments.map((appointment) => (
                  <Text key={appointment.id} style={styles.appointmentText}>
                    •{" "}
                    {appointment.title ||
                      appointment.description ||
                      "No description"}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  noData: { textAlign: "center", marginTop: 50, fontSize: 18, color: "#666" },
  typeContainer: { marginBottom: 30 },
  typeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2a2a72",
  },
  userContainer: {
    backgroundColor: "#e1e1f8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  userName: { fontSize: 18, fontWeight: "600" },
  appointmentText: { fontSize: 16, marginLeft: 10, marginTop: 4 },
  contactButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  contactButtonText: { color: "#fff", fontWeight: "600" },
});
