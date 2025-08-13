import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ScrollView, Animated } from 'react-native';
import { 
  Text, 
  Card, 
  Chip, 
  Button,
  useTheme,
  IconButton,
  Surface,
  Divider,
  ActivityIndicator
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bus, SearchFilters } from '@/types';
import { mockBuses } from '@/data/mockData';
import BusCard from '@/components/BusCard';
import { useAuth } from '@/context/AuthContext';

export default function SearchResultsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const params = useLocalSearchParams();
  
  const [searchResults, setSearchResults] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('price');
  const [filterBy, setFilterBy] = useState<string>('all');
  const fadeAnim = new Animated.Value(0);

  // Parse search parameters
  const searchFilters: SearchFilters = {
    from: params.from as string || '',
    to: params.to as string || '',
    date: params.date as string || '',
    busType: params.busType as 'AC' | 'Non-AC' | undefined,
  };

  useEffect(() => {
    performSearch();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const performSearch = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let results = mockBuses;
      
      if (searchFilters.from) {
        results = results.filter(bus => 
          bus.from.toLowerCase().includes(searchFilters.from.toLowerCase())
        );
      }
      
      if (searchFilters.to) {
        results = results.filter(bus => 
          bus.to.toLowerCase().includes(searchFilters.to.toLowerCase())
        );
      }
      
      if (searchFilters.busType) {
        results = results.filter(bus => bus.type === searchFilters.busType);
      }

      // Apply sorting
      results.sort((a, b) => {
        switch (sortBy) {
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

      // Apply filtering
      if (filterBy !== 'all') {
        results = results.filter(bus => {
          switch (filterBy) {
            case 'ac':
              return bus.type === 'AC';
            case 'non-ac':
              return bus.type === 'Non-AC';
            case 'available':
              return bus.availableSeats > 5;
            default:
              return true;
          }
        });
      }
      
      setSearchResults(results);
      setIsLoading(false);
    }, 1000);
  };

  const handleBusPress = (bus: Bus) => {
    if (!isAuthenticated) {
      // Handle authentication
      return;
    }
    router.push(`/bus-details?busId=${bus.id}`);
  };

  const renderHeader = () => (
    <Surface style={[styles.headerSurface, { backgroundColor: theme.colors.surface }]} elevation={2}>
      <View style={styles.headerContent}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <View style={styles.routeInfo}>
          <Text variant="titleMedium" style={[styles.routeText, { color: theme.colors.onSurface }]}>
            {searchFilters.from} → {searchFilters.to}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {searchFilters.date}
          </Text>
        </View>
        <IconButton
          icon="tune"
          size={24}
          onPress={() => {}}
          style={styles.filterButton}
        />
      </View>
    </Surface>
  );

  const renderFilters = () => (
    <Surface style={[styles.filterSurface, { backgroundColor: theme.colors.surface }]} elevation={1}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
        <Text variant="bodyMedium" style={[styles.filterLabel, { color: theme.colors.onSurfaceVariant }]}>
          Sort:
        </Text>
        <Chip
          selected={sortBy === 'price'}
          onPress={() => setSortBy('price')}
          style={styles.filterChip}
          showSelectedOverlay
        >
          Price
        </Chip>
        <Chip
          selected={sortBy === 'rating'}
          onPress={() => setSortBy('rating')}
          style={styles.filterChip}
          showSelectedOverlay
        >
          Rating
        </Chip>
        <Chip
          selected={sortBy === 'departure'}
          onPress={() => setSortBy('departure')}
          style={styles.filterChip}
          showSelectedOverlay
        >
          Departure
        </Chip>
        
        <Divider style={styles.filterDivider} />
        
        <Text variant="bodyMedium" style={[styles.filterLabel, { color: theme.colors.onSurfaceVariant }]}>
          Filter:
        </Text>
        <Chip
          selected={filterBy === 'all'}
          onPress={() => setFilterBy('all')}
          style={styles.filterChip}
          showSelectedOverlay
        >
          All
        </Chip>
        <Chip
          selected={filterBy === 'ac'}
          onPress={() => setFilterBy('ac')}
          style={styles.filterChip}
          showSelectedOverlay
        >
          AC
        </Chip>
        <Chip
          selected={filterBy === 'available'}
          onPress={() => setFilterBy('available')}
          style={styles.filterChip}
          showSelectedOverlay
        >
          Available
        </Chip>
      </ScrollView>
    </Surface>
  );

  const renderResultsHeader = () => (
    <View style={styles.resultsHeader}>
      <Text variant="titleMedium" style={[styles.resultsTitle, { color: theme.colors.onBackground }]}>
        {isLoading ? 'Searching...' : `${searchResults.length} buses found`}
      </Text>
      {!isLoading && searchResults.length > 0 && (
        <View style={styles.resultsStats}>
          <MaterialCommunityIcons name="check-circle" size={16} color={theme.colors.primary} />
          <Text variant="bodySmall" style={[styles.statsText, { color: theme.colors.onSurfaceVariant }]}>
            Best prices guaranteed
          </Text>
        </View>
      )}
    </View>
  );

  const renderBusItem = ({ item, index }: { item: Bus; index: number }) => (
    <Animated.View
      style={[
        styles.busItemContainer,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        }
      ]}
    >
      <BusCard bus={item} onPress={() => handleBusPress(item)} />
    </Animated.View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="bus-alert" size={64} color={theme.colors.onSurfaceVariant} />
      <Text variant="headlineSmall" style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
        No buses found
      </Text>
      <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
        Try adjusting your search criteria or check different dates
      </Text>
      <Button
        mode="outlined"
        onPress={() => router.back()}
        style={styles.modifySearchButton}
        icon="magnify"
      >
        Modify Search
      </Button>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text variant="bodyLarge" style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
        Finding the best buses for you...
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      {renderFilters()}
      
      <View style={styles.content}>
        {renderResultsHeader()}
        
        {isLoading ? (
          renderLoadingState()
        ) : searchResults.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderBusItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsList}
            onRefresh={performSearch}
            refreshing={isLoading}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSurface: {
    paddingVertical: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  backButton: {
    margin: 0,
  },
  routeInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  routeText: {
    fontWeight: '600',
  },
  filterButton: {
    margin: 0,
  },
  filterSurface: {
    paddingVertical: 12,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  filterLabel: {
    marginRight: 12,
    fontWeight: '500',
  },
  filterChip: {
    marginRight: 8,
  },
  filterDivider: {
    height: 20,
    width: 1,
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  resultsHeader: {
    padding: 20,
    paddingBottom: 12,
  },
  resultsTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  resultsStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    marginLeft: 4,
  },
  resultsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  busItemContainer: {
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  modifySearchButton: {
    minWidth: 160,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 20,
    textAlign: 'center',
  },
});