import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "../style/style";
import Background from "../components/Background";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [skill, setSkill] = useState("");
  const [address, setAddress] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    getDoc(userRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.fullName || "");
          setBirthDate(data.birthDate || "");
          setPhone(data.phone || "");
          setSkill(data.skill || "");
          setAddress(data.address || "");
          setPhotoURL(data.photoURL || null);
        }
      })
      .catch(() => {
        Alert.alert("Error", "Failed to load user data.");
      });
  }, [user]);

  const handleBirthdateChange = (text) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    if (cleaned.length <= 2) {
      setBirthDate(cleaned);
    } else if (cleaned.length <= 4) {
      setBirthDate(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setBirthDate(
        `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`
      );
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          fullName: name,
          birthDate,
          phone,
          skill,
          address,
          photoURL,
        },
        { merge: true }
      );
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save profile data.");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      throw new Error("Image URI is undefined.");
    }

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profileImages/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setPhotoURL(downloadURL);

      await setDoc(
        doc(db, "users", user.uid),
        { photoURL: downloadURL },
        { merge: true }
      );
    } catch (error) {
      console.log("Upload error:", error.message);
      throw error;
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== "granted") {
      Alert.alert(
        "Permission required",
        "You need to allow access to the gallery."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      if (!imageUri) {
        Alert.alert("Erro", "Imagem inválida.");
        return;
      }
      setLoading(true);
      try {
        await uploadImage(imageUri);
        Alert.alert("Success", "Photo updated!");
      } catch (err) {
        Alert.alert("Upload failed", err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.status !== "granted") {
      Alert.alert("Permission required", "You need to allow camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      if (!imageUri) {
        Alert.alert("Erro", "Imagem inválida.");
        return;
      }
      setLoading(true);
      try {
        await uploadImage(imageUri);
        Alert.alert("Success", "Photo updated!");
      } catch (err) {
        Alert.alert("Upload failed", err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Background>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          paddingTop: 20,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          {photoURL ? (
            <Image
              source={{ uri: photoURL }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                marginTop: 20,
              }}
            />
          ) : (
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "#ccc",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text>No photo</Text>
            </View>
          )}

          <View style={{ flexDirection: "row", marginTop: 10, gap: 10, }}>
            <TouchableOpacity
              onPress={takePhoto}
              style={{
                backgroundColor: "#4CAF50",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "#fff" }}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickImage}
              style={{
                backgroundColor: "#2196F3",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "#fff" }}>Galery</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.login_label}>Name:</Text>
        <TextInput
          style={styles.login_input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
        />

        <Text style={[styles.login_label, { marginTop: 16 }]}>Email:</Text>
        <TextInput
          style={styles.login_input}
          value={user?.email || ""}
          editable={false}
        />

        <Text style={[styles.login_label, { marginTop: 16 }]}>Birthdate:</Text>
        <TextInput
          style={styles.login_input}
          value={birthDate}
          onChangeText={handleBirthdateChange}
          placeholder="DD/MM/YYYY"
          keyboardType="numeric"
          maxLength={10}
        />

        <Text style={[styles.login_label, { marginTop: 16 }]}>Phone:</Text>
        <TextInput
          style={styles.login_input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Your phone number"
          keyboardType="phone-pad"
        />

        <Text style={[styles.login_label, { marginTop: 16 }]}>Skill:</Text>
        <TextInput
          style={styles.login_input}
          value={skill}
          onChangeText={setSkill}
          placeholder="E.g. Babysitting"
        />

        <Text style={[styles.login_label, { marginTop: 16 }]}>Address:</Text>
        <TextInput
          style={styles.login_input}
          value={address}
          onChangeText={setAddress}
          placeholder="Your address"
        />

        {/* Botões lado a lado corrigidos */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#43a047",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              borderRadius: 6,
            }}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.login_buttonText}>Save</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#e53935",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              borderRadius: 6,
            }}
            onPress={logout}
          >
            <Text style={styles.login_buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Background>
  );
}
