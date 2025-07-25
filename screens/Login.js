// screens/Login.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import styles from "../style/style";
import { SafeAreaView, StatusBar } from "react-native";
import Background from "../components/Background";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ------- handlers -------------------------------------------------------
  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please fill in email and password.");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful!");
      //navigation.replace("MainTabs");
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Attention", "Please enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Recovery e‑mail sent!");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // ------- UI -------------------------------------------------------------
  return (
    <Background>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
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
            <Text style={styles.login_label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              style={styles.login_input}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              style={styles.login_input}
              secureTextEntry
              autoComplete="off"
              textContentType="none"
              importantForAutofill="no"
            />

            <TouchableOpacity
              style={styles.login_button}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.login_buttonText}>
                {loading ? "Logging in..." : "Log In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.login_link}>Forgot your password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.login_link}>No account? Sign up</Text>
            </TouchableOpacity>

            {message ? (
              <Text style={[styles.mensagem, { marginTop: 20 }]}>
                {message}
              </Text>
            ) : null}
            <View style={styles.footerContainer}>
              <Image
                source={require("../assets/login.png")}
                style={styles.footerImage}
                resizeMode="contain"
              />
              <Text style={styles.footerText}>
                Time is precious. Share yours to build a better world.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Background>
  );
}
