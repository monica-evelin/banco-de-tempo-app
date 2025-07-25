import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { StyleSheet } from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import Background from "../components/Background";

export default function Signup({ navigation }) {
  const [form, setForm] = useState({
    fullName: "",
    birthDate: "",
    nif: "",
    address: "",
    skill: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    phone: "",
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
      phone,
      nif,
      address,
      skill,
      email,
      password,
      confirmPassword,
      termsAccepted,
    } = form;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const birthDateRegex =
      /^(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[0-2])[\/]\d{4}$/;

    const isValidPassword = (pwd) => {
      const minLength = pwd.length >= 6;
      const hasUpperCase = /[A-Z]/.test(pwd);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(pwd);
      return minLength && hasUpperCase && hasSpecialChar;
    };

    if (!fullName || fullName.length < 3) {
      Alert.alert(
        "Invalid Name",
        "Please enter your full name (min. 3 characters)."
      );
      return;
    }

    if (!birthDateRegex.test(birthDate)) {
      Alert.alert("Invalid Birth Date", "Use format DD/MM/YYYY.");
      return;
    }

    if (!/^\d{9}$/.test(nif)) {
      Alert.alert("Invalid NIF", "NIF must be 9 digits.");
      return;
    }

    if (!address) {
      Alert.alert("Invalid Address", "Please enter your address.");
      return;
    }

    if (!phone || phone.trim() === "") {
      Alert.alert("Invalid Phone", "Please enter your phone number.");
      return;
    }

    if (!skill) {
      Alert.alert("Invalid Skill", "Please select a skill.");
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Enter a valid email address.");
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert(
        "Error",
        "Invalid password. It must be at least 6 characters long, contain an uppercase letter, and a special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      Alert.alert("Terms Not Accepted", "You must accept the terms.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Envia o e-mail de verificação
      await sendEmailVerification(user);
      console.log("E-mail de verificação enviado para:", user.email);

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        birthDate,
        nif,
        address,
        skill,
        email,
        phone,
      });

      Alert.alert(
        "Success",
        "Account created successfully! Please check your email for verification."
      );
      navigation.replace("MainTabs");
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    }
  };

  return (
    <Background>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scroll_container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.login_container}>
            {/* Campos do formulário */}
            <Text style={styles.login_label}>Full Name</Text>
            <TextInput
              style={styles.login_input}
              placeholder="Your full name"
              onChangeText={(text) => handleChange("fullName", text)}
            />

            <Text style={styles.login_label}>Birth Date</Text>
            <MaskedTextInput
              mask="99/99/9999"
              onChangeText={(text) => handleChange("birthDate", text)}
              value={form.birthDate}
              style={styles.login_input}
              keyboardType="numeric"
              placeholder="DD/MM/YYYY"
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

            <Text style={styles.login_label}>Phone</Text>
            <TextInput
              style={styles.login_input}
              placeholder="Your phone number"
              keyboardType="phone-pad"
              onChangeText={(text) => handleChange("phone", text)}
              value={form.phone}
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

            <Text style={styles.login_label}>Confirm Password</Text>
            <TextInput
              style={styles.login_input}
              secureTextEntry
              placeholder="Repeat your password"
              onChangeText={(text) => handleChange("confirmPassword", text)}
              value={form.confirmPassword}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center", // centraliza horizontalmente o conteúdo
                marginVertical: 12,
              }}
            >
              <Checkbox
                value={form.termsAccepted}
                onValueChange={(value) => handleChange("termsAccepted", value)}
                color={form.termsAccepted ? "#4CAF50" : undefined}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("TermsScreen")}
              >
                {/*<View style={{ flexDirection: "row",
                alignItems: "center",
                marginVertical: 12, }} >
                <Checkbox value={form.termsAccepted} onValueChange={(value) => handleChange("termsAccepted", value)} color={form.termsAceito? "#4CAF50" : indefinido} />
                <Text style={{ color: "#fff", marginLeft: 8 }}> Aceito os termos e condições.
                </Text>
                </View>*/}
                <Text
                  style={{
                    color: "#fff",
                    marginLeft: 8,
                    textDecorationLine: "underline",
                  }}
                >
                  I accept the terms and conditions.
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.login_button}
              onPress={handleSignup}
            >
              <Text style={styles.login_buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.login_link}>
                Already have an account? Log In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  scroll_container: { paddingHorizontal: 20, paddingVertical: 30 },
  login_label: { color: "#fff", fontSize: 16, marginBottom: 4 },
  login_input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  login_button: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  login_buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  login_link: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 16,
    textDecorationLine: "underline",
  },
});
