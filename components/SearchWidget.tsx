import React, { useState } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Surface, 
  useTheme,
  IconButton,
  Chip
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SearchFilters } from '@/types';

interface SearchWidgetProps {
  onSearch?: (filters: SearchFilters) => void;
  style?: any;
}

export default function SearchWidget({ onSearch, style }: SearchWidgetProps) {
  const theme = useTheme();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
  });

  const animatedHeight = new Animated.Value(isExpanded ? 1 : 0);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSearch = () => {
    if (!filters.from || !filters.to) {
      return;
    }

    // Navigate to search results with parameters
    const params = new URLSearchParams({
      from: filters.from,
      to: filters.to,
      date: filters.date,
      ...(filters.busType && { busType: filters.busType }),
    });

    router.push(`/search-results?${params.toString()}`);
    onSearch?.(filters);
  };

  const swapLocations = () => {
    setFilters(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const popularRoutes = [
    { from: 'Mumbai', to: 'Pune' },
    { from: 'Delhi', to: 'Jaipur' },
    { from: 'Bangalore', to: 'Chennai' },
    { from: 'Ahmedabad', to: 'Surat' },
  ];

  return (
    <Surface 
      style={[styles.container, { backgroundColor: theme.colors.surface }, style]} 
      elevation={4}
    >
      {/* Main Search Bar */}
      <Pressable onPress={toggleExpanded} style={styles.searchBar}>
        <View style={styles.searchContent}>
          <MaterialCommunityIcons 
            name="map-marker" 
            size={24} 
            color={theme.colors.primary} 
          />
          <View style={styles.searchText}>
            <Text variant="bodyMedium" style={[styles.searchLabel, { color: theme.colors.onSurface }]}>
              {filters.from || 'From'} → {filters.to || 'To'}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {filters.date || 'Select date'}
            </Text>
          </View>
          <MaterialCommunityIcons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color={theme.colors.onSurfaceVariant} 
          />
        </View>
      </Pressable>

      {/* Expanded Search Form */}
      <Animated.View
        style={[
          styles.expandedContent,
          {
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 400],
            }),
            opacity: animatedHeight,
          }
        ]}
      >
        <View style={styles.inputContainer}>
          <View style={styles.locationInputs}>
            <TextInput
              label="From"
              value={filters.from}
              onChangeText={(text) => setFilters(prev => ({ ...prev, from: text }))}
              style={styles.locationInput}
              mode="outlined"
              left={<TextInput.Icon icon="map-marker" />}
              dense
            />
            
            <IconButton
              icon="swap-vertical"
              size={20}
              onPress={swapLocations}
              style={styles.swapButton}
              iconColor={theme.colors.primary}
            />
            
            <TextInput
              label="To"
              value={filters.to}
              onChangeText={(text) => setFilters(prev => ({ ...prev, to: text }))}
              style={styles.locationInput}
              mode="outlined"
              left={<TextInput.Icon icon="map-marker-outline" />}
              dense
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
            dense
          />

          <View style={styles.busTypeContainer}>
            <Text variant="bodyMedium" style={[styles.busTypeLabel, { color: theme.colors.onSurface }]}>
              Bus Type
            </Text>
            <View style={styles.busTypeChips}>
              <Chip
                selected={!filters.busType}
                onPress={() => setFilters(prev => ({ ...prev, busType: undefined }))}
                style={styles.busTypeChip}
                compact
                showSelectedOverlay
              >
                All
              </Chip>
              <Chip
                selected={filters.busType === 'AC'}
                onPress={() => setFilters(prev => ({ ...prev, busType: 'AC' }))}
                style={styles.busTypeChip}
                compact
                showSelectedOverlay
              >
                AC
              </Chip>
              <Chip
                selected={filters.busType === 'Non-AC'}
                onPress={() => setFilters(prev => ({ ...prev, busType: 'Non-AC' }))}
                style={styles.busTypeChip}
                compact
                showSelectedOverlay
              >
                Non-AC
              </Chip>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleSearch}
            style={styles.searchButton}
            icon="magnify"
            disabled={!filters.from || !filters.to}
          >
            Search Buses
          </Button>
        </View>
      </Animated.View>

      {/* Popular Routes */}
      {!isExpanded && (
        <View style={styles.popularRoutes}>
          <Text variant="bodySmall" style={[styles.popularLabel, { color: theme.colors.onSurfaceVariant }]}>
            Popular routes
          </Text>
          <View style={styles.routeChips}>
            {popularRoutes.slice(0, 2).map((route, index) => (
              <Chip
                key={index}
                onPress={() => {
                  setFilters(prev => ({
                    ...prev,
                    from: route.from,
                    to: route.to,
                  }));
                  setIsExpanded(true);
                  toggleExpanded();
                }}
                style={styles.routeChip}
                compact
              >
                {route.from} → {route.to}
              </Chip>
            ))}
          </View>
        </View>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  searchBar: {
    padding: 20,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchText: {
    flex: 1,
    marginLeft: 16,
  },
  searchLabel: {
    fontWeight: '500',
    marginBottom: 2,
  },
  expandedContent: {
    overflow: 'hidden',
  },
  inputContainer: {
    padding: 20,
    paddingTop: 0,
  },
  locationInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationInput: {
    flex: 1,
  },
  swapButton: {
    marginHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dateInput: {
    marginBottom: 16,
  },
  busTypeContainer: {
    marginBottom: 20,
  },
  busTypeLabel: {
    fontWeight: '500',
    marginBottom: 8,
  },
  busTypeChips: {
    flexDirection: 'row',
    gap: 8,
  },
  busTypeChip: {
    marginRight: 4,
  },
  searchButton: {
    paddingVertical: 4,
  },
  popularRoutes: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  popularLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  routeChips: {
    flexDirection: 'row',
    gap: 8,
  },
  routeChip: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});