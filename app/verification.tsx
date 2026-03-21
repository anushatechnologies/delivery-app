import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";
import { profileService } from "../services/profileService";
import { documentService } from "../services/documentService";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function VerificationScreen() {
  const router = useRouter();
  const { authState, setVerificationStatus } = useUser();
  const [polling, setPolling] = useState(true);

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  const [photoStatus, setPhotoStatus] = useState<string | null>(null);
  const [photoRemarks, setPhotoRemarks] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await profileService.getStatus();
        
        // Handle Photo-Specific Feedback Action Blocks
        if (res?.photoStatus === "REJECTED" || res?.photoStatus === "NEEDS_REUPLOAD") {
           setPhotoStatus(res.photoStatus);
           setPhotoRemarks(res.photoRemarks);
        } else {
           setPhotoStatus(null);
        }

        if (res?.status === "APPROVED" || res?.status === "approved") {
          await setVerificationStatus("approved");
          setPolling(false);
          router.replace("/(tabs)");
        } else if (res?.status === "REJECTED" || res?.status === "rejected") {
          await setVerificationStatus("rejected");
          setPolling(false);
        }
      } catch (err) {
        console.log("Status ping failed, retrying...");
      }
    };

    if (polling) {
      checkStatus();
      const interval = setInterval(checkStatus, 20000);
      return () => clearInterval(interval);
    }
  }, [polling]);

  const handleReuploadPhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera access is needed to capture a new selfie.");
      return;
    }
    
    try {
      const result = await ImagePicker.launchCameraAsync({ quality: 0.3 });
      if (!result.canceled && result.assets?.[0]?.uri) {
         setUploading(true);
         if (!authState.user) throw new Error("Account context unavailable");
         
         const uri = result.assets[0].uri;
         let fileUrl = "";
         try {
            const FileSystem = require('expo-file-system');
            const firebase = require('firebase/compat/app').default;
            require('firebase/compat/storage');
            
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
            const ref = firebase.storage().ref().child(`profiles/${authState.user.phone}_${Date.now()}.jpg`);
            await ref.putString(`data:image/jpeg;base64,${base64}`, 'data_url');
            fileUrl = await ref.getDownloadURL();
         } catch (e) {
            console.warn("Firebase Reupload Error:", e);
            throw new Error("Could not pipe selfie to data bucket.");
         }
         
         const parts = (authState.user.name || "Rider").split(" ");
         await profileService.updateProfileDetails({
            firstName: parts[0],
            lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
            profilePhotoUrl: fileUrl
         });
         
         Alert.alert("Success", "New selfie submitted! Please wait for admin review.");
         setPhotoStatus("RESUBMITTED"); // Temporarily clears the warning
      }
    } catch (e: any) {
      Alert.alert("Upload Failed", "Could not submit your new photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.bgGlow} />

        <ScrollView style={styles.flex1} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.iconSection}>
              <View style={styles.iconCircle}>
                <Animated.View style={rotateStyle}>
                  <MaterialCommunityIcons name="loading" size={60} color="#702DFF" />
                </Animated.View>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.textSection}>
              {authState.verificationStatus === "rejected" ? (
                <>
                  <Text style={[styles.title, { color: "#FF2D55" }]}>Application Rejected</Text>
                  <Text style={styles.subtitle}>
                    Unfortunately, your profile could not be verified.{"\n"}
                    Please contact our support for assistance.
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.title}>Under Review</Text>
                  <Text style={styles.subtitle}>
                    We are currently verifying your documents.{"\n"}
                    This usually takes about 24-48 hours.
                  </Text>
                </>
              )}
            </Animated.View>

            {/* Admin Photo Rejection Alert / Call to Action */}
            {(photoStatus === "REJECTED" || photoStatus === "NEEDS_REUPLOAD") && (
              <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.actionRequiredAlert}>
                 <View style={styles.alertHeader}>
                    <MaterialCommunityIcons name="alert-circle" size={24} color="#FF2D55" />
                    <Text style={styles.alertTitle}>Action Required</Text>
                 </View>
                 <Text style={styles.alertRemarks}>{photoRemarks || "Your profile photo didn't meet our guidelines. Please take a clearer selfie."}</Text>
                 
                 <TouchableOpacity onPress={handleReuploadPhoto} disabled={uploading} style={styles.reuploadBtn}>
                    {uploading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <MaterialCommunityIcons name="camera-enhance" size={20} color="#fff" />
                        <Text style={styles.reuploadBtnText}>Take New Selfie</Text>
                      </>
                    )}
                 </TouchableOpacity>
              </Animated.View>
            )}

            <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.statusCard}>
                <StatusItem 
                  icon="file-check-outline" 
                  label="Documents Captured" 
                  status="completed" 
                />
                <View style={styles.statusLine} />
                <StatusItem 
                  icon="account-search-outline" 
                  label="Admin Review" 
                  status={authState.verificationStatus === "rejected" ? "error" : "active"} 
                />
                <View style={styles.statusLine} />
                <StatusItem 
                  icon="check-decagram-outline" 
                  label="Ready to Earn" 
                  status="pending" 
                />
            </Animated.View>

            {/* Submitted Documents Section */}
            <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.docsSection}>
               <Text style={styles.docsTitle}>Submitted Documents</Text>
               <View style={styles.docsGrid}>
                  <DocThumb label="Aadhaar" uri={authState.user?.aadhaarPhoto} />
                  <DocThumb label="PAN Card" uri={authState.user?.panPhoto} />
                  <DocThumb label="License" uri={authState.user?.licensePhoto} />
               </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(900).springify()} style={styles.payoutInfo}>
               <MaterialCommunityIcons name="information-variant" size={20} color="#702DFF" />
               <Text style={styles.payoutText}>
                 You will receive a push notification as soon as your account is activated.
               </Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(1100).springify()} style={styles.footer}>
               <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={styles.homeBtn}>
                  <Text style={styles.homeBtnText}>Explore the App (Bypass)</Text>
               </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function DocThumb({ label, uri }: { label: string, uri?: string | null }) {
  return (
    <View style={styles.docThumbWrap}>
       <View style={styles.thumbBox}>
          {uri ? (
            <Image source={{ uri }} style={styles.thumbImg} />
          ) : (
            <MaterialCommunityIcons name="file-question-outline" size={24} color="#CBD5E1" />
          )}
       </View>
       <Text style={styles.thumbLabel}>{label}</Text>
    </View>
  );
}

function StatusItem({ icon, label, status }: { icon: any, label: string, status: 'completed' | 'active' | 'pending' | 'error' }) {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isError = status === 'error';

  return (
    <View style={styles.statusItem}>
      <View style={[
        styles.statusIconCircle, 
        isCompleted && styles.circleCompleted,
        isActive && styles.circleActive,
        isError && styles.circleError
      ]}>
         <MaterialCommunityIcons 
            name={icon} 
            size={22} 
            color={isCompleted ? "#fff" : isActive ? "#702DFF" : isError ? "#FF2D55" : "#9CA3AF"} 
         />
      </View>
      <Text style={[
        styles.statusLabel,
        isCompleted && styles.labelCompleted,
        isActive && styles.labelActive,
        isError && styles.labelError
      ]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  safe: { flex: 1 },
  bgGlow: { position: 'absolute', top: '20%', alignSelf: 'center', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(112, 45, 255, 0.05)', filter: 'blur(60px)' },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center', alignItems: 'center' },
  iconSection: { marginBottom: 40 },
  iconCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#702DFF' },
  textSection: { alignItems: 'center', marginBottom: 48 },
  title: { fontSize: 28, fontWeight: '900', color: '#1A1A1A', marginBottom: 16 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 },
  statusCard: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4, marginBottom: 32, borderWidth: 1, borderColor: '#F3F4F6' },
  statusItem: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  statusIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  circleCompleted: { backgroundColor: '#00C853', borderColor: '#00C853' },
  circleActive: { backgroundColor: '#F3E8FF', borderWidth: 1.5, borderColor: '#702DFF' },
  circleError: { backgroundColor: '#FEF2F2', borderWidth: 1.5, borderColor: '#FF2D55' },
  statusLabel: { fontSize: 15, fontWeight: '600', color: '#9CA3AF' },
  labelCompleted: { color: '#00C853' },
  labelActive: { color: '#1A1A1A', fontWeight: '800' },
  labelError: { color: '#FF2D55' },
  statusLine: { width: 2, height: 24, backgroundColor: '#F3F4F6', marginLeft: 21 },
  payoutInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F3E8FF', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(112, 45, 255, 0.1)', marginBottom: 32 },
  payoutText: { flex: 1, color: '#702DFF', fontSize: 13, lineHeight: 18, fontWeight: '600' },
  docsSection: { width: '100%', marginBottom: 32 },
  docsTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 16 },
  docsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  docThumbWrap: { alignItems: 'center', flex: 1 },
  thumbBox: { width: 70, height: 70, borderRadius: 16, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
  thumbImg: { width: '100%', height: '100%' },
  thumbLabel: { fontSize: 11, color: '#64748B', fontWeight: '700', marginTop: 8 },
  footer: { marginBottom: 40 },
  homeBtn: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 18, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6' },
  homeBtnText: { color: '#1A1A1A', fontSize: 16, fontWeight: '700' },
  flex1: { flex: 1 },
  actionRequiredAlert: { width: "100%", backgroundColor: "#FEF2F2", padding: 22, borderRadius: 24, borderWidth: 1.5, borderColor: "#FECACA", marginBottom: 28 },
  alertHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  alertTitle: { fontSize: 18, fontWeight: "900", color: "#FF2D55", letterSpacing: -0.5 },
  alertRemarks: { fontSize: 14, color: "#991B1B", fontWeight: "600", lineHeight: 22, marginBottom: 20 },
  reuploadBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, height: 50, borderRadius: 16, backgroundColor: "#FF2D55", elevation: 4, shadowColor: "#FF2D55", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
  reuploadBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", letterSpacing: 0.5 },
});
