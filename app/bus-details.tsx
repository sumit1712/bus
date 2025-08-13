import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  Chip, 
  useTheme,
  Portal,
  Modal,
  Avatar
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bus, Seat } from '@/types';
import { mockBuses, generateSeats } from '@/data/mockData';
import SeatSelector from '@/components/SeatSelector';

export default function BusDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { busId } = useLocalSearchParams<{ busId: string }>();
  const [bus, setBus] = useState<Bus | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (busId) {
      const foundBus = mockBuses.find(b => b.id === busId);
      setBus(foundBus || null);
      
      if (foundBus) {
        // Generate seats with some randomly occupied
        const occupiedSeats = ['A1', 'B3', 'C2', 'D4', 'E1'];
        setSeats(generateSeats(foundBus.totalSeats, occupiedSeats));
      }
    }
  }, [busId]);

  const handleSeatToggle = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;
    
    setIsBooking(true);
    
    // Simulate booking API call
    setTimeout(() => {
      setIsBooking(false);
      setShowSeatSelection(false);
      router.push('/(tabs)/bookings');
    }, 2000);
  };

  const totalPrice = selectedSeats.length * (bus?.price || 0);

  if (!bus) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Avatar.Icon size={80} icon="bus-alert" />
          <Text variant="headlineSmall" style={{ marginTop: 20 }}>
            Bus not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Button
            mode="text"
            onPress={() => router.back()}
            style={styles.backButton}
            icon="arrow-left"
          >
            Back
          </Button>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            Bus Details
          </Text>
        </View>

        <Card style={styles.busCard}>
          {bus.image && (
            <Card.Cover 
              source={{ uri: bus.image }} 
              style={styles.busImage}
              resizeMode="cover"
            />
          )}
          <Card.Content>
            <View style={styles.busHeader}>
              <View style={styles.busInfo}>
                <Text variant="headlineSmall" style={styles.busName}>
                  {bus.name}
                </Text>
                <Chip
                  mode="outlined"
                  style={[
                    styles.typeChip,
                    bus.type === 'AC' 
                      ? { backgroundColor: theme.colors.primaryContainer }
                      : { backgroundColor: theme.colors.secondaryContainer }
                  ]}
                >
                  {bus.type}
                </Chip>
              </View>
              <Text variant="headlineSmall" style={[styles.price, { color: theme.colors.primary }]}>
                ${bus.price}
              </Text>
            </View>

            <View style={styles.routeSection}>
              <View style={styles.route}>
                <Text variant="titleLarge" style={styles.routeText}>
                  {bus.from}
                </Text>
                <MaterialCommunityIcons 
                  name="arrow-right" 
                  size={24} 
                  color={theme.colors.onSurfaceVariant}
                  style={styles.arrow}
                />
                <Text variant="titleLarge" style={styles.routeText}>
                  {bus.to}
                </Text>
              </View>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                Duration: {bus.duration}
              </Text>
            </View>

            <View style={styles.timeSection}>
              <View style={styles.timeCard}>
                <Text variant="titleMedium" style={styles.time}>
                  {bus.departureTime}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Departure
                </Text>
              </View>
              <View style={styles.timeCard}>
                <Text variant="titleMedium" style={styles.time}>
                  {bus.arrivalTime}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Arrival
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Bus Information
            </Text>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="seat" size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                {bus.availableSeats} of {bus.totalSeats} seats available
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
              <Text variant="bodyMedium" style={styles.infoText}>
                {bus.rating} rating
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.amenitiesCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Amenities
            </Text>
            <View style={styles.amenitiesList}>
              {bus.amenities.map((amenity, index) => (
                <Chip key={index} style={styles.amenityChip}>
                  {amenity}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.priceInfo}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Starting from
          </Text>
          <Text variant="titleLarge" style={[styles.bottomPrice, { color: theme.colors.primary }]}>
            ${bus.price}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={() => setShowSeatSelection(true)}
          style={styles.selectSeatsButton}
        >
          Select Seats
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showSeatSelection}
          onDismiss={() => setShowSeatSelection(false)}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.background }]}
        >
          <View style={styles.modalHeader}>
            <Text variant="headlineSmall">Select Seats</Text>
            <Button onPress={() => setShowSeatSelection(false)}>Close</Button>
          </View>
          
          <SeatSelector
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
          />
          
          {selectedSeats.length > 0 && (
            <View style={styles.bookingFooter}>
              <View style={styles.bookingInfo}>
                <Text variant="bodyMedium">
                  Selected: {selectedSeats.join(', ')}
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                  Total: ${totalPrice}
                </Text>
              </View>
              <Button
                mode="contained"
                onPress={handleBooking}
                loading={isBooking}
                style={styles.bookButton}
              >
                Book Now
              </Button>
            </View>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  busCard: {
    margin: 20,
    marginTop: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  busImage: {
    height: 200,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 16,
  },
  busInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  busName: {
    fontWeight: 'bold',
    marginRight: 12,
  },
  typeChip: {
    height: 32,
  },
  price: {
    fontWeight: 'bold',
  },
  routeSection: {
    marginBottom: 20,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeText: {
    fontWeight: '600',
  },
  arrow: {
    marginHorizontal: 12,
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  time: {
    fontWeight: '600',
    marginBottom: 4,
  },
  infoCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
  },
  amenitiesCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    marginBottom: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  priceInfo: {
    flex: 1,
  },
  bottomPrice: {
    fontWeight: 'bold',
  },
  selectSeatsButton: {
    minWidth: 120,
  },
  modalContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  bookingFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  bookingInfo: {
    marginBottom: 16,
  },
  bookButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});