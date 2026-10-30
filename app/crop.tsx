import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useLang } from './context';
 
const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || '';
 
const GOV_API_KEY = process.env.EXPO_PUBLIC_GOV_API_KEY || '';
const RESOURCE_ID_1 = '9ef84268-d588-465a-a308-a864a43d0070';
const RESOURCE_ID_2 = '35985678-0d79-46b4-9ed6-6f13308a1d24';
const BASE_URL = 'https://api.data.gov.in/resource';
export const CROP_RULES = [
  { name: 'Rice', tamil: 'நெல்', hindi: 'चावल', minTemp: 22, maxTemp: 35, minHumid: 70, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 150, maxRain: 300, profit: '₹45,000-50,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Samba Rice', tamil: 'சம்பா நெல்', hindi: 'सांबा धान', minTemp: 23, maxTemp: 34, minHumid: 72, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 160, maxRain: 280, profit: '₹48,000-55,000/acre', season: 'Rabi', water: 'High' },
  { name: 'ADT 45 Rice', tamil: 'ADT 45 நெல்', hindi: 'ADT 45 धान', minTemp: 24, maxTemp: 35, minHumid: 70, maxHumid: 98, minPh: 5.5, maxPh: 7.5, minRain: 150, maxRain: 270, profit: '₹46,000-52,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Paddy Ponni', tamil: 'நெல் பொன்னி', hindi: 'धान पोन्नी', minTemp: 22, maxTemp: 34, minHumid: 70, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 155, maxRain: 295, profit: '₹46,000-52,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Paddy Improved White Ponni', tamil: 'நெல் வெள்ளை பொன்னி', hindi: 'धान इंप्रूव्ड पोन्नी', minTemp: 22, maxTemp: 34, minHumid: 70, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 155, maxRain: 290, profit: '₹46,000-53,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Paddy Kichili Samba', tamil: 'நெல் கிச்சிலி சம்பா', hindi: 'धान किचिली सांबा', minTemp: 23, maxTemp: 34, minHumid: 72, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 160, maxRain: 280, profit: '₹48,000-55,000/acre', season: 'Rabi', water: 'High' },
  { name: 'Paddy Samba Mahsuri', tamil: 'நெல் சம்பா மஹ்சூரி', hindi: 'धान सांबा महसूरी', minTemp: 23, maxTemp: 34, minHumid: 72, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 158, maxRain: 278, profit: '₹47,000-54,000/acre', season: 'Rabi', water: 'High' },
  { name: 'Paddy Seeraga Samba', tamil: 'நெல் சீரக சம்பா', hindi: 'धान सीरग सांबा', minTemp: 23, maxTemp: 34, minHumid: 72, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 158, maxRain: 280, profit: '₹50,000-58,000/acre', season: 'Rabi', water: 'High' },
  { name: 'Paddy Thangam Samba', tamil: 'நெல் தங்கம் சம்பா', hindi: 'धान थंगम सांबा', minTemp: 23, maxTemp: 34, minHumid: 72, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 158, maxRain: 278, profit: '₹47,000-54,000/acre', season: 'Rabi', water: 'High' },
  { name: 'Paddy Muttukkar', tamil: 'நெல் முத்துக்கார்', hindi: 'धान मुत्तुक्कार', minTemp: 23, maxTemp: 35, minHumid: 70, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 155, maxRain: 285, profit: '₹46,000-53,000/acre', season: 'Rabi', water: 'High' },
  { name: 'Paddy Mattai 110', tamil: 'நெல் மட்டை 110', hindi: 'धान मट्टई 110', minTemp: 23, maxTemp: 34, minHumid: 71, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 155, maxRain: 280, profit: '₹46,000-52,000/acre', season: 'Rabi', water: 'High' },
  { name: 'Paddy ADT-36', tamil: 'நெல் ADT-36', hindi: 'धान ADT-36', minTemp: 22, maxTemp: 35, minHumid: 70, maxHumid: 98, minPh: 5.5, maxPh: 7.5, minRain: 152, maxRain: 272, profit: '₹45,000-51,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Paddy ADT-37', tamil: 'நெல் ADT-37', hindi: 'धान ADT-37', minTemp: 22, maxTemp: 35, minHumid: 70, maxHumid: 98, minPh: 5.5, maxPh: 7.5, minRain: 152, maxRain: 275, profit: '₹46,000-52,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Paddy CO-43', tamil: 'நெல் CO-43', hindi: 'धान CO-43', minTemp: 22, maxTemp: 34, minHumid: 70, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 150, maxRain: 280, profit: '₹45,000-51,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Paddy CO-48', tamil: 'நெல் CO-48', hindi: 'धान CO-48', minTemp: 23, maxTemp: 34, minHumid: 70, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 152, maxRain: 282, profit: '₹46,000-52,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Paddy CR-1009', tamil: 'நெல் CR-1009', hindi: 'धान CR-1009', minTemp: 22, maxTemp: 34, minHumid: 70, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 152, maxRain: 278, profit: '₹45,000-51,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Paddy ASD-16', tamil: 'நெல் ASD-16', hindi: 'धान ASD-16', minTemp: 22, maxTemp: 35, minHumid: 70, maxHumid: 98, minPh: 5.5, maxPh: 7.5, minRain: 150, maxRain: 270, profit: '₹45,000-51,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Paddy ASD-17', tamil: 'நெல் ASD-17', hindi: 'धान ASD-17', minTemp: 22, maxTemp: 35, minHumid: 70, maxHumid: 98, minPh: 5.5, maxPh: 7.5, minRain: 150, maxRain: 272, profit: '₹46,000-52,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Maize', tamil: 'மக்காச்சோளம்', hindi: 'मक्का', minTemp: 18, maxTemp: 33, minHumid: 50, maxHumid: 80, minPh: 5.8, maxPh: 7.5, minRain: 60, maxRain: 150, profit: '₹35,000-45,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Baby Corn', tamil: 'பேபி கார்ன்', hindi: 'बेबी कॉर्न', minTemp: 20, maxTemp: 33, minHumid: 50, maxHumid: 78, minPh: 5.8, maxPh: 7.5, minRain: 60, maxRain: 140, profit: '₹50,000-65,000/acre', season: 'All Season', water: 'Medium' },
  { name: 'Sweet Corn', tamil: 'இனிப்பு மக்காச்சோளம்', hindi: 'स्वीट कॉर्न', minTemp: 20, maxTemp: 32, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.0, minRain: 65, maxRain: 130, profit: '₹55,000-70,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Sorghum (Jowar)', tamil: 'சோளம்', hindi: 'ज्वार', minTemp: 25, maxTemp: 40, minHumid: 35, maxHumid: 65, minPh: 5.5, maxPh: 7.5, minRain: 40, maxRain: 100, profit: '₹25,000-35,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Cholam CO 1', tamil: 'சோளம் CO 1', hindi: 'ज्वार CO 1', minTemp: 25, maxTemp: 40, minHumid: 35, maxHumid: 62, minPh: 5.5, maxPh: 7.5, minRain: 40, maxRain: 95, profit: '₹24,000-33,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Cholam CO 2', tamil: 'சோளம் CO 2', hindi: 'ज्वार CO 2', minTemp: 26, maxTemp: 40, minHumid: 35, maxHumid: 65, minPh: 5.5, maxPh: 7.5, minRain: 40, maxRain: 100, profit: '₹25,000-34,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Cholam C 437', tamil: 'சோளம் C 437', hindi: 'ज्वार C 437', minTemp: 27, maxTemp: 42, minHumid: 30, maxHumid: 62, minPh: 5.5, maxPh: 8.0, minRain: 35, maxRain: 90, profit: '₹26,000-35,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Pearl Millet (Bajra)', tamil: 'கம்பு', hindi: 'बाजरा', minTemp: 25, maxTemp: 42, minHumid: 30, maxHumid: 60, minPh: 6.0, maxPh: 8.0, minRain: 30, maxRain: 80, profit: '₹22,000-32,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Cumbu CO 1', tamil: 'கம்பு CO 1', hindi: 'बाजरा CO 1', minTemp: 25, maxTemp: 40, minHumid: 30, maxHumid: 58, minPh: 6.0, maxPh: 8.0, minRain: 30, maxRain: 75, profit: '₹22,000-30,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Cumbu CO 2', tamil: 'கம்பு CO 2', hindi: 'बाजरा CO 2', minTemp: 26, maxTemp: 42, minHumid: 28, maxHumid: 60, minPh: 6.0, maxPh: 8.0, minRain: 28, maxRain: 80, profit: '₹23,000-32,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Finger Millet (Ragi)', tamil: 'கேழ்வரகு', hindi: 'रागी', minTemp: 20, maxTemp: 35, minHumid: 50, maxHumid: 80, minPh: 5.5, maxPh: 7.5, minRain: 50, maxRain: 120, profit: '₹28,000-38,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Ragi CO 1', tamil: 'கேழ்வரகு CO 1', hindi: 'रागी CO 1', minTemp: 20, maxTemp: 33, minHumid: 50, maxHumid: 78, minPh: 5.5, maxPh: 7.5, minRain: 50, maxRain: 110, profit: '₹28,000-36,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Ragi CO 2', tamil: 'கேழ்வரகு CO 2', hindi: 'रागी CO 2', minTemp: 20, maxTemp: 35, minHumid: 50, maxHumid: 80, minPh: 5.5, maxPh: 7.5, minRain: 55, maxRain: 120, profit: '₹30,000-38,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Ragi CO 3', tamil: 'கேழ்வரகு CO 3', hindi: 'रागी CO 3', minTemp: 22, maxTemp: 35, minHumid: 52, maxHumid: 80, minPh: 5.5, maxPh: 7.5, minRain: 55, maxRain: 120, profit: '₹30,000-40,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Foxtail Millet', tamil: 'தினை', hindi: 'कंगनी', minTemp: 20, maxTemp: 35, minHumid: 40, maxHumid: 70, minPh: 5.5, maxPh: 7.5, minRain: 40, maxRain: 90, profit: '₹25,000-33,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Tenai CO 1', tamil: 'தினை CO 1', hindi: 'कंगनी CO 1', minTemp: 20, maxTemp: 34, minHumid: 40, maxHumid: 68, minPh: 5.5, maxPh: 7.5, minRain: 38, maxRain: 88, profit: '₹24,000-32,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Tenai CO 2', tamil: 'தினை CO 2', hindi: 'कंगनी CO 2', minTemp: 21, maxTemp: 35, minHumid: 40, maxHumid: 70, minPh: 5.5, maxPh: 7.5, minRain: 40, maxRain: 90, profit: '₹25,000-33,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Kodo Millet', tamil: 'வரகு', hindi: 'कोदो', minTemp: 20, maxTemp: 35, minHumid: 40, maxHumid: 70, minPh: 5.0, maxPh: 7.0, minRain: 40, maxRain: 90, profit: '₹24,000-32,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Varagu CO 1', tamil: 'வரகு CO 1', hindi: 'कोदो CO 1', minTemp: 20, maxTemp: 34, minHumid: 40, maxHumid: 68, minPh: 5.0, maxPh: 7.0, minRain: 40, maxRain: 88, profit: '₹23,000-31,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Varagu CO 2', tamil: 'வரகு CO 2', hindi: 'कोदो CO 2', minTemp: 20, maxTemp: 35, minHumid: 40, maxHumid: 70, minPh: 5.0, maxPh: 7.0, minRain: 42, maxRain: 90, profit: '₹24,000-32,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Little Millet', tamil: 'சாமை', hindi: 'कुटकी', minTemp: 20, maxTemp: 35, minHumid: 40, maxHumid: 70, minPh: 5.0, maxPh: 7.0, minRain: 40, maxRain: 90, profit: '₹24,000-32,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Samai CO 1', tamil: 'சாமை CO 1', hindi: 'कुटकी CO 1', minTemp: 20, maxTemp: 34, minHumid: 40, maxHumid: 70, minPh: 5.0, maxPh: 7.0, minRain: 40, maxRain: 88, profit: '₹23,000-31,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Blackgram (Urad)', tamil: 'உளுந்து', hindi: 'उड़द', minTemp: 22, maxTemp: 35, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 60, maxRain: 100, profit: '₹40,000-50,000/acre', season: 'Rabi', water: 'Low' },
  { name: 'Greengram (Moong)', tamil: 'பாசிப்பருப்பு', hindi: 'मूंग', minTemp: 24, maxTemp: 35, minHumid: 50, maxHumid: 75, minPh: 6.0, maxPh: 7.5, minRain: 60, maxRain: 100, profit: '₹38,000-48,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Redgram (Pigeon Pea)', tamil: 'துவரம்பருப்பு', hindi: 'अरहर', minTemp: 25, maxTemp: 38, minHumid: 50, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 60, maxRain: 130, profit: '₹42,000-52,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Horsegram', tamil: 'கொள்ளு', hindi: 'कुलथी', minTemp: 22, maxTemp: 38, minHumid: 45, maxHumid: 72, minPh: 5.5, maxPh: 7.5, minRain: 40, maxRain: 90, profit: '₹30,000-40,000/acre', season: 'Rabi', water: 'Low' },
  { name: 'Cowpea', tamil: 'தட்டைப்பயறு', hindi: 'लोबिया', minTemp: 24, maxTemp: 38, minHumid: 50, maxHumid: 78, minPh: 6.0, maxPh: 7.5, minRain: 50, maxRain: 110, profit: '₹35,000-45,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Chickpea (Bengal Gram)', tamil: 'கடலை', hindi: 'चना', minTemp: 14, maxTemp: 26, minHumid: 40, maxHumid: 65, minPh: 6.0, maxPh: 8.0, minRain: 40, maxRain: 80, profit: '₹38,000-48,000/acre', season: 'Rabi', water: 'Low' },
  { name: 'Soybean', tamil: 'சோயாபீன்', hindi: 'सोयाबीन', minTemp: 20, maxTemp: 30, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.0, minRain: 80, maxRain: 150, profit: '₹35,000-45,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Flat Bean', tamil: 'அவரை', hindi: 'सेम', minTemp: 18, maxTemp: 30, minHumid: 60, maxHumid: 85, minPh: 6.0, maxPh: 7.5, minRain: 60, maxRain: 120, profit: '₹40,000-55,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Cluster Bean (Guar)', tamil: 'கொத்தவரை', hindi: 'ग्वार', minTemp: 25, maxTemp: 40, minHumid: 30, maxHumid: 60, minPh: 6.5, maxPh: 8.0, minRain: 30, maxRain: 70, profit: '₹30,000-40,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Field Bean (Mochai)', tamil: 'மொச்சை', hindi: 'मोठ', minTemp: 22, maxTemp: 36, minHumid: 55, maxHumid: 82, minPh: 6.0, maxPh: 7.5, minRain: 55, maxRain: 110, profit: '₹35,000-48,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Lentil P 1213', tamil: 'மூங்கில் பருப்பு P 1213', hindi: 'मसूर P 1213', minTemp: 14, maxTemp: 24, minHumid: 40, maxHumid: 65, minPh: 6.0, maxPh: 8.0, minRain: 35, maxRain: 75, profit: '₹35,000-45,000/acre', season: 'Rabi', water: 'Low' },
  { name: 'Lentil L 4703', tamil: 'மூங்கில் பருப்பு L 4703', hindi: 'मसूर L 4703', minTemp: 14, maxTemp: 24, minHumid: 40, maxHumid: 65, minPh: 6.0, maxPh: 8.0, minRain: 35, maxRain: 75, profit: '₹36,000-46,000/acre', season: 'Rabi', water: 'Low' },
  { name: 'Garden Pea Arkel', tamil: 'காய்கறிப் பீன்ஸ் Arkel', hindi: 'मटर Arkel', minTemp: 10, maxTemp: 20, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 50, maxRain: 100, profit: '₹40,000-55,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Lab-Lab CO 1', tamil: 'பச்சைப் பருப்பு Lab-Lab', hindi: 'लबलब CO 1', minTemp: 22, maxTemp: 36, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 55, maxRain: 110, profit: '₹35,000-48,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Groundnut', tamil: 'வேர்க்கடலை', hindi: 'मूंगफली', minTemp: 24, maxTemp: 35, minHumid: 45, maxHumid: 70, minPh: 6.0, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹50,000-60,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Groundnut CO 1', tamil: 'வேர்க்கடலை CO 1', hindi: 'मूंगफली CO 1', minTemp: 24, maxTemp: 34, minHumid: 45, maxHumid: 68, minPh: 6.0, maxPh: 7.0, minRain: 62, maxRain: 118, profit: '₹50,000-58,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Groundnut VRI 1', tamil: 'வேர்க்கடலை VRI 1', hindi: 'मूंगफली VRI 1', minTemp: 24, maxTemp: 35, minHumid: 45, maxHumid: 70, minPh: 6.0, maxPh: 7.0, minRain: 62, maxRain: 120, profit: '₹52,000-60,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Sesame (Gingelly)', tamil: 'எள்', hindi: 'तिल', minTemp: 25, maxTemp: 38, minHumid: 40, maxHumid: 70, minPh: 5.5, maxPh: 7.5, minRain: 40, maxRain: 80, profit: '₹40,000-55,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Sunflower', tamil: 'சூரியகாந்தி', hindi: 'सूरजमुखी', minTemp: 20, maxTemp: 35, minHumid: 50, maxHumid: 75, minPh: 6.0, maxPh: 7.5, minRain: 50, maxRain: 120, profit: '₹38,000-50,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Castor', tamil: 'ஆமணக்கு', hindi: 'अरंडी', minTemp: 25, maxTemp: 38, minHumid: 40, maxHumid: 68, minPh: 5.5, maxPh: 7.5, minRain: 50, maxRain: 100, profit: '₹40,000-55,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Niger Seed', tamil: 'காட்டு எள்ளு', hindi: 'रामतिल', minTemp: 18, maxTemp: 32, minHumid: 50, maxHumid: 80, minPh: 5.5, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹28,000-38,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Mustard CO 1', tamil: 'கடுகு CO 1', hindi: 'सरसों CO 1', minTemp: 12, maxTemp: 25, minHumid: 45, maxHumid: 72, minPh: 6.0, maxPh: 7.5, minRain: 35, maxRain: 80, profit: '₹30,000-42,000/acre', season: 'Rabi', water: 'Low' },
  { name: 'Mustard CO 2', tamil: 'கடுகு CO 2', hindi: 'सरसों CO 2', minTemp: 12, maxTemp: 26, minHumid: 45, maxHumid: 72, minPh: 6.0, maxPh: 7.5, minRain: 35, maxRain: 80, profit: '₹32,000-44,000/acre', season: 'Rabi', water: 'Low' },
  { name: 'Cotton', tamil: 'பருத்தி', hindi: 'कपास', minTemp: 25, maxTemp: 40, minHumid: 40, maxHumid: 70, minPh: 6.0, maxPh: 8.0, minRain: 50, maxRain: 100, profit: '₹55,000-65,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Cotton MCU 5', tamil: 'பருத்தி MCU 5', hindi: 'कपास MCU 5', minTemp: 26, maxTemp: 40, minHumid: 40, maxHumid: 68, minPh: 6.0, maxPh: 8.0, minRain: 52, maxRain: 98, profit: '₹57,000-66,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Cotton MCU 13', tamil: 'பருத்தி MCU 13', hindi: 'कपास MCU 13', minTemp: 26, maxTemp: 40, minHumid: 40, maxHumid: 70, minPh: 6.0, maxPh: 8.0, minRain: 52, maxRain: 100, profit: '₹58,000-68,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Cotton H 1098', tamil: 'பருத்தி H 1098', hindi: 'कपास H 1098', minTemp: 25, maxTemp: 40, minHumid: 40, maxHumid: 70, minPh: 6.0, maxPh: 8.0, minRain: 50, maxRain: 100, profit: '₹58,000-67,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'BT Cotton', tamil: 'பிடி பருத்தி', hindi: 'BT कपास', minTemp: 25, maxTemp: 40, minHumid: 40, maxHumid: 70, minPh: 6.0, maxPh: 8.0, minRain: 55, maxRain: 110, profit: '₹60,000-75,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Sunn Hemp', tamil: 'சணப்பை', hindi: 'सनई', minTemp: 22, maxTemp: 38, minHumid: 55, maxHumid: 85, minPh: 5.5, maxPh: 7.5, minRain: 60, maxRain: 140, profit: '₹20,000-28,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Sugarcane', tamil: 'கரும்பு', hindi: 'गन्ना', minTemp: 26, maxTemp: 38, minHumid: 65, maxHumid: 90, minPh: 6.0, maxPh: 7.5, minRain: 100, maxRain: 200, profit: '₹60,000-70,000/acre', season: 'Annual', water: 'High' },
  { name: 'Sugarcane CO 1148', tamil: 'கரும்பு CO 1148', hindi: 'गन्ना CO 1148', minTemp: 27, maxTemp: 38, minHumid: 65, maxHumid: 88, minPh: 6.0, maxPh: 7.5, minRain: 100, maxRain: 190, profit: '₹60,000-68,000/acre', season: 'Annual', water: 'High' },
  { name: 'Sugarcane CO 213', tamil: 'கரும்பு CO 213', hindi: 'गन्ना CO 213', minTemp: 26, maxTemp: 37, minHumid: 65, maxHumid: 90, minPh: 6.0, maxPh: 7.5, minRain: 100, maxRain: 195, profit: '₹58,000-66,000/acre', season: 'Annual', water: 'High' },
  { name: 'Tapioca (Cassava)', tamil: 'மரவள்ளிக்கிழங்கு', hindi: 'कसावा', minTemp: 25, maxTemp: 38, minHumid: 60, maxHumid: 90, minPh: 5.5, maxPh: 7.0, minRain: 80, maxRain: 150, profit: '₹40,000-55,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Tapioca H-97', tamil: 'மரவள்ளி H-97', hindi: 'कसावा H-97', minTemp: 25, maxTemp: 38, minHumid: 60, maxHumid: 88, minPh: 5.5, maxPh: 7.0, minRain: 82, maxRain: 145, profit: '₹42,000-55,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Tapioca Sree Sahya', tamil: 'மரவள்ளி Sree Sahya', hindi: 'कसावा Sree Sahya', minTemp: 25, maxTemp: 36, minHumid: 62, maxHumid: 90, minPh: 5.5, maxPh: 7.0, minRain: 85, maxRain: 150, profit: '₹43,000-57,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Potato', tamil: 'உருளைக்கிழங்கு', hindi: 'आलू', minTemp: 14, maxTemp: 24, minHumid: 60, maxHumid: 85, minPh: 5.5, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹60,000-80,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Potato Kufri Jyoti', tamil: 'உருளை Kufri Jyoti', hindi: 'आलू Kufri Jyoti', minTemp: 14, maxTemp: 22, minHumid: 60, maxHumid: 85, minPh: 5.5, maxPh: 7.0, minRain: 62, maxRain: 115, profit: '₹62,000-80,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Potato Kufri Badshah', tamil: 'உருளை Kufri Badshah', hindi: 'आलू Kufri Badshah', minTemp: 14, maxTemp: 22, minHumid: 60, maxHumid: 84, minPh: 5.5, maxPh: 7.0, minRain: 62, maxRain: 118, profit: '₹63,000-81,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Potato Kufri Chandramukhi', tamil: 'உருளை Chandramukhi', hindi: 'आलू Kufri Chandramukhi', minTemp: 13, maxTemp: 22, minHumid: 60, maxHumid: 85, minPh: 5.5, maxPh: 7.0, minRain: 60, maxRain: 115, profit: '₹60,000-78,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Potato Kufri Giriraj', tamil: 'உருளை Kufri Giriraj', hindi: 'आलू Kufri Giriraj', minTemp: 13, maxTemp: 22, minHumid: 60, maxHumid: 85, minPh: 5.5, maxPh: 7.0, minRain: 60, maxRain: 115, profit: '₹61,000-79,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Potato Kufri Sudarshan', tamil: 'உருளை Kufri Sudarshan', hindi: 'आलू Kufri Sudarshan', minTemp: 14, maxTemp: 23, minHumid: 60, maxHumid: 85, minPh: 5.5, maxPh: 7.0, minRain: 62, maxRain: 118, profit: '₹62,000-80,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Potato Kufri Pukhraj', tamil: 'உருளை Kufri Pukhraj', hindi: 'आलू Kufri Pukhraj', minTemp: 14, maxTemp: 23, minHumid: 60, maxHumid: 85, minPh: 5.5, maxPh: 7.0, minRain: 62, maxRain: 118, profit: '₹62,000-80,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Sweet Potato', tamil: 'சர்க்கரை வள்ளிக்கிழங்கு', hindi: 'शकरकंद', minTemp: 22, maxTemp: 35, minHumid: 55, maxHumid: 82, minPh: 5.5, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹40,000-55,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Yam', tamil: 'சேனைக்கிழங்கு', hindi: 'रतालू', minTemp: 25, maxTemp: 38, minHumid: 65, maxHumid: 90, minPh: 5.5, maxPh: 7.0, minRain: 80, maxRain: 160, profit: '₹45,000-60,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Elephant Foot Yam', tamil: 'கருணைக்கிழங்கு', hindi: 'सूरन', minTemp: 25, maxTemp: 38, minHumid: 65, maxHumid: 90, minPh: 5.5, maxPh: 7.5, minRain: 80, maxRain: 150, profit: '₹50,000-65,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Colocasia (Taro)', tamil: 'சேப்பன்கிழங்கு', hindi: 'अरबी', minTemp: 22, maxTemp: 35, minHumid: 65, maxHumid: 90, minPh: 5.5, maxPh: 7.0, minRain: 80, maxRain: 160, profit: '₹40,000-55,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Beetroot Detroit', tamil: 'பீட்ரூட் Detroit', hindi: 'चुकंदर Detroit', minTemp: 12, maxTemp: 23, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 55, maxRain: 108, profit: '₹45,000-60,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Beetroot Burpee', tamil: 'பீட்ரூட் Burpee', hindi: 'चुकंदर Burpee', minTemp: 12, maxTemp: 23, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 55, maxRain: 110, profit: '₹46,000-61,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Arrowroot', tamil: 'குழைவட்டை', hindi: 'अरारोट', minTemp: 22, maxTemp: 36, minHumid: 65, maxHumid: 90, minPh: 5.5, maxPh: 7.0, minRain: 80, maxRain: 160, profit: '₹35,000-50,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Banana', tamil: 'வாழை', hindi: 'केला', minTemp: 24, maxTemp: 36, minHumid: 65, maxHumid: 90, minPh: 5.5, maxPh: 7.5, minRain: 100, maxRain: 200, profit: '₹70,000-80,000/acre', season: 'Annual', water: 'High' },
  { name: 'Banana Grand Naine', tamil: 'வாழை Grand Naine', hindi: 'केला Grand Naine', minTemp: 24, maxTemp: 35, minHumid: 65, maxHumid: 90, minPh: 5.5, maxPh: 7.5, minRain: 100, maxRain: 195, profit: '₹72,000-82,000/acre', season: 'Annual', water: 'High' },
  { name: 'Banana Robusta', tamil: 'வாழை Robusta', hindi: 'केला Robusta', minTemp: 24, maxTemp: 35, minHumid: 65, maxHumid: 88, minPh: 5.5, maxPh: 7.5, minRain: 100, maxRain: 195, profit: '₹70,000-80,000/acre', season: 'Annual', water: 'High' },
  { name: 'Nendran Banana', tamil: 'நேந்திரம் வாழை', hindi: 'नेंद्रन केला', minTemp: 25, maxTemp: 36, minHumid: 65, maxHumid: 88, minPh: 5.5, maxPh: 7.5, minRain: 100, maxRain: 200, profit: '₹75,000-90,000/acre', season: 'Annual', water: 'High' },
  { name: 'Banana Poovan', tamil: 'வாழை பூவன்', hindi: 'केला पूवन', minTemp: 24, maxTemp: 35, minHumid: 65, maxHumid: 88, minPh: 5.5, maxPh: 7.5, minRain: 100, maxRain: 190, profit: '₹65,000-78,000/acre', season: 'Annual', water: 'High' },
  { name: 'Banana Monthan', tamil: 'வாழை மொந்தன்', hindi: 'केला मोन्थन', minTemp: 25, maxTemp: 36, minHumid: 65, maxHumid: 88, minPh: 5.5, maxPh: 7.5, minRain: 102, maxRain: 198, profit: '₹66,000-79,000/acre', season: 'Annual', water: 'High' },
  { name: 'Banana Mysore', tamil: 'வாழை மைசூர்', hindi: 'केला मैसूर', minTemp: 24, maxTemp: 35, minHumid: 65, maxHumid: 88, minPh: 5.5, maxPh: 7.5, minRain: 100, maxRain: 190, profit: '₹65,000-77,000/acre', season: 'Annual', water: 'High' },
  { name: 'Mango', tamil: 'மாம்பழம்', hindi: 'आम', minTemp: 24, maxTemp: 40, minHumid: 45, maxHumid: 75, minPh: 5.5, maxPh: 7.5, minRain: 50, maxRain: 130, profit: '₹60,000-90,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Mango Totapuri', tamil: 'மாங்காய் Totapuri', hindi: 'आम Totapuri', minTemp: 24, maxTemp: 40, minHumid: 45, maxHumid: 72, minPh: 5.5, maxPh: 7.5, minRain: 52, maxRain: 125, profit: '₹62,000-88,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Mango Banganapalli', tamil: 'மாங்காய் Banganapalli', hindi: 'आम Banganapalli', minTemp: 25, maxTemp: 40, minHumid: 44, maxHumid: 70, minPh: 5.5, maxPh: 7.5, minRain: 50, maxRain: 128, profit: '₹65,000-92,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Mango Malgova', tamil: 'மாங்காய் மல்கோவா', hindi: 'आम मल्गोवा', minTemp: 25, maxTemp: 40, minHumid: 45, maxHumid: 74, minPh: 5.5, maxPh: 7.5, minRain: 52, maxRain: 130, profit: '₹70,000-95,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Mango Algaroba', tamil: 'மாங்காய் Algaroba', hindi: 'आम Algaroba', minTemp: 24, maxTemp: 40, minHumid: 44, maxHumid: 72, minPh: 5.5, maxPh: 7.5, minRain: 50, maxRain: 125, profit: '₹62,000-88,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Coconut', tamil: 'தேங்காய்', hindi: 'नारियल', minTemp: 22, maxTemp: 38, minHumid: 60, maxHumid: 90, minPh: 5.5, maxPh: 8.0, minRain: 80, maxRain: 200, profit: '₹60,000-80,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Coconut West Coast Tall', tamil: 'தேங்காய் West Coast Tall', hindi: 'नारियल West Coast Tall', minTemp: 22, maxTemp: 37, minHumid: 60, maxHumid: 90, minPh: 5.5, maxPh: 8.0, minRain: 82, maxRain: 195, profit: '₹60,000-78,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Coconut Chowghat Orange Dwarf', tamil: 'தேங்காய் Chowghat Dwarf', hindi: 'नारियल Chowghat Dwarf', minTemp: 22, maxTemp: 36, minHumid: 62, maxHumid: 90, minPh: 5.5, maxPh: 8.0, minRain: 80, maxRain: 198, profit: '₹62,000-80,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Cashew Nut', tamil: 'முந்திரி', hindi: 'काजू', minTemp: 24, maxTemp: 40, minHumid: 50, maxHumid: 80, minPh: 6.0, maxPh: 8.0, minRain: 50, maxRain: 130, profit: '₹50,000-80,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Tamarind', tamil: 'புளி', hindi: 'इमली', minTemp: 25, maxTemp: 40, minHumid: 40, maxHumid: 70, minPh: 6.0, maxPh: 8.0, minRain: 40, maxRain: 100, profit: '₹40,000-60,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Grape', tamil: 'திராட்சை', hindi: 'अंगूर', minTemp: 15, maxTemp: 35, minHumid: 45, maxHumid: 75, minPh: 6.0, maxPh: 7.5, minRain: 50, maxRain: 100, profit: '₹1,20,000-1,80,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Orange Nagpur', tamil: 'ஆரஞ்சு Nagpur', hindi: 'संतरा Nagpur', minTemp: 20, maxTemp: 33, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 60, maxRain: 130, profit: '₹65,000-90,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Orange Kinnow', tamil: 'ஆரஞ்சு Kinnow', hindi: 'संतरा Kinnow', minTemp: 18, maxTemp: 32, minHumid: 50, maxHumid: 78, minPh: 6.0, maxPh: 7.5, minRain: 55, maxRain: 125, profit: '₹68,000-92,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Papaya', tamil: 'பப்பாளி', hindi: 'पपीता', minTemp: 22, maxTemp: 36, minHumid: 60, maxHumid: 85, minPh: 6.0, maxPh: 7.0, minRain: 80, maxRain: 150, profit: '₹50,000-70,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Papaya Red Lady', tamil: 'பப்பாளி Red Lady', hindi: 'पपीता Red Lady', minTemp: 22, maxTemp: 35, minHumid: 60, maxHumid: 85, minPh: 6.0, maxPh: 7.0, minRain: 80, maxRain: 148, profit: '₹52,000-72,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Papaya Pusa Delicious', tamil: 'பப்பாளி Pusa Delicious', hindi: 'पपीता Pusa Delicious', minTemp: 22, maxTemp: 35, minHumid: 60, maxHumid: 84, minPh: 6.0, maxPh: 7.0, minRain: 80, maxRain: 148, profit: '₹52,000-70,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Pineapple', tamil: 'அன்னாசி', hindi: 'अनानास', minTemp: 22, maxTemp: 32, minHumid: 70, maxHumid: 90, minPh: 4.5, maxPh: 6.5, minRain: 100, maxRain: 200, profit: '₹55,000-75,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Passion Fruit', tamil: 'பேஷன் பழம்', hindi: 'पैशनफ्रूट', minTemp: 20, maxTemp: 30, minHumid: 65, maxHumid: 85, minPh: 6.0, maxPh: 7.0, minRain: 100, maxRain: 180, profit: '₹80,000-1,10,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Dragon Fruit', tamil: 'டிராகன் பழம்', hindi: 'ड्रैगन फ्रूट', minTemp: 20, maxTemp: 38, minHumid: 50, maxHumid: 80, minPh: 6.0, maxPh: 7.0, minRain: 50, maxRain: 120, profit: '₹1,50,000-2,50,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Pomegranate', tamil: 'மாதுளை', hindi: 'अनार', minTemp: 20, maxTemp: 38, minHumid: 40, maxHumid: 70, minPh: 5.5, maxPh: 7.5, minRain: 40, maxRain: 90, profit: '₹1,00,000-1,50,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Fig', tamil: 'அத்திப்பழம்', hindi: 'अंजीर', minTemp: 18, maxTemp: 35, minHumid: 45, maxHumid: 72, minPh: 6.0, maxPh: 8.0, minRain: 40, maxRain: 90, profit: '₹80,000-1,20,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Custard Apple', tamil: 'சீதாப்பழம்', hindi: 'शरीफा', minTemp: 22, maxTemp: 38, minHumid: 50, maxHumid: 80, minPh: 5.5, maxPh: 7.5, minRain: 50, maxRain: 110, profit: '₹70,000-1,00,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Sapota (Chikoo)', tamil: 'சப்போட்டா', hindi: 'चीकू', minTemp: 22, maxTemp: 36, minHumid: 60, maxHumid: 85, minPh: 6.0, maxPh: 8.0, minRain: 70, maxRain: 150, profit: '₹70,000-1,00,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Guava', tamil: 'கொய்யா', hindi: 'अमरूद', minTemp: 22, maxTemp: 38, minHumid: 50, maxHumid: 80, minPh: 5.0, maxPh: 7.5, minRain: 50, maxRain: 120, profit: '₹65,000-90,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Avocado', tamil: 'வெண்ணெய் பழம்', hindi: 'एवोकाडो', minTemp: 15, maxTemp: 30, minHumid: 65, maxHumid: 85, minPh: 5.5, maxPh: 7.0, minRain: 100, maxRain: 200, profit: '₹1,50,000-2,50,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Jackfruit', tamil: 'பலாப்பழம்', hindi: 'कटहल', minTemp: 24, maxTemp: 36, minHumid: 65, maxHumid: 90, minPh: 6.0, maxPh: 7.5, minRain: 100, maxRain: 200, profit: '₹55,000-80,000/acre', season: 'Annual', water: 'High' },
  { name: 'Acid Lime', tamil: 'எலுமிச்சை', hindi: 'नींबू', minTemp: 22, maxTemp: 38, minHumid: 50, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 50, maxRain: 130, profit: '₹60,000-85,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Ber (Indian Jujube)', tamil: 'இலந்தை', hindi: 'बेर', minTemp: 24, maxTemp: 42, minHumid: 35, maxHumid: 65, minPh: 6.0, maxPh: 8.5, minRain: 30, maxRain: 80, profit: '₹40,000-60,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Amla (Indian Gooseberry)', tamil: 'நெல்லிக்காய்', hindi: 'आंवला', minTemp: 20, maxTemp: 38, minHumid: 45, maxHumid: 75, minPh: 6.0, maxPh: 8.0, minRain: 50, maxRain: 120, profit: '₹50,000-75,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Arecanut', tamil: 'பாக்கு', hindi: 'सुपारी', minTemp: 22, maxTemp: 35, minHumid: 65, maxHumid: 90, minPh: 6.0, maxPh: 7.5, minRain: 100, maxRain: 200, profit: '₹80,000-1,20,000/acre', season: 'Annual', water: 'High' },
  { name: 'Tomato', tamil: 'தக்காளி', hindi: 'टमाटर', minTemp: 20, maxTemp: 32, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹50,000-70,000/acre', season: 'All Season', water: 'Medium' },
  { name: 'Tomato PKM 1', tamil: 'தக்காளி PKM 1', hindi: 'टमाटर PKM 1', minTemp: 20, maxTemp: 30, minHumid: 55, maxHumid: 78, minPh: 6.0, maxPh: 7.0, minRain: 62, maxRain: 118, profit: '₹52,000-68,000/acre', season: 'All Season', water: 'Medium' },
  { name: 'Tomato PKM 2', tamil: 'தக்காளி PKM 2', hindi: 'टमाटर PKM 2', minTemp: 20, maxTemp: 31, minHumid: 55, maxHumid: 79, minPh: 6.0, maxPh: 7.0, minRain: 62, maxRain: 118, profit: '₹52,000-68,000/acre', season: 'All Season', water: 'Medium' },
  { name: 'Tomato Arka Vikas', tamil: 'தக்காளி Arka Vikas', hindi: 'टमाटर Arka Vikas', minTemp: 20, maxTemp: 32, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.0, minRain: 62, maxRain: 120, profit: '₹53,000-70,000/acre', season: 'All Season', water: 'Medium' },
  { name: 'Tomato Arka Abhijit', tamil: 'தக்காளி Arka Abhijit', hindi: 'टमाटर Arka Abhijit', minTemp: 20, maxTemp: 32, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.0, minRain: 62, maxRain: 120, profit: '₹53,000-70,000/acre', season: 'All Season', water: 'Medium' },
  { name: 'Brinjal (Eggplant)', tamil: 'கத்திரிக்காய்', hindi: 'बैंगन', minTemp: 22, maxTemp: 35, minHumid: 55, maxHumid: 80, minPh: 5.5, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹45,000-60,000/acre', season: 'All Season', water: 'Medium' },
  { name: 'Brinjal Arka Neelkanth', tamil: 'கத்திரி Arka Neelkanth', hindi: 'बैंगन Arka Neelkanth', minTemp: 22, maxTemp: 34, minHumid: 55, maxHumid: 80, minPh: 5.5, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹46,000-62,000/acre', season: 'All Season', water: 'Medium' },
  { name: 'Okra (Ladies Finger)', tamil: 'வெண்டைக்காய்', hindi: 'भिंडी', minTemp: 24, maxTemp: 38, minHumid: 50, maxHumid: 78, minPh: 6.0, maxPh: 7.0, minRain: 55, maxRain: 110, profit: '₹45,000-60,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Okra Arka Anamika', tamil: 'வெண்டை Arka Anamika', hindi: 'भिंडी Arka Anamika', minTemp: 25, maxTemp: 38, minHumid: 50, maxHumid: 78, minPh: 6.0, maxPh: 7.0, minRain: 55, maxRain: 108, profit: '₹47,000-62,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Okra Parbhani Kranti', tamil: 'வெண்டை Parbhani Kranti', hindi: 'भिंडी Parbhani Kranti', minTemp: 24, maxTemp: 37, minHumid: 50, maxHumid: 78, minPh: 6.0, maxPh: 7.0, minRain: 55, maxRain: 110, profit: '₹46,000-60,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Onion', tamil: 'வெங்காயம்', hindi: 'प्याज', minTemp: 18, maxTemp: 30, minHumid: 50, maxHumid: 75, minPh: 6.0, maxPh: 7.5, minRain: 50, maxRain: 100, profit: '₹60,000-80,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Shallot (Small Onion)', tamil: 'சிறிய வெங்காயம்', hindi: 'छोटा प्याज', minTemp: 18, maxTemp: 30, minHumid: 50, maxHumid: 75, minPh: 6.0, maxPh: 7.5, minRain: 50, maxRain: 100, profit: '₹65,000-85,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Onion Agrifound Dark Red', tamil: 'வெங்காயம் Agrifound Dark Red', hindi: 'प्याज Agrifound Dark Red', minTemp: 18, maxTemp: 29, minHumid: 50, maxHumid: 74, minPh: 6.0, maxPh: 7.5, minRain: 52, maxRain: 98, profit: '₹62,000-82,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Onion Vijay', tamil: 'வெங்காயம் Vijay', hindi: 'प्याज Vijay', minTemp: 18, maxTemp: 30, minHumid: 50, maxHumid: 75, minPh: 6.0, maxPh: 7.5, minRain: 50, maxRain: 100, profit: '₹63,000-83,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Chilli', tamil: 'மிளகாய்', hindi: 'मिर्च', minTemp: 22, maxTemp: 35, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹60,000-80,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Chilli PKM 1', tamil: 'மிளகாய் PKM 1', hindi: 'मिर्च PKM 1', minTemp: 22, maxTemp: 34, minHumid: 55, maxHumid: 78, minPh: 6.0, maxPh: 7.0, minRain: 62, maxRain: 118, profit: '₹62,000-80,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Chilli Arka Manik', tamil: 'மிளகாய் Arka Manik', hindi: 'मिर्च Arka Manik', minTemp: 23, maxTemp: 35, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹63,000-82,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Dry Chilli', tamil: 'வற்றல் மிளகாய்', hindi: 'सूखी मिर्च', minTemp: 23, maxTemp: 35, minHumid: 50, maxHumid: 75, minPh: 6.0, maxPh: 7.0, minRain: 55, maxRain: 110, profit: '₹65,000-85,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Capsicum (Bell Pepper)', tamil: 'குடை மிளகாய்', hindi: 'शिमला मिर्च', minTemp: 18, maxTemp: 30, minHumid: 60, maxHumid: 85, minPh: 6.0, maxPh: 7.0, minRain: 70, maxRain: 130, profit: '₹70,000-1,00,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Ponni Rice', tamil: 'பொன்னி', hindi: 'पोन्नी चावल', minTemp: 22, maxTemp: 34, minHumid: 70, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 155, maxRain: 295, profit: '₹46,000-52,000/acre', season: 'Kharif', water: 'High' },
  { name: 'ADT 43 Rice', tamil: 'ADT 43 நெல்', hindi: 'ADT 43 धान', minTemp: 22, maxTemp: 35, minHumid: 70, maxHumid: 98, minPh: 5.5, maxPh: 7.5, minRain: 152, maxRain: 275, profit: '₹46,000-52,000/acre', season: 'Kharif', water: 'High' },
  { name: 'ADT 46 Rice', tamil: 'ADT 46 நெல்', hindi: 'ADT 46 धान', minTemp: 22, maxTemp: 35, minHumid: 70, maxHumid: 98, minPh: 5.5, maxPh: 7.5, minRain: 152, maxRain: 275, profit: '₹46,000-52,000/acre', season: 'Kharif', water: 'High' },
  { name: 'ASD 18 Rice', tamil: 'ASD 18 நெல்', hindi: 'ASD 18 धान', minTemp: 22, maxTemp: 35, minHumid: 70, maxHumid: 98, minPh: 5.5, maxPh: 7.5, minRain: 152, maxRain: 275, profit: '₹46,000-52,000/acre', season: 'Kharif', water: 'High' },
  { name: 'CO 51 Rice', tamil: 'CO 51 நெல்', hindi: 'CO 51 धान', minTemp: 22, maxTemp: 35, minHumid: 70, maxHumid: 98, minPh: 5.5, maxPh: 7.5, minRain: 152, maxRain: 275, profit: '₹46,000-52,000/acre', season: 'Kharif', water: 'High' },
  { name: 'CO 52 Rice', tamil: 'CO 52 நெல்', hindi: 'CO 52 धान', minTemp: 22, maxTemp: 35, minHumid: 70, maxHumid: 98, minPh: 5.5, maxPh: 7.5, minRain: 152, maxRain: 275, profit: '₹46,000-52,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Cumbu CO 7', tamil: 'கம்பு CO 7', hindi: 'बाजरा CO 7', minTemp: 25, maxTemp: 42, minHumid: 28, maxHumid: 60, minPh: 6.0, maxPh: 8.0, minRain: 28, maxRain: 80, profit: '₹23,000-32,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Ragi CO 14', tamil: 'கேழ்வரகு CO 14', hindi: 'रागी CO 14', minTemp: 20, maxTemp: 35, minHumid: 50, maxHumid: 80, minPh: 5.5, maxPh: 7.5, minRain: 55, maxRain: 120, profit: '₹30,000-40,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Kodo Millet CO 3', tamil: 'வரகு CO 3', hindi: 'कोदो CO 3', minTemp: 20, maxTemp: 35, minHumid: 40, maxHumid: 70, minPh: 5.0, maxPh: 7.0, minRain: 42, maxRain: 90, profit: '₹24,000-32,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Little Millet CO 2', tamil: 'சாமை CO 2', hindi: 'कुटकी CO 2', minTemp: 20, maxTemp: 35, minHumid: 40, maxHumid: 70, minPh: 5.0, maxPh: 7.0, minRain: 40, maxRain: 90, profit: '₹24,000-32,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Blackgram ADT 3', tamil: 'உளுந்து ADT 3', hindi: 'उड़द ADT 3', minTemp: 22, maxTemp: 35, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 60, maxRain: 100, profit: '₹40,000-50,000/acre', season: 'Rabi', water: 'Low' },
  { name: 'Greengram CO 6', tamil: 'பாசிப்பயறு CO 6', hindi: 'मूंग CO 6', minTemp: 24, maxTemp: 35, minHumid: 50, maxHumid: 75, minPh: 6.0, maxPh: 7.5, minRain: 60, maxRain: 100, profit: '₹38,000-48,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Redgram CO 8', tamil: 'துவரை CO 8', hindi: 'अरहर CO 8', minTemp: 25, maxTemp: 38, minHumid: 50, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 60, maxRain: 130, profit: '₹42,000-52,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Horsegram CO 1', tamil: 'கொள்ளு CO 1', hindi: 'कुलथी CO 1', minTemp: 22, maxTemp: 38, minHumid: 45, maxHumid: 72, minPh: 5.5, maxPh: 7.5, minRain: 40, maxRain: 90, profit: '₹30,000-40,000/acre', season: 'Rabi', water: 'Low' },
  { name: 'Groundnut TMV 7', tamil: 'வேர்க்கடலை TMV 7', hindi: 'मूंगफली TMV 7', minTemp: 24, maxTemp: 35, minHumid: 45, maxHumid: 70, minPh: 6.0, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹50,000-60,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Groundnut TMV 13', tamil: 'வேர்க்கடலை TMV 13', hindi: 'मूंगफली TMV 13', minTemp: 24, maxTemp: 35, minHumid: 45, maxHumid: 70, minPh: 6.0, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹50,000-60,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Groundnut VRI 2', tamil: 'வேர்க்கடலை VRI 2', hindi: 'मूंगफली VRI 2', minTemp: 24, maxTemp: 35, minHumid: 45, maxHumid: 70, minPh: 6.0, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹52,000-60,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Cotton MCU 7', tamil: 'பருத்தி MCU 7', hindi: 'कपास MCU 7', minTemp: 25, maxTemp: 40, minHumid: 40, maxHumid: 70, minPh: 6.0, maxPh: 8.0, minRain: 50, maxRain: 100, profit: '₹55,000-65,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Cotton MCU 12', tamil: 'பருத்தி MCU 12', hindi: 'कपास MCU 12', minTemp: 25, maxTemp: 40, minHumid: 40, maxHumid: 70, minPh: 6.0, maxPh: 8.0, minRain: 50, maxRain: 100, profit: '₹55,000-65,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Cotton Surabhi', tamil: 'பருத்தி சுரபி', hindi: 'कपास सुरभि', minTemp: 25, maxTemp: 40, minHumid: 40, maxHumid: 70, minPh: 6.0, maxPh: 8.0, minRain: 50, maxRain: 100, profit: '₹55,000-65,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Sugarcane CO 86032', tamil: 'கரும்பு CO 86032', hindi: 'गन्ना CO 86032', minTemp: 26, maxTemp: 38, minHumid: 65, maxHumid: 90, minPh: 6.0, maxPh: 7.5, minRain: 100, maxRain: 200, profit: '₹60,000-70,000/acre', season: 'Annual', water: 'High' },
  { name: 'Sugarcane COC 671', tamil: 'கரும்பு COC 671', hindi: 'गन्ना COC 671', minTemp: 26, maxTemp: 38, minHumid: 65, maxHumid: 90, minPh: 6.0, maxPh: 7.5, minRain: 100, maxRain: 200, profit: '₹60,000-70,000/acre', season: 'Annual', water: 'High' },
  { name: 'Tapioca Sree Vijaya', tamil: 'மரவள்ளி Sree Vijaya', hindi: 'कसावा Sree Vijaya', minTemp: 25, maxTemp: 38, minHumid: 60, maxHumid: 90, minPh: 5.5, maxPh: 7.0, minRain: 80, maxRain: 150, profit: '₹40,000-55,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Tapioca CO 2', tamil: 'மரவள்ளி CO 2', hindi: 'कसावा CO 2', minTemp: 25, maxTemp: 38, minHumid: 60, maxHumid: 90, minPh: 5.5, maxPh: 7.0, minRain: 80, maxRain: 150, profit: '₹40,000-55,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Mango Kesar', tamil: 'மாங்காய் கேசர்', hindi: 'आम केसर', minTemp: 24, maxTemp: 40, minHumid: 45, maxHumid: 75, minPh: 5.5, maxPh: 7.5, minRain: 50, maxRain: 130, profit: '₹60,000-90,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Mango Alphonso', tamil: 'மாங்காய் அல்போன்சோ', hindi: 'आम अल्फांसो', minTemp: 24, maxTemp: 40, minHumid: 45, maxHumid: 75, minPh: 5.5, maxPh: 7.5, minRain: 50, maxRain: 130, profit: '₹60,000-90,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Coconut East Coast Tall', tamil: 'தேங்காய் East Coast Tall', hindi: 'नारियल East Coast Tall', minTemp: 22, maxTemp: 38, minHumid: 60, maxHumid: 90, minPh: 5.5, maxPh: 8.0, minRain: 80, maxRain: 200, profit: '₹60,000-80,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Tomato Arka Rakshak', tamil: 'தக்காளி Arka Rakshak', hindi: 'टमाटर Arka Rakshak', minTemp: 20, maxTemp: 32, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹50,000-70,000/acre', season: 'All Season', water: 'Medium' },
  { name: 'Brinjal CO 2', tamil: 'கத்திரி CO 2', hindi: 'बैंगन CO 2', minTemp: 22, maxTemp: 35, minHumid: 55, maxHumid: 80, minPh: 5.5, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹45,000-60,000/acre', season: 'All Season', water: 'Medium' },
  { name: 'Okra CO 4', tamil: 'வெண்டை CO 4', hindi: 'भिंडी CO 4', minTemp: 24, maxTemp: 38, minHumid: 50, maxHumid: 78, minPh: 6.0, maxPh: 7.0, minRain: 55, maxRain: 110, profit: '₹45,000-60,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Onion CO 1', tamil: 'வெங்காயம் CO 1', hindi: 'प्याज CO 1', minTemp: 18, maxTemp: 30, minHumid: 50, maxHumid: 75, minPh: 6.0, maxPh: 7.5, minRain: 50, maxRain: 100, profit: '₹60,000-80,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Chilli G4', tamil: 'மிளகாய் G4', hindi: 'मिर्च G4', minTemp: 22, maxTemp: 35, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹60,000-80,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Rice CO 59', tamil: 'நெல் CO 59', hindi: 'धान CO 59', minTemp: 23, maxTemp: 34, minHumid: 72, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 158, maxRain: 280, profit: '₹47,000-53,000/acre', season: 'Rabi', water: 'High' },
  { name: 'Rice ADT 56', tamil: 'நெல் ADT 56', hindi: 'धान ADT 56', minTemp: 22, maxTemp: 35, minHumid: 70, maxHumid: 98, minPh: 5.5, maxPh: 7.5, minRain: 150, maxRain: 275, profit: '₹46,000-52,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Rice ADT 60', tamil: 'நெல் ADT 60', hindi: 'धान ADT 60', minTemp: 23, maxTemp: 34, minHumid: 71, maxHumid: 99, minPh: 5.5, maxPh: 7.5, minRain: 155, maxRain: 280, profit: '₹47,000-53,000/acre', season: 'Rabi', water: 'High' },
  { name: 'Maize COH(M) 12', tamil: 'மக்காச்சோளம் COH(M) 12', hindi: 'मक्का COH(M) 12', minTemp: 18, maxTemp: 33, minHumid: 50, maxHumid: 80, minPh: 5.8, maxPh: 7.5, minRain: 60, maxRain: 150, profit: '₹40,000-50,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Blackgram VBN 12', tamil: 'உளுந்து VBN 12', hindi: 'उड़द VBN 12', minTemp: 22, maxTemp: 35, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 60, maxRain: 100, profit: '₹42,000-52,000/acre', season: 'Rabi', water: 'Low' },
  { name: 'Groundnut CTD 1', tamil: 'வேர்க்கடலை CTD 1', hindi: 'मूंगफली CTD 1', minTemp: 24, maxTemp: 35, minHumid: 45, maxHumid: 70, minPh: 6.0, maxPh: 7.0, minRain: 55, maxRain: 110, profit: '₹52,000-62,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Castor YRCH 3', tamil: 'ஆமணக்கு YRCH 3', hindi: 'अरंडी YRCH 3', minTemp: 25, maxTemp: 38, minHumid: 40, maxHumid: 68, minPh: 5.5, maxPh: 7.5, minRain: 50, maxRain: 100, profit: '₹42,000-58,000/acre', season: 'Kharif', water: 'Low' },
  { name: 'Tomato CO 4', tamil: 'தக்காளி CO 4', hindi: 'टमाटर CO 4', minTemp: 20, maxTemp: 32, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹55,000-75,000/acre', season: 'All Season', water: 'Medium' },
  { name: 'Okra CO(H) 5', tamil: 'வெண்டை CO(H) 5', hindi: 'भिंडी CO(H) 5', minTemp: 24, maxTemp: 38, minHumid: 50, maxHumid: 78, minPh: 6.0, maxPh: 7.0, minRain: 55, maxRain: 110, profit: '₹48,000-65,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Chilli CO 5', tamil: 'மிளகாய் CO 5', hindi: 'मिर्च CO 5', minTemp: 22, maxTemp: 35, minHumid: 55, maxHumid: 80, minPh: 6.0, maxPh: 7.0, minRain: 60, maxRain: 120, profit: '₹65,000-85,000/acre', season: 'Kharif', water: 'Medium' },
  { name: 'Ash Gourd PLR 1', tamil: 'பூசணிக்காய் PLR 1', hindi: 'पेठा PLR 1', minTemp: 22, maxTemp: 36, minHumid: 55, maxHumid: 85, minPh: 6.0, maxPh: 7.5, minRain: 60, maxRain: 120, profit: '₹35,000-50,000/acre', season: 'All Season', water: 'Medium' },
  { name: 'Banana Kaveri Vaaman', tamil: 'வாழை காவேரி வாமன்', hindi: 'केला कावेरी वामन', minTemp: 24, maxTemp: 36, minHumid: 65, maxHumid: 90, minPh: 5.5, maxPh: 7.5, minRain: 100, maxRain: 200, profit: '₹68,000-80,000/acre', season: 'Annual', water: 'High' },
  { name: 'Avocado TKD 2', tamil: 'வெண்ணெய் பழம் TKD 2', hindi: 'एवोकाडो TKD 2', minTemp: 15, maxTemp: 30, minHumid: 65, maxHumid: 85, minPh: 5.5, maxPh: 7.0, minRain: 100, maxRain: 200, profit: '₹1,60,000-2,60,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Acid Lime SNKL 1', tamil: 'எலுமிச்சை SNKL 1', hindi: 'नींबू SNKL 1', minTemp: 22, maxTemp: 38, minHumid: 50, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 50, maxRain: 130, profit: '₹62,000-88,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Coconut ALR 4', tamil: 'தேங்காய் ALR 4', hindi: 'नारियल ALR 4', minTemp: 22, maxTemp: 38, minHumid: 60, maxHumid: 90, minPh: 5.5, maxPh: 8.0, minRain: 80, maxRain: 200, profit: '₹62,000-82,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Nutmeg PPI 1', tamil: 'ஜாதிக்காய் PPI 1', hindi: 'जायफल PPI 1', minTemp: 22, maxTemp: 35, minHumid: 70, maxHumid: 90, minPh: 5.5, maxPh: 7.0, minRain: 150, maxRain: 300, profit: '₹80,000-1,20,000/acre', season: 'Annual', water: 'High' },
  { name: 'Sirukurinjan CO 1', tamil: 'சிறுகுறிஞ்சான் CO 1', hindi: 'छोटी गुड़मार CO 1', minTemp: 20, maxTemp: 35, minHumid: 60, maxHumid: 85, minPh: 5.5, maxPh: 7.5, minRain: 80, maxRain: 160, profit: '₹50,000-80,000/acre', season: 'Annual', water: 'Medium' },
  { name: 'Nerium Thovalai 1', tamil: 'நேரியம் தோவலை 1', hindi: 'कनेर थोवलाई 1', minTemp: 22, maxTemp: 38, minHumid: 50, maxHumid: 80, minPh: 6.0, maxPh: 8.0, minRain: 40, maxRain: 100, profit: '₹40,000-60,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Oyster Mushroom KKM 1', tamil: 'சிப்பி காளான் KKM 1', hindi: 'ऑयस्टर मशरूम KKM 1', minTemp: 20, maxTemp: 30, minHumid: 80, maxHumid: 95, minPh: 6.0, maxPh: 7.5, minRain: 80, maxRain: 150, profit: '₹60,000-90,000/acre', season: 'All Season', water: 'High' },
  { name: 'Palmyrah', tamil: 'பனை', hindi: 'ताड़', minTemp: 24, maxTemp: 42, minHumid: 35, maxHumid: 70, minPh: 6.0, maxPh: 8.5, minRain: 30, maxRain: 80, profit: '₹30,000-50,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Turmeric', tamil: 'மஞ்சள்', hindi: 'हल्दी', minTemp: 20, maxTemp: 35, minHumid: 65, maxHumid: 90, minPh: 5.5, maxPh: 7.5, minRain: 100, maxRain: 200, profit: '₹60,000-90,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Coriander', tamil: 'கொத்தமல்லி', hindi: 'धनिया', minTemp: 15, maxTemp: 28, minHumid: 50, maxHumid: 75, minPh: 6.0, maxPh: 8.0, minRain: 40, maxRain: 90, profit: '₹35,000-55,000/acre', season: 'Rabi', water: 'Low' },
  { name: 'Cardamom', tamil: 'ஏலக்காய்', hindi: 'इलायची', minTemp: 15, maxTemp: 25, minHumid: 75, maxHumid: 95, minPh: 5.0, maxPh: 6.5, minRain: 150, maxRain: 350, profit: '₹2,00,000-4,00,000/acre', season: 'Annual', water: 'High' },
  { name: 'Garlic', tamil: 'பூண்டு', hindi: 'लहसुन', minTemp: 12, maxTemp: 24, minHumid: 50, maxHumid: 75, minPh: 6.0, maxPh: 7.5, minRain: 40, maxRain: 90, profit: '₹80,000-1,20,000/acre', season: 'Rabi', water: 'Medium' },
  { name: 'Ginger', tamil: 'இஞ்சி', hindi: 'अदरक', minTemp: 20, maxTemp: 32, minHumid: 70, maxHumid: 90, minPh: 5.5, maxPh: 7.0, minRain: 100, maxRain: 200, profit: '₹80,000-1,50,000/acre', season: 'Kharif', water: 'High' },
  { name: 'Pepper', tamil: 'மிளகு', hindi: 'काली मिर्च', minTemp: 20, maxTemp: 35, minHumid: 70, maxHumid: 95, minPh: 5.5, maxPh: 7.0, minRain: 125, maxRain: 250, profit: '₹1,00,000-2,00,000/acre', season: 'Annual', water: 'High' },
  { name: 'Cloves', tamil: 'கிராம்பு', hindi: 'लौंग', minTemp: 20, maxTemp: 32, minHumid: 70, maxHumid: 90, minPh: 5.5, maxPh: 7.0, minRain: 150, maxRain: 300, profit: '₹1,50,000-3,00,000/acre', season: 'Annual', water: 'High' },
  { name: 'Cinnamon', tamil: 'இலவங்கப்பட்டை', hindi: 'दालचीनी', minTemp: 20, maxTemp: 32, minHumid: 70, maxHumid: 90, minPh: 5.5, maxPh: 7.0, minRain: 150, maxRain: 300, profit: '₹1,00,000-2,00,000/acre', season: 'Annual', water: 'High' },
  { name: 'Curry Leaves', tamil: 'கறிவேப்பிலை', hindi: 'करी पत्ता', minTemp: 22, maxTemp: 38, minHumid: 50, maxHumid: 80, minPh: 6.0, maxPh: 7.5, minRain: 50, maxRain: 120, profit: '₹50,000-80,000/acre', season: 'Annual', water: 'Low' },
  { name: 'Mint', tamil: 'புதினா', hindi: 'पुदीना', minTemp: 15, maxTemp: 30, minHumid: 60, maxHumid: 85, minPh: 6.0, maxPh: 7.5, minRain: 60, maxRain: 120, profit: '₹60,000-1,00,000/acre', season: 'All Season', water: 'High' },
  { name: 'Korra', tamil: 'கொர்ரா', hindi: 'कोरा बाजरा', minTemp: 20, maxTemp: 35, minHumid: 40, maxHumid: 70, minPh: 5.5, maxPh: 7.5, minRain: 35, maxRain: 85, profit: '₹22,000-30,000/acre', season: 'Kharif', water: 'Low' },
];

function getCropName(crop: any, lang: string) {
  if (lang === 'tamil') return `${crop.tamil} / ${crop.name}`;
  if (lang === 'hindi') return `${crop.hindi} / ${crop.name}`;
  return crop.name;
}
 
function getReasonText(crop: any, temp: number, humidity: number, lang: string) {
  if (lang === 'tamil') return `Temp ${temp}°C, Humidity ${humidity}% — ${crop.tamil}-க்கு ஏற்றது`;
  if (lang === 'hindi') return `Temp ${temp}°C, Humidity ${humidity}% — ${crop.hindi} के लिए उपयुक्त`;
  return `Temp ${temp}°C, Humidity ${humidity}% — Suitable for ${crop.name}`;
}
 
function predictML(temp: number, humidity: number, ph: number, rainfall: number) {
  const results = CROP_RULES.map(crop => {
    let score = 0;
    let maxScore = 0;
 
    maxScore += 30;
    if (temp >= crop.minTemp && temp <= crop.maxTemp) {
      const mid = (crop.minTemp + crop.maxTemp) / 2;
      const range = (crop.maxTemp - crop.minTemp) / 2;
      score += 30 * (1 - Math.abs(temp - mid) / range);
    }
 
    maxScore += 25;
    if (humidity >= crop.minHumid && humidity <= crop.maxHumid) {
      const mid = (crop.minHumid + crop.maxHumid) / 2;
      const range = (crop.maxHumid - crop.minHumid) / 2;
      score += 25 * (1 - Math.abs(humidity - mid) / range);
    }
 
    maxScore += 20;
    if (ph >= crop.minPh && ph <= crop.maxPh) score += 20;
 
    maxScore += 25;
    if (rainfall >= crop.minRain && rainfall <= crop.maxRain) {
      const mid = (crop.minRain + crop.maxRain) / 2;
      const range = (crop.maxRain - crop.minRain) / 2;
      score += 25 * (1 - Math.abs(rainfall - mid) / range);
    }
 
    const confidence = Math.round((score / maxScore) * 100);
    return { ...crop, confidence };
  });
 
  return results
    .filter(c => c.confidence > 30)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}
 
const TN_DISTRICTS: any = {
  'ariyalur':        { lat: 11.1401, lon: 79.0762, temp: 32, humidity: 72, rainfall: 90,  ph: 7.9 },
  'chengalpattu':    { lat: 12.6819, lon: 79.9890, temp: 32, humidity: 74, rainfall: 95,  ph: 7.4 },
  'chennai':         { lat: 13.0827, lon: 80.2707, temp: 33, humidity: 75, rainfall: 100, ph: 7.4 },
  'coimbatore':      { lat: 11.0168, lon: 76.9558, temp: 29, humidity: 72, rainfall: 85,  ph: 7.6 },
  'cuddalore':       { lat: 11.7480, lon: 79.7714, temp: 32, humidity: 78, rainfall: 110, ph: 7.3 },
  'dharmapuri':      { lat: 12.1211, lon: 78.1582, temp: 30, humidity: 65, rainfall: 75,  ph: 7.9 },
  'dindigul':        { lat: 10.3673, lon: 77.9803, temp: 32, humidity: 67, rainfall: 80,  ph: 7.6 },
  'erode':           { lat: 11.3410, lon: 77.7172, temp: 31, humidity: 68, rainfall: 82,  ph: 7.8 },
  'kallakurichi':    { lat: 11.7357, lon: 78.9597, temp: 31, humidity: 70, rainfall: 88,  ph: 7.1 },
  'kancheepuram':    { lat: 12.8185, lon: 79.6947, temp: 32, humidity: 74, rainfall: 95,  ph: 7.4 },
  'kanyakumari':     { lat: 8.0883,  lon: 77.5385, temp: 30, humidity: 82, rainfall: 150, ph: 5.9 },
  'karur':           { lat: 10.9601, lon: 78.0766, temp: 31, humidity: 70, rainfall: 85,  ph: 7.6 },
  'krishnagiri':     { lat: 12.5186, lon: 78.2137, temp: 30, humidity: 66, rainfall: 78,  ph: 7.2 },
  'madurai':         { lat: 9.9252,  lon: 78.1198, temp: 34, humidity: 65, rainfall: 75,  ph: 7.8 },
  'mayiladuthurai':  { lat: 11.1015, lon: 79.6516, temp: 31, humidity: 78, rainfall: 105, ph: 7.4 },
  'nagapattinam':    { lat: 10.7672, lon: 79.8449, temp: 31, humidity: 80, rainfall: 120, ph: 7.3 },
  'namakkal':        { lat: 11.2189, lon: 78.1677, temp: 31, humidity: 69, rainfall: 83,  ph: 7.3 },
  'nilgiris':        { lat: 11.4916, lon: 76.7337, temp: 18, humidity: 85, rainfall: 200, ph: 5.7 },
  'perambalur':      { lat: 11.2342, lon: 78.8800, temp: 32, humidity: 68, rainfall: 80,  ph: 8.1 },
  'pudukkottai':     { lat: 10.3797, lon: 78.8201, temp: 33, humidity: 70, rainfall: 85,  ph: 7.2 },
  'ramanathapuram':  { lat: 9.3639,  lon: 78.8395, temp: 34, humidity: 72, rainfall: 70,  ph: 7.2 },
  'ranipet':         { lat: 12.9222, lon: 79.3333, temp: 31, humidity: 70, rainfall: 90,  ph: 7.3 },
  'salem':           { lat: 11.6643, lon: 78.1460, temp: 30, humidity: 70, rainfall: 82,  ph: 7.9 },
  'sivaganga':       { lat: 9.8477,  lon: 78.4800, temp: 33, humidity: 68, rainfall: 75,  ph: 7.3 },
  'tenkasi':         { lat: 8.9597,  lon: 77.3151, temp: 31, humidity: 78, rainfall: 130, ph: 6.2 },
  'thanjavur':       { lat: 10.7870, lon: 79.1378, temp: 32, humidity: 78, rainfall: 100, ph: 7.4 },
  'theni':           { lat: 10.0104, lon: 77.4767, temp: 32, humidity: 68, rainfall: 85,  ph: 7.3 },
  'thoothukudi':     { lat: 8.7642,  lon: 78.1348, temp: 34, humidity: 74, rainfall: 70,  ph: 7.8 },
  'tiruchirappalli': { lat: 10.7905, lon: 78.7047, temp: 33, humidity: 74, rainfall: 88,  ph: 8.1 },
  'tirunelveli':     { lat: 8.7139,  lon: 77.7567, temp: 33, humidity: 72, rainfall: 80,  ph: 7.3 },
  'tirupathur':      { lat: 12.4958, lon: 78.5624, temp: 30, humidity: 67, rainfall: 78,  ph: 7.2 },
  'tiruppur':        { lat: 11.1085, lon: 77.3411, temp: 30, humidity: 70, rainfall: 82,  ph: 8.3 },
  'tiruvallur':      { lat: 13.1435, lon: 79.9083, temp: 32, humidity: 74, rainfall: 95,  ph: 7.4 },
  'tiruvannamalai':  { lat: 12.2253, lon: 79.0747, temp: 31, humidity: 70, rainfall: 88,  ph: 7.6 },
  'tiruvarur':       { lat: 10.7727, lon: 79.6366, temp: 31, humidity: 78, rainfall: 105, ph: 7.3 },
  'vellore':         { lat: 12.9165, lon: 79.1325, temp: 31, humidity: 68, rainfall: 88,  ph: 7.3 },
  'villupuram':      { lat: 11.9401, lon: 79.4861, temp: 32, humidity: 76, rainfall: 100, ph: 7.1 },
  'virudhunagar':    { lat: 9.5851,  lon: 77.9620, temp: 33, humidity: 68, rainfall: 72,  ph: 8.0 },
};
 
const TN_DISTRICT_LIST = [
  { key: 'ariyalur',       en: 'Ariyalur',       ta: 'அரியலூர்',        hi: 'अरियलूर' },
  { key: 'chengalpattu',   en: 'Chengalpattu',   ta: 'செங்கல்பட்டு',    hi: 'चेंगलपट्टू' },
  { key: 'chennai',        en: 'Chennai',         ta: 'சென்னை',          hi: 'चेन्नई' },
  { key: 'coimbatore',     en: 'Coimbatore',      ta: 'கோயம்புத்தூர்',   hi: 'कोयंबटूर' },
  { key: 'cuddalore',      en: 'Cuddalore',       ta: 'கடலூர்',          hi: 'कडलूर' },
  { key: 'dharmapuri',     en: 'Dharmapuri',      ta: 'தர்மபுரி',        hi: 'धर्मपुरी' },
  { key: 'dindigul',       en: 'Dindigul',        ta: 'திண்டுக்கல்',     hi: 'डिंडीगुल' },
  { key: 'erode',          en: 'Erode',           ta: 'ஈரோடு',           hi: 'इरोड' },
  { key: 'kallakurichi',   en: 'Kallakurichi',    ta: 'கள்ளக்குறிச்சி',  hi: 'कल्लाकुरिची' },
  { key: 'kancheepuram',   en: 'Kancheepuram',    ta: 'காஞ்சிபுரம்',     hi: 'कांचीपुरम' },
  { key: 'kanyakumari',    en: 'Kanyakumari',     ta: 'கன்னியாகுமரி',    hi: 'कन्याकुमारी' },
  { key: 'karur',          en: 'Karur',           ta: 'கரூர்',           hi: 'करूर' },
  { key: 'krishnagiri',    en: 'Krishnagiri',     ta: 'கிருஷ்ணகிரி',     hi: 'कृष्णागिरि' },
  { key: 'madurai',        en: 'Madurai',         ta: 'மதுரை',           hi: 'मदुरै' },
  { key: 'mayiladuthurai', en: 'Mayiladuthurai',  ta: 'மயிலாடுதுறை',    hi: 'मयिलादुतुरई' },
  { key: 'nagapattinam',   en: 'Nagapattinam',    ta: 'நாகப்பட்டினம்',   hi: 'नागपट्टिनम' },
  { key: 'namakkal',       en: 'Namakkal',        ta: 'நாமக்கல்',        hi: 'नामक्कल' },
  { key: 'nilgiris',       en: 'Nilgiris',        ta: 'நீலகிரி',         hi: 'नीलगिरि' },
  { key: 'perambalur',     en: 'Perambalur',      ta: 'பெரம்பலூர்',      hi: 'पेरम्बलूर' },
  { key: 'pudukkottai',    en: 'Pudukkottai',     ta: 'புதுக்கோட்டை',    hi: 'पुदुक्कोट्टई' },
  { key: 'ramanathapuram', en: 'Ramanathapuram',  ta: 'ராமநாதபுரம்',     hi: 'रामनाथपुरम' },
  { key: 'ranipet',        en: 'Ranipet',         ta: 'ராணிப்பேட்டை',    hi: 'रानीपेट' },
  { key: 'salem',          en: 'Salem',           ta: 'சேலம்',           hi: 'सेलम' },
  { key: 'sivaganga',      en: 'Sivaganga',       ta: 'சிவகங்கை',        hi: 'शिवगंगा' },
  { key: 'tenkasi',        en: 'Tenkasi',         ta: 'தென்காசி',        hi: 'तेनकासी' },
  { key: 'thanjavur',      en: 'Thanjavur',       ta: 'தஞ்சாவூர்',       hi: 'तंजावुर' },
  { key: 'theni',          en: 'Theni',           ta: 'தேனி',            hi: 'थेनी' },
  { key: 'thoothukudi',    en: 'Thoothukudi',     ta: 'தூத்துக்குடி',    hi: 'थूथुकुडी' },
  { key: 'tiruchirappalli',en: 'Tiruchirappalli', ta: 'திருச்சிராப்பள்ளி',hi: 'तिरुचिरापल्ली' },
  { key: 'tirunelveli',    en: 'Tirunelveli',     ta: 'திருநெல்வேலி',    hi: 'तिरुनेलवेली' },
  { key: 'tirupathur',     en: 'Tirupathur',      ta: 'திருப்பத்தூர்',   hi: 'तिरुपत्तूर' },
  { key: 'tiruppur',       en: 'Tiruppur',        ta: 'திருப்பூர்',      hi: 'तिरुपुर' },
  { key: 'tiruvallur',     en: 'Tiruvallur',      ta: 'திருவள்ளூர்',     hi: 'तिरुवल्लूर' },
  { key: 'tiruvannamalai', en: 'Tiruvannamalai',  ta: 'திருவண்ணாமலை',   hi: 'तिरुवन्नामलै' },
  { key: 'tiruvarur',      en: 'Tiruvarur',       ta: 'திருவாரூர்',      hi: 'तिरुवारूर' },
  { key: 'vellore',        en: 'Vellore',         ta: 'வேலூர்',          hi: 'वेल्लोर' },
  { key: 'villupuram',     en: 'Villupuram',      ta: 'விழுப்புரம்',     hi: 'विल्लुपुरम' },
  { key: 'virudhunagar',   en: 'Virudhunagar',    ta: 'விருதுநகர்',      hi: 'विरुधुनगर' },
];
 
function getDistrictLabel(d: any, lang: string) {
  if (lang === 'tamil') return d.ta;
  if (lang === 'hindi') return d.hi;
  return d.en;
}
 
const staticText: any = {
  tamil: {
    districtTitle: '📍 தமிழ்நாடு மாவட்டம்',
    districtHint: '38 மாவட்டங்கள் • Tamil Nadu Only',
    placeholder: 'உ.தா: Erode, Salem, Madurai...',
    notFound: 'மாவட்டம் கிடைக்கவில்லை.',
    liveData: '🟢 நேரடி தரவு',
    regionalData: '🟡 பிராந்திய தரவு',
    rainfall: 'மழை',
    mlNote: `${CROP_RULES.length} Tamil Nadu Crops`,
    satellite: '🛰️ Bhuvan API • Tamil Nadu',
    pickerTitle: 'மாவட்டம் தேர்ந்தெடு',
    searchPlaceholder: 'மாவட்டம் தேடுக...',
    selectDistrict: 'மாவட்டம் தேர்ந்தெடுக்கவும்',
    cancel: 'ரத்து செய்',
    mandiLive: '📊 இன்றைய மண்டி விலை',
    mandiNA: '💰 மதிப்பிடப்பட்ட லாபம்',
    soilPh: 'மண் pH',
  },
  english: {
    districtTitle: '📍 Tamil Nadu District',
    districtHint: '38 Districts • Tamil Nadu Only',
    placeholder: 'e.g: Erode, Salem, Madurai...',
    notFound: 'District not found.',
    liveData: '🟢 Live Data',
    regionalData: '🟡 Regional Data',
    rainfall: 'Rainfall',
    mlNote: ` ${CROP_RULES.length} Tamil Nadu Crops`,
    satellite: '🛰️ Bhuvan API • Tamil Nadu',
    pickerTitle: 'Select District',
    searchPlaceholder: 'Search district...',
    selectDistrict: 'Select Your District',
    cancel: 'Cancel',
    mandiLive: '📊 Today\'s Mandi Price',
    mandiNA: '💰 Estimated Profit',
    soilPh: 'Soil pH',
  },
  hindi: {
    districtTitle: '📍 तमिलनाडु जिला',
    districtHint: '38 जिले • Tamil Nadu Only',
    placeholder: 'जैसे: Erode, Salem, Madurai...',
    notFound: 'जिला नहीं मिला।',
    liveData: '🟢 लाइव डेटा',
    regionalData: '🟡 क्षेत्रीय डेटा',
    rainfall: 'वर्षा',
    mlNote: `${CROP_RULES.length} Tamil Nadu Crops`,
    satellite: '🛰️ Bhuvan API • Tamil Nadu',
    pickerTitle: 'जिला चुनें',
    searchPlaceholder: 'जिला खोजें...',
    selectDistrict: 'अपना जिला चुनें',
    cancel: 'रद्द करें',
    mandiLive: '📊 आज का मंडी भाव',
    mandiNA: '💰 अनुमानित लाभ',
    soilPh: 'मिट्टी pH',
  },
};
 
export default function CropScreen() {
  const router = useRouter();
  const { t, lang } = useLang();
  const s = staticText[lang] || staticText.english;
 
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [district, setDistrict] = useState('');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [crops, setCrops] = useState<any[]>([]);
  const [locationSet, setLocationSet] = useState(false);
  // ── NEW: Soil pH state ──
  const [soilPh, setSoilPh] = useState(6.5);

  const filteredDistricts = TN_DISTRICT_LIST.filter((d) =>
    getDistrictLabel(d, lang).toLowerCase().includes(districtSearch.toLowerCase()) ||
    d.en.toLowerCase().includes(districtSearch.toLowerCase())
  );
 
  const onSelectDistrict = async (districtObj: any) => {
    setShowDistrictPicker(false);
    setDistrictSearch('');
    setSelectedDistrict(districtObj.key);
    setCrops([]);
    setWeather(null);
    setLocationSet(false);
    setLoading(true);
 
    const key = districtObj.key;
    const cityData = TN_DISTRICTS[key];
    if (!cityData) { setLoading(false); return; }
 
    setLat(cityData.lat);
    setLon(cityData.lon);
    setSoilPh(cityData.ph ?? 6.5);
    setDistrict(getDistrictLabel(districtObj, lang));
 
    let weatherInfo;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityData.lat}&lon=${cityData.lon}&appid=${WEATHER_API_KEY}&units=metric`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      const weatherData = await weatherRes.json();
      if (weatherData.main) {
        weatherInfo = {
          temp: Math.round(weatherData.main.temp),
          humidity: weatherData.main.humidity,
          description: weatherData.weather[0].description,
          windSpeed: weatherData.wind.speed,
          rainfall: cityData.rainfall,
          isLive: true,
        };
      } else throw new Error('not ready');
    } catch {
      weatherInfo = {
        temp: cityData.temp,
        humidity: cityData.humidity,
        description: 'partly cloudy',
        windSpeed: 3.5,
        rainfall: cityData.rainfall,
        isLive: false,
      };
    }
 
    setWeather(weatherInfo);
    setLocationSet(true);
    setLoading(false);
  };
 
  const fetchMandiPrices = async (districtKey: string) => {
    const districtEncoded = encodeURIComponent(
      districtKey.charAt(0).toUpperCase() + districtKey.slice(1)
    );
    const stateEncoded = encodeURIComponent('Tamil Nadu');
 
    const tryResource = async (resourceId: string) => {
      const url =
        `${BASE_URL}/${resourceId}?api-key=${GOV_API_KEY}&format=json&limit=500` +
        `&filters[state]=${stateEncoded}&filters[district]=${districtEncoded}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.records || [];
    };
 
    let records = await tryResource(RESOURCE_ID_1);
    if (records.length === 0) records = await tryResource(RESOURCE_ID_2);
    return records;
  };
 
  const matchMandi = (crop: any, records: any[]) => {
    const cropNameLower = crop.name.toLowerCase();
    const cropTamilLower = (crop.tamil || '').toLowerCase();
    const cropFirstWord = cropNameLower.split(/[\s(]/)[0];
 
    const match = records.find((rec: any) => {
      const recName = (
        rec.commodity || rec.Commodity || rec['Commodity Name'] || ''
      ).toLowerCase();
      return (
        recName.includes(cropFirstWord) ||
        cropNameLower.includes(recName.split(/[\s(]/)[0]) ||
        recName.includes(cropTamilLower)
      );
    });
 
    if (!match) return null;
 
    const modal = parseFloat(match.modal_price || match.Modal_Price || match['Modal Price'] || '0');
    const min   = parseFloat(match.min_price   || match.Min_Price   || match['Min Price']   || '0');
    const max   = parseFloat(match.max_price   || match.Max_Price   || match['Max Price']   || '0');
 
    if (modal === 0) return null;
 
    return {
      mandiPrice:  +(modal / 100).toFixed(2),
      mandiMin:    +(min   / 100).toFixed(2),
      mandiMax:    +(max   / 100).toFixed(2),
      mandiMarket: match.market || match.Market || match['Market Name'] || '',
    };
  };
 
  const predictCrop = async () => {
    if (!weather) return;
    setPredicting(true);
 
    // ── Uses soilPh state instead of hardcoded 6.5 ──
    const mlResults = predictML(weather.temp, weather.humidity, soilPh, weather.rainfall);
 
    let records: any[] = [];
    try {
      records = await fetchMandiPrices(selectedDistrict);
    } catch {
      records = [];
    }
 
    const finalResults = mlResults.map(crop => {
      const mandi = matchMandi(crop, records);
      if (mandi) {
        return { ...crop, ...mandi, hasLivePrice: true };
      }
      return { ...crop, hasLivePrice: false };
    });
 
    setCrops(finalResults);
    setPredicting(false);
  };
 
  return (
    <View style={styles.outerContainer}>
      <Modal
        visible={showDistrictPicker}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowDistrictPicker(false); setDistrictSearch(''); }}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerBox}>
            <Text style={styles.pickerTitle}>{s.pickerTitle}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={s.searchPlaceholder}
              placeholderTextColor="#888"
              value={districtSearch}
              onChangeText={setDistrictSearch}
              autoFocus
            />
            <ScrollView style={{ maxHeight: 340 }} keyboardShouldPersistTaps="handled">
              {filteredDistricts.map((d) => (
                <TouchableOpacity
                  key={d.key}
                  style={[
                    styles.districtOption,
                    d.key === selectedDistrict && styles.districtOptionActive,
                  ]}
                  onPress={() => onSelectDistrict(d)}
                >
                  <Text
                    style={[
                      styles.districtOptionText,
                      d.key === selectedDistrict && styles.districtOptionTextActive,
                    ]}
                  >
                    {getDistrictLabel(d, lang)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => { setShowDistrictPicker(false); setDistrictSearch(''); }}
            >
              <Text style={styles.cancelBtnText}>{s.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
 
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>{t.back}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🌾 {t.crop}</Text>
        </View>
 
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{s.districtTitle}</Text>
          <Text style={styles.hint}>{s.districtHint}</Text>
 
          <TouchableOpacity
            style={styles.districtBtn}
            onPress={() => setShowDistrictPicker(true)}
          >
            <Text style={styles.districtBtnIcon}>📍</Text>
            <Text style={[styles.districtBtnText, !selectedDistrict && styles.districtBtnPlaceholder]}>
              {selectedDistrict
                ? getDistrictLabel(TN_DISTRICT_LIST.find(d => d.key === selectedDistrict)!, lang)
                : s.selectDistrict}
            </Text>
            <Text style={styles.dropIcon}>▾</Text>
          </TouchableOpacity>
 
          {loading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#4ade80" size="large" />
            </View>
          )}
 
          {locationSet && weather && (
            <>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>{s.satellite}</Text>
                <Text style={styles.infoText}>📍 Lat: {lat.toFixed(4)}° Lon: {lon.toFixed(4)}°</Text>
                <Text style={styles.infoText}>🏘️ {district}, Tamil Nadu</Text>
                <Text style={styles.infoText}>
                  🌤️ {weather.description} {weather.isLive ? s.liveData : s.regionalData}
                </Text>
              </View>
 
              <View style={styles.weatherGrid}>
                <View style={styles.weatherItem}>
                  <Text style={styles.wEmoji}>🌡️</Text>
                  <Text style={styles.wValue}>{weather.temp}°C</Text>
                  <Text style={styles.wLabel}>{t.temperature}</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Text style={styles.wEmoji}>💧</Text>
                  <Text style={styles.wValue}>{weather.humidity}%</Text>
                  <Text style={styles.wLabel}>{t.humidity}</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Text style={styles.wEmoji}>🌧️</Text>
                  <Text style={styles.wValue}>{weather.rainfall}mm</Text>
                  <Text style={styles.wLabel}>{s.rainfall}</Text>
                </View>
                {/* ── NEW: Soil pH grid item ── */}
                <View style={styles.weatherItem}>
                  <Text style={styles.wEmoji}>🧪</Text>
                  <Text style={styles.wValue}>{soilPh.toFixed(1)}</Text>
                  <Text style={styles.wLabel}>{s.soilPh}</Text>
                  
                </View>
              </View>
 
              <View style={styles.mlInfoBox}>
                <Text style={styles.mlInfoText}>
                  🤖 ML: Temp={weather.temp}°C | Humidity={weather.humidity}% | pH={soilPh.toFixed(1)} | Rain={weather.rainfall}mm
                </Text>
              </View>
            </>
          )}
        </View>
 
        {locationSet && weather && (
          <View style={styles.card}>
            <TouchableOpacity
              style={[styles.btn, predicting && styles.btnDisabled]}
              onPress={predictCrop}
              disabled={predicting}
            >
              {predicting
                ? <>
                    <ActivityIndicator color="#000" />
                    <Text style={[styles.btnText, { marginTop: 6 }]}>{t.predicting}</Text>
                  </>
                : <Text style={styles.btnText}>🧠 {t.predict}</Text>
              }
            </TouchableOpacity>
            <Text style={styles.mlNote}>
              {s.mlNote} → {district}
            </Text>
          </View>
        )}
 
        {crops.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>✅ {district} — {t.bestCrops}</Text>
            <Text style={styles.subNote}>
              🤖 ML Model • {weather?.temp}°C • {weather?.humidity}% {t.humidity}
            </Text>
            {crops.map((crop: any, i: number) => (
              <View key={i} style={[styles.cropCard, i === 0 && styles.cropBest]}>
                <View style={styles.cropRow}>
                  <Text style={[styles.cropName, i === 0 && styles.cropNameBest]}>
                    {getCropName(crop, lang)}
                  </Text>
                  {i === 0 && <Text style={styles.bestTag}>🏆 {t.best}</Text>}
                </View>
 
                <View style={styles.badgeRow}>
                  <Text style={styles.badgeBlue}>📅 {crop.season}</Text>
                  <Text style={styles.badgeGreen}>💧 {crop.water}</Text>
                </View>
 
                {crop.hasLivePrice ? (
                  <View style={styles.mandiBox}>
                    <Text style={styles.mandiLabel}>
                      {s.mandiLive} · 📍 {crop.mandiMarket}
                    </Text>
                    <View style={styles.mandiPriceRow}>
                      <Text style={styles.mandiPrice}>₹{crop.mandiPrice}/kg</Text>
                      <Text style={styles.mandiRange}>
                        ↓₹{crop.mandiMin}  ↑₹{crop.mandiMax}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.staticProfitBox}>
                    <Text style={styles.staticProfitLabel}>{s.mandiNA}</Text>
                    <Text style={styles.staticProfit}>{crop.profit}</Text>
                  </View>
                )}
 
                <Text style={styles.reasonText}>
                  💡 {getReasonText(crop, weather.temp, weather.humidity, lang)}
                </Text>
                <Text style={styles.confText}>{t.confidence}: {crop.confidence}%</Text>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, {
                    width: `${crop.confidence}%` as any,
                    backgroundColor: i === 0 ? '#4ade80' : '#6b9e74'
                  }]} />
                </View>
              </View>
            ))}
          </View>
        )}
 
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
 
const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#0a1f0e' },
  container: { flex: 1, backgroundColor: '#0a1f0e' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, gap: 12 },
  back: { fontSize: 24, color: '#4ade80' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#4ade80' },
  card: { backgroundColor: '#112214', borderRadius: 16, padding: 18, margin: 16, marginTop: 0, borderWidth: 1, borderColor: '#1e3d23' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#4ade80', marginBottom: 6 },
  hint: { fontSize: 12, color: '#6b9e74', marginBottom: 10 },
  subNote: { fontSize: 11, color: '#6b9e74', marginBottom: 12 },
 
  districtBtn: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    backgroundColor: '#0d2515', borderRadius: 12, borderWidth: 1,
    borderColor: '#4ade80', gap: 8, marginBottom: 12,
  },
  districtBtnIcon: { fontSize: 18 },
  districtBtnText: { flex: 1, fontSize: 15, color: '#e2f5e6', fontWeight: '600' },
  districtBtnPlaceholder: { color: '#6b9e74', fontWeight: '400' },
  dropIcon: { fontSize: 18, color: '#4ade80' },
 
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  pickerBox: { backgroundColor: '#112214', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, borderWidth: 1, borderColor: '#1e3d23', paddingBottom: 40 },
  pickerTitle: { fontSize: 18, fontWeight: '700', color: '#4ade80', marginBottom: 12 },
  searchInput: { borderWidth: 1, borderColor: '#1e3d23', borderRadius: 10, padding: 10, fontSize: 15, marginBottom: 8, backgroundColor: '#0d2515', color: '#e2f5e6' },
  districtOption: { paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#1e3d23' },
  districtOptionActive: { backgroundColor: '#1e3d23', borderRadius: 8 },
  districtOptionText: { fontSize: 15, color: '#a3d9b1' },
  districtOptionTextActive: { color: '#4ade80', fontWeight: '700' },
  cancelBtn: { marginTop: 12, padding: 12, backgroundColor: '#0d2515', borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#1e3d23' },
  cancelBtnText: { color: '#f87171', fontWeight: '700', fontSize: 15 },
 
  loadingBox: { alignItems: 'center', padding: 20 },
  btn: { backgroundColor: '#16a34a', borderRadius: 12, padding: 16, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#1e3d23' },
  btnText: { color: '#000', fontWeight: '700', fontSize: 15 },
  infoBox: { backgroundColor: '#0d3318', borderRadius: 10, padding: 12, marginTop: 10, gap: 4 },
  infoText: { color: '#6b9e74', fontSize: 12, marginBottom: 2 },
  weatherGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  weatherItem: { flex: 1, minWidth: '45%', backgroundColor: '#0d2515', borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#1e3d23' },
  wEmoji: { fontSize: 20 },
  wValue: { fontSize: 16, fontWeight: '700', color: '#4ade80' },
  wLabel: { fontSize: 10, color: '#6b9e74', marginTop: 2 },
  // ── NEW: pH button styles ──
  phBtnRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  phBtn: {
    backgroundColor: '#1e3d23',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  phBtnText: { color: '#4ade80', fontSize: 16, fontWeight: '700' },
  mlInfoBox: { backgroundColor: '#0d2515', borderRadius: 8, padding: 10, marginTop: 10 },
  mlInfoText: { color: '#60a5fa', fontSize: 11 },
  mlNote: { fontSize: 11, color: '#6b9e74', textAlign: 'center', marginTop: 8 },
 
  cropCard: { backgroundColor: '#0d2515', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#1e3d23' },
  cropBest: { borderColor: '#4ade80', borderWidth: 1.5 },
  cropRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cropName: { fontSize: 14, fontWeight: '700', color: '#e2f5e6', flex: 1 },
  cropNameBest: { color: '#4ade80' },
  bestTag: { backgroundColor: '#4ade8020', color: '#4ade80', fontSize: 12, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, overflow: 'hidden' },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  badgeBlue: { backgroundColor: '#60a5fa20', color: '#60a5fa', fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
  badgeGreen: { backgroundColor: '#4ade8020', color: '#4ade80', fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
  mandiBox: { backgroundColor: '#0a2e12', borderRadius: 8, padding: 10, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#4ade80' },
  mandiLabel: { fontSize: 10, color: '#6b9e74', marginBottom: 4 },
  mandiPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  mandiPrice: { fontSize: 20, fontWeight: '800', color: '#4ade80' },
  mandiRange: { fontSize: 11, color: '#6b9e74' },
  staticProfitBox: { backgroundColor: '#1a2a10', borderRadius: 8, padding: 10, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#fbbf24' },
  staticProfitLabel: { fontSize: 10, color: '#92704a', marginBottom: 2 },
  staticProfit: { fontSize: 14, fontWeight: '700', color: '#fbbf24' },
  reasonText: { fontSize: 12, color: '#a3d9b1', marginBottom: 6, fontStyle: 'italic' },
  confText: { fontSize: 12, color: '#6b9e74', marginBottom: 4 },
  progressBg: { height: 6, backgroundColor: '#1e3d23', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
});