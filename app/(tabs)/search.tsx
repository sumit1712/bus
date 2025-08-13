import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  Chip, 
  SegmentedButtons,
  useTheme,
  RadioButton
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { Bus, SearchFilters } from '@/types';
import { mockBuses } from '@/data/mockData';
import BusCard from '@/components/BusCard';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchResults, setSearchResults] = useState<Bus[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    
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
      setIsSearching(false);
    }, 1000);
  };

  const handleBusPress = (bus: Bus) => {
    router.push(`/bus-details?busId=${bus.id}`);
  };

  const renderBusItem = ({ item }: { item: Bus }) => (
    <BusCard bus={item} onPress={() => handleBusPress(item)} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            Search Buses
          </Text>
        </View>

        <Card style={styles.searchCard}>
          <Card.Content>
            <View style={styles.inputRow}>
              <TextInput
                label="From"
                value={filters.from}
                onChangeText={(text) => setFilters(prev => ({ ...prev, from: text }))}
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="To"
                value={filters.to}
                onChangeText={(text) => setFilters(prev => ({ ...prev, to: text }))}
                style={styles.input}
                mode="outlined"
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
            />

            <Text variant="titleSmall" style={styles.filterTitle}>
              Bus Type
            </Text>
            <View style={styles.chipContainer}>
              <Chip
                selected={!filters.busType}
                onPress={() => setFilters(prev => ({ ...prev, busType: undefined }))}
                style={styles.chip}
              >
                All
              </Chip>
              <Chip
                selected={filters.busType === 'AC'}
                onPress={() => setFilters(prev => ({ ...prev, busType: 'AC' }))}
                style={styles.chip}
              >
                AC
              </Chip>
              <Chip
                selected={filters.busType === 'Non-AC'}
                onPress={() => setFilters(prev => ({ ...prev, busType: 'Non-AC' }))}
                style={styles.chip}
              >
                Non-AC
              </Chip>
            </View>

            <Text variant="titleSmall" style={styles.filterTitle}>
              Sort By
            </Text>
            <RadioButton.Group
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
              value={filters.sortBy || ''}
            >
              <View style={styles.radioRow}>
                <RadioButton value="price" />
                <Text style={styles.radioLabel}>Price (Low to High)</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="rating" />
                <Text style={styles.radioLabel}>Rating (High to Low)</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="departure" />
                <Text style={styles.radioLabel}>Departure Time</Text>
              </View>
            </RadioButton.Group>

            <Button
              mode="contained"
              onPress={handleSearch}
              loading={isSearching}
              style={styles.searchButton}
            >
              Search Buses
            </Button>
          </Card.Content>
        </Card>

        {searchResults.length > 0 && (
          <View style={styles.resultsSection}>
            <Text variant="titleMedium" style={[styles.resultsTitle, { color: theme.colors.onBackground }]}>
              Search Results ({searchResults.length})
            </Text>
            <FlatList
              data={searchResults}
              renderItem={renderBusItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.resultsList}
            />
          </View>
        )}
      </ScrollView>
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
  searchCard: {
    margin: 20,
    elevation: 4,
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
  },
  chip: {
    marginRight: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    marginLeft: 8,
  },
  searchButton: {
    marginTop: 16,
  },
  resultsSection: {
    margin: 20,
  },
  resultsTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  resultsList: {
    paddingBottom: 20,
  },
});