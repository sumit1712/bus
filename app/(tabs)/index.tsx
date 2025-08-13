import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Text, Searchbar, FAB, Portal, Modal, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Bus } from '@/types';
import { mockBuses } from '@/data/mockData';
import BusCard from '@/components/BusCard';
import AuthModal from '@/components/AuthModal';

export default function HomeScreen() {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBuses(mockBuses);
      setIsLoading(false);
    }, 1000);
  };

  const onRefresh = useCallback(() => {
    loadBuses();
  }, []);

  const filteredBuses = buses.filter(bus => 
    bus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBusPress = (bus: Bus) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    router.push(`/bus-details?busId=${bus.id}`);
  };

  const renderBusItem = ({ item }: { item: Bus }) => (
    <BusCard bus={item} onPress={() => handleBusPress(item)} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          SwiftBus
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Book your journey with ease
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search buses, routes..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <View style={styles.content}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Available Buses
        </Text>
        
        <FlatList
          data={filteredBuses}
          renderItem={renderBusItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <Portal>
        <Modal
          visible={showAuthModal}
          onDismiss={() => setShowAuthModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <AuthModal onClose={() => setShowAuthModal(false)} />
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
});