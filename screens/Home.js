import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import styles from "../style/style";
import * as Calendar from "expo-calendar";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { SafeAreaView, StatusBar } from "react-native";


// background image
const BACKGROUND_IMAGE = require("../assets/images/fundo.png");

// random kind messages about time
const kindMessages = [
  "May your day be as bright as the sun!",
  "Enjoy every moment with love and joy.",
  "A warm hug for you on this beautiful day!",
  "May the wind take your worries away today.",
  "Smile, you are creating wonderful memories.",
];

function getImageByType(type) {
  if (!type) return require("../assets/images/default.png");
  switch (type.toLowerCase()) {
    case "tutoring":
      return require("../assets/images/tutoring.png");
    case "cooking":
      return require("../assets/images/cooking.png");
    case "babysitting":
      return require("../assets/images/babysitting.png");
    case "pet sitting":
      return require("../assets/images/pet_sitting.png");
    case "housecleaning":
      return require("../assets/images/housecleaning.png");
    case "gardening":
      return require("../assets/images/gardening.png");
    case "computer help":
      return require("../assets/images/computer_help.png");
    case "elderly care":
      return require("../assets/images/elderly_care.png");
    default:
      return require("../assets/images/default.png");
  }
}
// translate the type field to English
function translateType(type) {
  if (!type) return "";
  switch (type.toLowerCase()) {
    case "cuidador de idoso":
    case "elderly care":
      return "Elderly Care";
    case "cozinheiro":
    case "cooking":
      return "Cooking";
    case "babá":
    case "babysitting":
      return "Babysitting";
    case "pet sitter":
    case "pet sitting":
      return "Pet Sitting";
    case "faxineira":
    case "housecleaning":
      return "House Cleaning";
    case "jardinagem":
    case "gardening":
      return "Gardening";
    case "ajuda com computador":
    case "computer help":
      return "Computer Help";
    case "tutor":
    case "tutoring":
      return "Tutoring";
    default:
      return type;
  }
}

// translate the description field to English (add cases as needed)
function translateDescription(desc) {
  if (!desc) return "";
  const lowerDesc = desc.toLowerCase();

  if (lowerDesc.includes("apoio e companhia para idosos")) {
    return "Support and companionship for elderly, ensuring daily safety and well-being";
  }
  if (lowerDesc.includes("cozinha")) {
    return "Cooking services";
  }
  if (lowerDesc.includes("babá")) {
    return "Babysitting services";
  }
  if (lowerDesc.includes("pet sitter")) {
    return "Pet sitting services";
  }
  if (lowerDesc.includes("faxineira")) {
    return "House cleaning services";
  }
  if (lowerDesc.includes("jardinagem")) {
    return "Gardening services";
  }
  if (lowerDesc.includes("ajuda com computador")) {
    return "Computer help and support";
  }
  if (lowerDesc.includes("tutor")) {
    return "Tutoring services";
  }
  // Se não achar correspondência, retorna original
  return desc;
}

const openCalendarApp = () => {
  if (Platform.OS === "ios") {
    Linking.openURL("calshow://");
  } else if (Platform.OS === "android") {
    Linking.openURL("content://com.android.calendar/time/");
  }
};

async function getCalendarPermissions() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission to access calendar denied!");
    return false;
  }
  return true;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);
  const [kindMessage, setKindMessage] = useState("");

  useEffect(() => {
    const index = Math.floor(Math.random() * kindMessages.length);
    setKindMessage(kindMessages[index]);
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "compromissos"),
      orderBy("datetime", "asc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((doc) => {
          const c = doc.data();
          if (!c.datetime) return null;

          const dateObj = c.datetime.toDate
            ? c.datetime.toDate()
            : new Date(c.datetime);

          return {
            id: doc.id,
            title: c.title,
            descricao: c.descricao,
            tipo: c.tipo,
            email: c.email,
            telemovel: c.telemovel,
            dateObj,
          };
        })
        .filter(Boolean);

      setAppointments(data);
    });

    return unsubscribe;
  }, []);

  const addToCalendar = async (c) => {
    const hasPermission = await getCalendarPermissions();
    if (!hasPermission) return;

    let calendarId;

    if (Platform.OS === "ios") {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      calendarId = calendars.find((cal) => cal.allowsModifications)?.id;
    } else {
      const defaultCal = await Calendar.getDefaultCalendarAsync();
      calendarId = defaultCal?.id;

      if (!calendarId) {
        calendarId = await Calendar.createCalendarAsync({
          title: "Time Bank",
          color: "blue",
          entityType: Calendar.EntityTypes.EVENT,
          source: { isLocalAccount: true, name: "Time Bank" },
          name: "Time Bank",
          ownerAccount: "personal",
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
      }
    }

    try {
      await Calendar.createEventAsync(calendarId, {
        title: c.title,
        startDate: c.dateObj.toISOString(),
        endDate: new Date(c.dateObj.getTime() + 60 * 60 * 1000).toISOString(),
        notes: c.descricao,
        timeZone: "GMT",
      });
      Alert.alert("Event added to calendar!");
      openCalendarApp();
    } catch (error) {
      Alert.alert("Error creating event: " + error.message);
    }
  };

  const contactOptions = (c) => {
    const options = [];

    if (c.email) {
      options.push({
        text: "Send Email",
        onPress: () => Linking.openURL(`mailto:${c.email}`),
      });
    }

    if (c.telemovel) {
      options.push({
        text: "Call",
        onPress: () => Linking.openURL(`tel:${c.telemovel}`),
      });
    }

    options.push({ text: "Cancel", style: "cancel" });

    Alert.alert("Contact Options", "Choose an option:", options, {
      cancelable: true,
    });
  };

  const openDetails = (appointment) => {
    navigation.navigate("Details", { compromisso: appointment });
  };

  const renderAppointment = (c) => {
    const date = c.dateObj.toLocaleDateString();
    const time = c.dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        key={c.id}
        style={[
          styles.card,
          {
            padding: 20,
            marginVertical: 16,
            width: "95%",
            alignSelf: "center",
          },
        ]}
      >
        <TouchableOpacity onPress={() => openDetails(c)}>
          <Image
            source={getImageByType(c.tipo)}
            style={[styles.image, { height: 200, borderRadius: 10 }]}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.cardTitle,
            {
              fontSize: 22,
              textAlign: "center",
              marginVertical: 10,
              color: "#020381",
            },
          ]}
        >
          {translateType(c.tipo)}
        </Text>
        <Text style={[styles.date, { fontSize: 16, color: "#020381" }]}>
          {`${date} ${time}`}
        </Text>
        <Text
          style={[
            styles.eventDescription,
            { marginVertical: 10, textAlign: "center", color: "#020381" },
          ]}
          numberOfLines={2}
        >
          {translateDescription(c.descricao) || "No description"}
        </Text>

        {(c.email || c.telemovel) && (
          <TouchableOpacity
            style={styles.login_button}
            onPress={() => contactOptions(c)}
          >
            <Text style={styles.login_buttonText}>Contact</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.login_buttonCal, { marginTop: 10 }]}
          onPress={() => addToCalendar(c)}
        >
          <Text style={styles.login_buttonText}>Add to Calendar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const logout = async () => {
    try {
      await auth.signOut();
      navigation.replace("Login");
    } catch (e) {
      Alert.alert("Logout error", e.message);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <ImageBackground
        source={BACKGROUND_IMAGE}
        style={[styles.background, { backgroundColor: "rgba(2, 3, 129, 1)" }]}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView
            contentContainerStyle={{ alignItems: "center", paddingBottom: 40}}
          >
            <Text
             style={{
               fontSize: 18,
               color: "#fff",
               marginTop: 30,
               fontStyle: "italic",
               textAlign: "center",
               paddingHorizontal: 20,
             }}
           >
             {kindMessage}
           </Text>

           {appointments.length === 0 && (
             <Text style={{ color: "#ccc", textAlign: "center", marginTop: 50 }}>
               No scheduled appointments.
             </Text>
           )}

           {appointments.map(renderAppointment)}

           <TouchableOpacity
             style={[
               styles.logout_button,
               { backgroundColor: "#2196F3", marginTop: 20, width: "95%" },
             ]}
             onPress={logout}
            >
             <Text style={styles.login_buttonText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
