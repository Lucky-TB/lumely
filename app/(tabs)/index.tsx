import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface AICheckItem {
  id: string;
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
  bodyPart: string;
  color: string;
  subIcons?: (keyof typeof Ionicons.glyphMap)[];
}

interface CardProps {
  item: AICheckItem;
  onPress: () => void;
  style?: any;
}

const AI_CHECKS: AICheckItem[] = [
  {
    id: 'eye',
    label: 'Eye',
    desc: 'Check signs',
    icon: 'eye',
    bodyPart: 'eyes',
    color: '#457B9D',
  },
  {
    id: 'teeth',
    label: 'Teeth',
    desc: 'Check signs',
    icon: 'happy',
    bodyPart: 'teeth',
    color: '#F4A261',
  },
  {
    id: 'ears',
    label: 'Ears',
    desc: 'Check signs',
    icon: 'ear',
    bodyPart: 'ears',
    color: '#A8DADC',
  },
  {
    id: 'hair',
    label: 'Hair',
    desc: 'Check signs',
    icon: 'cut',
    bodyPart: 'hair',
    color: '#9B59B6',
  },
  {
    id: 'nails',
    label: 'Nails',
    desc: 'Check signs',
    icon: 'finger-print',
    bodyPart: 'nails',
    color: '#E74C3C',
  },
  {
    id: 'skin',
    label: 'Skin',
    desc: 'Face, Arms, Legs',
    icon: 'color-palette',
    bodyPart: 'skin',
    color: '#2ECC71',
    subIcons: ['person', 'body', 'ellipse'],
  },
  {
    id: 'face',
    label: 'Face',
    desc: 'Check signs',
    icon: 'person',
    bodyPart: 'face',
    color: '#8b5cf6',
  },
];

function AICheckCard({ item, onPress, style }: CardProps) {
  return (
    <TouchableOpacity style={[styles.aiCard, style]} onPress={onPress}>
      <Text style={styles.cardTitle}>{item.label}</Text>
      <Text style={styles.cardDesc}>{item.desc}</Text>
      <Ionicons name={item.icon} size={32} color={item.color} style={styles.cardIcon} />
    </TouchableOpacity>
  );
}

function SkinCard({ item, onPress }: CardProps) {
  return (
    <TouchableOpacity style={styles.skinLargeCard} onPress={onPress}>
      <View style={styles.skinCardHeader}>
        <Text style={styles.skinCardTitle}>{item.label}</Text>
        <Text style={styles.skinCardDesc}>{item.desc}</Text>
      </View>
      <View style={styles.skinSubIconsContainer}>
        {item.subIcons?.map((icon, idx) => (
          <Ionicons key={idx} name={icon} size={28} color="#bbb" style={styles.skinSubIcon} />
        ))}
      </View>
    </TouchableOpacity>
  );
}

function TopBar() {
  const handleProfilePress = useCallback(() => {
    // Handle profile press
  }, []);

  const handleDropdownPress = useCallback(() => {
    // Handle dropdown press
  }, []);

  return (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileEmoji}>😊</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dropdown} onPress={handleDropdownPress}>
        <Text style={styles.dropdownText}>Register your profile</Text>
        <Ionicons name="chevron-down" size={20} color="#222" style={styles.dropdownIcon} />
      </TouchableOpacity>
    </View>
  );
}

function SectionHeader() {
  const handleHelpPress = useCallback(() => {
    // Handle help press
  }, []);

  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>AI check</Text>
      <TouchableOpacity style={styles.healthCheckRow} onPress={handleHelpPress}>
        <Text style={styles.healthCheckText}>What's health check</Text>
        <Ionicons name="help-circle-outline" size={18} color="#aaa" style={styles.helpIcon} />
      </TouchableOpacity>
    </View>
  );
}

function CardGrid() {
  const handleCardPress = useCallback((bodyPart: string) => {
    router.push({ pathname: '/camera', params: { bodyPart } });
  }, []);

  const skinItem = useMemo(() => AI_CHECKS.find(item => item.id === 'skin')!, []);
  const regularItems = useMemo(() => AI_CHECKS.filter(item => item.id !== 'skin'), []);

  return (
    <View style={styles.cardGrid}>
      <View style={styles.cardRow}>
        <SkinCard item={skinItem} onPress={() => handleCardPress(skinItem.bodyPart)} />
        <AICheckCard item={regularItems[0]} onPress={() => handleCardPress(regularItems[0].bodyPart)} />
        <AICheckCard item={regularItems[1]} onPress={() => handleCardPress(regularItems[1].bodyPart)} />
      </View>
      <View style={styles.cardRow}>
        <AICheckCard item={regularItems[2]} onPress={() => handleCardPress(regularItems[2].bodyPart)} />
        <AICheckCard item={regularItems[3]} onPress={() => handleCardPress(regularItems[3].bodyPart)} />
      </View>
      <View style={styles.cardRow}>
        <AICheckCard item={regularItems[4]} onPress={() => handleCardPress(regularItems[4].bodyPart)} />
        <AICheckCard item={regularItems[5]} onPress={() => handleCardPress(regularItems[5].bodyPart)} />
      </View>
    </View>
  );
}

function HistoryCard() {
  const handleHistoryPress = useCallback(() => {
    router.push('/(tabs)/health-log');
  }, []);

  return (
    <TouchableOpacity style={styles.historyCard} onPress={handleHistoryPress}>
      <Ionicons name="list" size={24} color="#aaa" style={styles.historyIcon} />
      <Text style={styles.historyText}>View check history</Text>
    </TouchableOpacity>
  );
}

function InfoCard() {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoText}>Let's find out how to{"\n"}check our health</Text>
      </View>
      <View style={styles.infoImageContainer}>
        <View style={styles.infoImageCircle}>
          <Ionicons name="camera" size={32} color="#457B9D" />
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TopBar />
        <SectionHeader />
        <CardGrid />
        <HistoryCard />
        <InfoCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF6EE', // soft warm background
  },
  scrollContent: {
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 12,
  },
  profileIcon: {
    marginRight: 12,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E9D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileEmoji: {
    fontSize: 24,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  dropdownIcon: {
    marginLeft: 4,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  healthCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthCheckText: {
    fontSize: 15,
    color: '#888',
    marginRight: 2,
  },
  helpIcon: {
    marginLeft: 4,
  },
  cardGrid: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  aiCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  skinLargeCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 220,
    justifyContent: 'space-between',
  },
  skinCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skinSubIconsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  skinCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  cardDesc: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  skinCardDesc: {
    fontSize: 14,
    color: '#888',
    marginBottom: 6,
  },
  cardIcon: {
    alignSelf: 'flex-end',
  },
  skinSubIcon: {
    marginRight: 6,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  historyIcon: {
    marginRight: 12,
  },
  historyText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D6ECF7',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    lineHeight: 24,
  },
  infoImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoImageCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
});
