import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COUNTRIES = [
  'Trinidad & Tobago', 'Tuvalu', 'Taiwan', 'Tanzania', 'Ukraine', 'Uganda', 'United States', 'Uruguay', 'Uzbekistan', 'Vatican City', 'St. Vincent & Grenadines', 'Venezuela', 'British Virgin Islands'
];

export default function CountrySelectScreen() {
  const [selected, setSelected] = useState('United States');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={() => router.back()}>
        <Ionicons name="close" size={32} color="#222" />
      </TouchableOpacity>
      <Text style={styles.title}>Select your country and state. <Text style={{fontSize: 24}}>😁</Text></Text>
      <ScrollView style={styles.list} contentContainerStyle={{paddingBottom: 32}}>
        {COUNTRIES.map(country => (
          <TouchableOpacity
            key={country}
            style={styles.countryRow}
            onPress={() => setSelected(country)}
          >
            <Ionicons
              name={selected === country ? 'checkmark' : 'chevron-down'}
              size={20}
              color={selected === country ? '#222' : '#bbb'}
              style={{ marginRight: 12 }}
            />
            <Text style={[styles.countryText, selected === country && styles.selectedText]}>{country}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.nextButton} onPress={() => console.log('Selected country:', selected)}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  close: {
    position: 'absolute',
    top: 32,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    marginTop: 8,
    color: '#111',
    letterSpacing: 0.5,
  },
  list: {
    flex: 1,
    marginBottom: 24,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryText: {
    fontSize: 18,
    color: '#222',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#457B9D',
  },
  nextButton: {
    backgroundColor: '#222',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 