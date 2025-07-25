import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Terms and Conditions</Text>

        <Text style={styles.paragraph}>
          Terms and Conditions of Use – Time Exchange
        </Text>

        <Text style={styles.paragraph}>
          Welcome to Time Exchange. By using our platform, you agree to the following terms and conditions:
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            1. <Text style={styles.bold}>About the Service</Text>{"\n"}
            Time Exchange facilitates the exchange of services between users based on an hours system, without involving money. Each hour offered can be exchanged for another hour of service.
          </Text>

          <Text style={styles.listItem}>
            2. <Text style={styles.bold}>Registration and Account</Text>{"\n"}
            To participate, you must create a genuine account and keep your information up to date. You are responsible for the security of your password and all activities performed with your account.
          </Text>

          <Text style={styles.listItem}>
            3. <Text style={styles.bold}>Use of the Platform</Text>{"\n"}
            You agree to use the platform only for legal purposes and to respect other users. It is prohibited to offer illegal, discriminatory, or offensive services.
          </Text>

          <Text style={styles.listItem}>
            4. <Text style={styles.bold}>Service Exchange</Text>{"\n"}
            Exchanges are direct agreements between users. Time Exchange is not responsible for the quality, delivery, or outcome of exchanged services.
          </Text>

          <Text style={styles.listItem}>
            5. <Text style={styles.bold}>Personal Data</Text>{"\n"}
            We collect and use your data according to our Privacy Policy. You agree to the collection and use of this information for the operation of the platform.
          </Text>

          <Text style={styles.listItem}>
            6. <Text style={styles.bold}>Intellectual Property</Text>{"\n"}
            All content provided on the platform is protected by copyright and may not be used without authorization.
          </Text>

          <Text style={styles.listItem}>
            7. <Text style={styles.bold}>Limitation of Liability</Text>{"\n"}
            Time Exchange is not liable for damages, losses, or issues arising from the use of the platform or exchanged services.
          </Text>

          <Text style={styles.listItem}>
            8. <Text style={styles.bold}>Changes to Terms</Text>{"\n"}
            We may change these terms at any time. We recommend reviewing this page periodically to stay informed.
          </Text>

          <Text style={styles.listItem}>
            9. <Text style={styles.bold}>Termination</Text>{"\n"}
            We reserve the right to suspend or cancel accounts that violate these terms.
          </Text>

          <Text style={styles.listItem}>
            10. <Text style={styles.bold}>Governing Law</Text>{"\n"}
            These terms are governed by the laws of Portugal, and any disputes will be resolved in the courts of Lisbon.
          </Text>

          <Text style={styles.listItem}>
            11. <Text style={styles.bold}>Contact</Text>{"\n"}
            For any questions, please contact us at: support@timeexchange.pt.
          </Text>
        </View>
        {/*
        <Text style={styles.paragraph}>
          More detailed terms and explanations...
        </Text>
         Adicione mais texto conforme necessário */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    marginTop:40,
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontWeight: "700",
    fontSize: 26,
    marginBottom: 24,
    textAlign: "center",
    color: "#222",
  },
  paragraph: {
    fontSize: 17,
    color: "#444",
    marginBottom: 16,
    lineHeight: 26,
  },
  list: {
    marginBottom: 24,
  },
  listItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: "700",
    color: "#000",
  },
});

