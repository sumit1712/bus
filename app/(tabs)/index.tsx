import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, ScrollView, LayoutAnimation, UIManager, Platform } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  Chip, 
  RadioButton,
  useTheme,
  Portal,
  Modal,
  Divider,
  Surface
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Bus, SearchFilters } from '@/types';
import { mockBuses } from '@/data/mockData';
import BusCard from '@/components/BusCard';
import AuthModal from '@/components/AuthModal';

// Enable layout animations on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Search functionality state
  const [filters, setFilters] = useState<SearchFilters>({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [searchResults, setSearchResults] = useState<Bus[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearch = async () => {
    if (!filters.from || !filters.to) {
      return;
    }

    setIsSearching(true);
    
    // Animate the layout change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    // Simulate API search
    setTimeout(() => {
      let results = mockBuses;
      
      if (filters.from) {
        results = results.filter(bus => 
          bus.from.toLowerCase().includes(filters.from.toLowerCase())
        );
      }
      
      if (filters.to) {
        results = results.filter(bus => 
          bus.to.toLowerCase().includes(filters.to.toLowerCase())
        );
      }
      
      if (filters.busType) {
        results = results.filter(bus => bus.type === filters.busType);
      }
      
      // Sort results
      if (filters.sortBy) {
        results.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price':
              return a.price - b.price;
            case 'rating':
              return b.rating - a.rating;
            case 'departure':
              return a.departureTime.localeCompare(b.departureTime);
            default:
              return 0;
          }
        });
      }
      
      setSearchResults(results);
      setShowSearchResults(true);
      setIsSearching(false);
    }, 1000);
  };

  const clearSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowSearchResults(false);
    setSearchResults([]);
    setFilters({
      from: '',
      to: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

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

  const displayBuses = showSearchResults ? searchResults : buses;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>
            SwiftBus
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Your journey starts here
          </Text>
        </View>

        {/* Search Widget */}
        <Surface style={[styles.searchWidget, { backgroundColor: theme.colors.surface }]} elevation={4}>
          <Text variant="titleMedium" style={[styles.searchTitle, { color: theme.colors.onSurface }]}>
            Find Your Bus
          </Text>
          
          <View style={styles.inputRow}>
            <TextInput
              label="From"
              value={filters.from}
              onChangeText={(text) => setFilters(prev => ({ ...prev, from: text }))}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="map-marker" />}
            />
            <TextInput
              label="To"
              value={filters.to}
              onChangeText={(text) => setFilters(prev => ({ ...prev, to: text }))}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="map-marker-outline" />}
            />
          </View>

          <TextInput
            label="Travel Date"
            value={filters.date}
            onChangeText={(text) => setFilters(prev => ({ ...prev, date: text }))}
            style={styles.dateInput}
            mode="outlined"
            right={<TextInput.Icon icon="calendar" />}
            placeholder="YYYY-MM-DD"
            left={<TextInput.Icon icon="calendar-clock" />}
          />

          <Text variant="titleSmall" style={[styles.filterTitle, { color: theme.colors.onSurface }]}>
            Bus Type
          </Text>
          <View style={styles.chipContainer}>
            <Chip
              selected={!filters.busType}
              onPress={() => setFilters(prev => ({ ...prev, busType: undefined }))}
              style={styles.chip}
              showSelectedOverlay
            >
              All Types
            </Chip>
            <Chip
              selected={filters.busType === 'AC'}
              onPress={() => setFilters(prev => ({ ...prev, busType: 'AC' }))}
              style={styles.chip}
              showSelectedOverlay
            >
              AC
            </Chip>
            <Chip
              selected={filters.busType === 'Non-AC'}
              onPress={() => setFilters(prev => ({ ...prev, busType: 'Non-AC' }))}
              style={styles.chip}
              showSelectedOverlay
            >
              Non-AC
            </Chip>
          </View>

          <Text variant="titleSmall" style={[styles.filterTitle, { color: theme.colors.onSurface }]}>
            Sort By
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
            value={filters.sortBy || ''}
          >
            <View style={styles.radioRow}>
              <RadioButton value="price" />
              <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>Price (Low to High)</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="rating" />
              <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>Rating (High to Low)</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="departure" />
              <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>Departure Time</Text>
            </View>
          </RadioButton.Group>

          <View style={styles.searchButtonContainer}>
            <Button
              mode="contained"
              onPress={handleSearch}
              loading={isSearching}
              style={styles.searchButton}
              icon="magnify"
              disabled={!filters.from || !filters.to}
            >
              Search Buses
            </Button>
            {showSearchResults && (
              <Button
                mode="outlined"
                onPress={clearSearch}
                style={styles.clearButton}
                icon="close"
              >
                Clear
              </Button>
            )}
          </View>
        </Surface>

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text variant="titleLarge" style={[styles.resultsTitle, { color: theme.colors.onBackground }]}>
              {showSearchResults ? `Search Results (${searchResults.length})` : 'Popular Routes'}
            </Text>
            {showSearchResults && (
              <MaterialCommunityIcons 
                name="check-circle" 
                size={24} 
                color={theme.colors.primary} 
              />
            )}
          </View>
          
          {displayBuses.length > 0 ? (
            <FlatList
              data={displayBuses}
              renderItem={renderBusItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          ) : showSearchResults ? (
            <Card style={styles.noResultsCard}>
              <Card.Content style={styles.noResultsContent}>
                <MaterialCommunityIcons 
                  name="bus-alert" 
                  size={48} 
                  color={theme.colors.onSurfaceVariant} 
                />
                <Text variant="titleMedium" style={[styles.noResultsTitle, { color: theme.colors.onSurface }]}>
                  No buses found
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Try adjusting your search criteria
                </Text>
              </Card.Content>
            </Card>
          ) : null}
        </View>

        {/* Quick Actions */}
        {!showSearchResults && (
          <View style={styles.quickActions}>
            <Text variant="titleMedium" style={[styles.quickActionsTitle, { color: theme.colors.onBackground }]}>
              Quick Actions
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