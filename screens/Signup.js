import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import styles from "../style/style";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function Signup({ navigation }) {
  const [form, setForm] = useState({
    fullName: "",
    birthDate: "",
    nif: "",
    address: "",
    skill: "",
    email: "",
    password: "",
    termsAccepted: false,
  });

  const availableSkills = [
    "Tutoring",
    "Cooking",
    "Babysitting",
    "Pet Sitting",
    "House Cleaning",
    "Gardening",
    "Computer Help",
    "Elderly Care",
  ];

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignup = async () => {
    const {
      fullName,
      birthDate,
      nif,
      address,
      skill,
      email,
      password,
      termsAccepted,
    } = form;

    if (
      !fullName ||
      !birthDate ||
      !nif ||
      !address ||
      !skill ||
      !email ||
      !password ||
      !termsAccepted
    ) {
      Alert.alert(
        "Missing information",
        "Please fill in all fields and accept the terms."
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        birthDate,
        nif,
        address,
        skill,
        email,
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.replace("MainTabs");
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={60}
    >
      <ScrollView
        style={styles.login_container}
        contentContainerStyle={styles.scroll_container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.login_label}>Full Name</Text>
        <TextInput
          style={styles.login_input}
          placeholder="Your full name"
          onChangeText={(text) => handleChange("fullName", text)}
        />

        <Text style={styles.login_label}>Birth Date</Text>
        <TextInput
          style={styles.login_input}
          placeholder="DD/MM/YYYY"
          onChangeText={(text) => handleChange("birthDate", text)}
        />

        <Text style={styles.login_label}>NIF</Text>
        <TextInput
          style={styles.login_input}
          placeholder="Tax ID number"
          keyboardType="numeric"
          onChangeText={(text) => handleChange("nif", text)}
        />

        <Text style={styles.login_label}>Full Address</Text>
        <TextInput
          style={styles.login_input}
          placeholder="Street, number, city"
          onChangeText={(text) => handleChange("address", text)}
        />

        <Text style={styles.login_label}>What can you offer?</Text>
        <Picker
          selectedValue={form.skill}
          onValueChange={(itemValue) => handleChange("skill", itemValue)}
          style={styles.login_input}
        >
          <Picker.Item label="Select an option" value="" />
          {availableSkills.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>

        <Text style={styles.login_label}>Email</Text>
        <TextInput
          style={styles.login_input}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => handleChange("email", text)}
        />

        <Text style={styles.login_label}>Password</Text>
        <TextInput
          style={styles.login_input}
          secureTextEntry
          placeholder="Create a password"
          onChangeText={(text) => handleChange("password", text)}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 12,
          }}
        >
          <Checkbox
            value={form.termsAccepted}
            onValueChange={(value) => handleChange("termsAccepted", value)}
            color={form.termsAccepted ? "#4CAF50" : undefined}
          />
          <Text style={{ color: "#fff", marginLeft: 8 }}>
            I accept the terms and conditions.
          </Text>
        </View>

        <TouchableOpacity style={styles.login_button} onPress={handleSignup}>
          <Text style={styles.login_buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.login_link}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
