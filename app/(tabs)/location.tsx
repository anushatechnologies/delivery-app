import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#1a1f2c" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#707070" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a1f2c" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#702DFF" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#2c3447" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b1" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0A0118" }] }
];

export default function LocationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: 17.385044,
          longitude: 78.486671,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 17.385044, longitude: 78.486671 }}
          title="Your Location"
        >
           <View style={styles.markerGlow}>
              <View style={styles.markerCore} />
           </View>
        </Marker>
      </MapView>

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
         <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
               <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
               <Text style={styles.headerTitle}>Live Tracking</Text>
               <Text style={styles.headerSub}>Miyapur, Hyderabad</Text>
            </View>
         </View>

         <View style={styles.bottomCard}>
            <View style={styles.dragHandle} />
            <Text style={styles.cardTitle}>You are currently Online</Text>
            <Text style={styles.cardSub}>Orders in your area are high. Stay near Miyapur Circle for faster assignments.</Text>
            <TouchableOpacity style={styles.actionBtn}>
               <Text style={styles.btnText}>View Hotspots</Text>
               <MaterialCommunityIcons name="fire" size={20} color="#fff" />
            </TouchableOpacity>
         </View>
      </SafeAreaView>
    </View>
  );
}

function TouchableOpacity(props: any) {
  const { Pressable } = require("react-native");
  return <Pressable {...props} style={({ pressed }: any) => [props.style, pressed && { opacity: 0.7 }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0118" },
  map: { flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#1A0C2E', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(112,45,255,0.3)' },
  headerContent: { flex: 1 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  headerSub: { color: '#702DFF', fontSize: 12, fontWeight: '700' },
  markerGlow: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(112, 45, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  markerCore: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#702DFF', borderWidth: 2, borderColor: '#fff' },
  bottomCard: { backgroundColor: '#1A0C2E', borderRadius: 32, padding: 24, paddingBottom: 40, position: 'absolute', bottom: 100, left: 12, right: 12, borderWidth: 1, borderColor: 'rgba(112, 45, 255, 0.2)' },
  dragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center', marginBottom: 20 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  cardSub: { color: '#A0A0A0', fontSize: 13, marginTop: 8, lineHeight: 20 },
  actionBtn: { backgroundColor: '#702DFF', height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 24 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});