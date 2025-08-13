import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, ScrollView, Animated } from 'react-native';
import { 
  Text, 
  Card, 
  useTheme,
  Button,
  Surface,
  Avatar
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Bus } from '@/types';
import { mockBuses } from '@/data/mockData';
import BusCard from '@/components/BusCard';
import SearchWidget from '@/components/SearchWidget';

export default function HomeScreen() {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    loadBuses();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
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

  const handleBusPress = (bus: Bus) => {
    if (!isAuthenticated) {
      // Navigate to auth or show auth modal
      return;
    }
    router.push(`/bus-details?busId=${bus.id}`);
  };

  const renderBusItem = ({ item }: { item: Bus }) => (
    <BusCard bus={item} onPress={() => handleBusPress(item)} />
  );

  const featuredBuses = buses.slice(0, 3);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View>
                <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>
                  SwiftBus
                </Text>
                <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                  Book your journey with confidence
                </Text>
              </View>
              <Avatar.Icon 
                size={48} 
                icon="bus" 
                style={{ backgroundColor: theme.colors.primaryContainer }}
              />
            </View>
          </View>
        </Animated.View>

        {/* Search Widget */}
        <SearchWidget style={styles.searchWidget} />

        {/* Featured Buses Section */}
        <Animated.View style={[styles.featuredSection, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              Featured Routes
            </Text>
            <Button mode="text" onPress={() => {}}>
              View All
            </Button>
          </View>
          
          <FlatList
            data={featuredBuses}
            renderItem={renderBusItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.featuredList}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>

        {/* Services Section */}
        <Animated.View style={[styles.servicesSection, { opacity: fadeAnim }]}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Our Services
          </Text>
          <View style={styles.servicesGrid}>
            <Surface style={[styles.serviceCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
              <MaterialCommunityIcons name="shield-check" size={32} color={theme.colors.primary} />
              <Text variant="titleSmall" style={[styles.serviceTitle, { color: theme.colors.onSurface }]}>
                Safe Travel
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Verified operators & GPS tracking
              </Text>
            </Surface>
            
            <Surface style={[styles.serviceCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
              <MaterialCommunityIcons name="clock-fast" size={32} color={theme.colors.secondary} />
              <Text variant="titleSmall" style={[styles.serviceTitle, { color: theme.colors.onSurface }]}>
                On-Time
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Punctual departures & arrivals
              </Text>
            </Surface>
            
            <Surface style={[styles.serviceCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
              <MaterialCommunityIcons name="currency-inr" size={32} color={theme.colors.tertiary} />
              <Text variant="titleSmall" style={[styles.serviceTitle, { color: theme.colors.onSurface }]}>
                Best Price
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Guaranteed lowest fares
              </Text>
            </Surface>
            
            <Surface style={[styles.serviceCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
              <MaterialCommunityIcons name="headset" size={32} color={theme.colors.error} />
              <Text variant="titleSmall" style={[styles.serviceTitle, { color: theme.colors.onSurface }]}>
                24/7 Support
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Round-the-clock assistance
              </Text>
            </Surface>
          </View>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View style={[styles.statsSection, { opacity: fadeAnim }]}>
          <Surface style={[styles.statsCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={3}>
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={[styles.statNumber, { color: theme.colors.primary }]}>
                  10M+
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer }}>
                  Happy Travelers
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={[styles.statNumber, { color: theme.colors.primary }]}>
                  50K+
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer }}>
                  Routes Covered
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={[styles.statNumber, { color: theme.colors.primary }]}>
                  99%
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer }}>
                  On-Time Performance
                </Text>
              </View>
            </View>
          </Surface>
        </Animated.View>

        {/* Why Choose Us */}
        <Animated.View style={[styles.whyChooseSection, { opacity: fadeAnim }]}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Why Choose SwiftBus?
          </Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onSurface }]}>
                Instant booking confirmation
              </Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onSurface }]}>
                Easy cancellation & refunds
              </Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onSurface }]}>
                Live bus tracking
              </Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onSurface }]}>
                Multiple payment options
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  searchWidget: {
    margin: 20,
    marginTop: 0,
  },
  featuredSection: {
    margin: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  featuredList: {
    paddingBottom: 10,
  },
  servicesSection: {
    margin: 20,
    marginTop: 0,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  serviceCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  serviceTitle: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
  },
  statsSection: {
    margin: 20,
    marginTop: 0,
  },
  statsCard: {
    borderRadius: 16,
    padding: 24,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  whyChooseSection: {
    margin: 20,
    marginTop: 0,
    marginBottom: 40,
  },
  featuresList: {
    marginTop: 16,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 12,
    flex: 1,
  },
});

            </Text>
            <View style={styles.quickActionButtons}>
              <Card style={styles.quickActionCard} onPress={() => {}}>
                <Card.Content style={styles.quickActionContent}>
                  <MaterialCommunityIcons name="history" size={32} color={theme.colors.primary} />
                  <Text variant="bodyMedium" style={styles.quickActionText}>Recent Searches</Text>
                </Card.Content>
              </Card>
              <Card style={styles.quickActionCard} onPress={() => {}}>
                <Card.Content style={styles.quickActionContent}>
                  <MaterialCommunityIcons name="star" size={32} color={theme.colors.secondary} />
                  <Text variant="bodyMedium" style={styles.quickActionText}>Top Rated</Text>
                </Card.Content>
              </Card>
              <Card style={styles.quickActionCard} onPress={() => {}}>
                <Card.Content style={styles.quickActionContent}>
                  <MaterialCommunityIcons name="lightning-bolt" size={32} color={theme.colors.tertiary} />
                  <Text variant="bodyMedium" style={styles.quickActionText}>Express Routes</Text>
                </Card.Content>
              </Card>
            </View>
          </View>
        )}
      </ScrollView>

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
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  searchWidget: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  searchTitle: {
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
  },
  dateInput: {
    marginBottom: 16,
  },
  filterTitle: {
    marginTop: 8,
    marginBottom: 12,
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 4,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    marginLeft: 8,
    flex: 1,
  },
  searchButtonContainer: {
    marginTop: 16,
    gap: 12,
  },
  searchButton: {
    paddingVertical: 4,
  },
  clearButton: {
    paddingVertical: 4,
  },
  resultsSection: {
    margin: 20,
    marginTop: 0,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultsTitle: {
    fontWeight: '600',
  },
  resultsList: {
    paddingBottom: 20,
  },
  noResultsCard: {
    padding: 20,
  },
  noResultsContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noResultsTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  quickActions: {
    margin: 20,
    marginTop: 0,
  },
  quickActionsTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    elevation: 2,
  },
  quickActionContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  quickActionText: {
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
});