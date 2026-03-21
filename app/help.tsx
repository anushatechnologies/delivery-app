import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLanguage } from "../context/LanguageContext";
import { StatusBar } from "expo-status-bar";

export default function HelpScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const faqs = [
    { q: "How do I withdraw my earnings?", a: "Earnings are automatically transferred to your registered bank account every Monday." },
    { q: "What to do if order is cancelled?", a: "If an order is cancelled after pickup, please return it to the nearest store to avoid penalties." },
    { q: "My vehicle is under repair, what now?", a: "You can temporarily disable your account from the profile settings or contact support." },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1A1A1A" />
           </TouchableOpacity>
           <Text style={styles.headerTitle}>{t('help')}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
           <View style={styles.searchBox}>
              <MaterialCommunityIcons name="magnify" size={22} color="#9CA3AF" />
              <TextInput placeholder="Search for help..." style={styles.searchInput} placeholderTextColor="#9CA3AF" />
           </View>

           <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
           {faqs.map((item, i) => (
             <View key={i} style={styles.faqCard}>
                <Text style={styles.faqQuestion}>{item.q}</Text>
                <Text style={styles.faqAnswer}>{item.a}</Text>
             </View>
           ))}

           <View style={styles.contactCard}>
              <View style={styles.contactHead}>
                 <MaterialCommunityIcons name="headphones" size={30} color="#702DFF" />
                 <Text style={styles.contactTitle}>Still need help?</Text>
              </View>
              <Text style={styles.contactDesc}>Our support team is available 24/7 to assist you with any delivery issues.</Text>
              <TouchableOpacity style={styles.supportBtn}>
                 <Text style={styles.supportBtnText}>Connect to Live Chat</Text>
              </TouchableOpacity>
           </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, gap: 16 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#1A1A1A' },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', height: 56, borderRadius: 18, paddingHorizontal: 16, marginBottom: 32, borderWidth: 1, borderColor: '#F3F4F6' },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 20 },
  faqCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  faqQuestion: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
  faqAnswer: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  contactCard: { backgroundColor: '#F3E8FF', borderRadius: 28, padding: 24, marginTop: 16, alignItems: 'center' },
  contactHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  contactTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' },
  contactDesc: { textAlign: 'center', color: '#6B7280', fontSize: 14, lineHeight: 22, marginBottom: 24 },
  supportBtn: { backgroundColor: '#702DFF', width: '100%', height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', shadowColor: '#702DFF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  supportBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
