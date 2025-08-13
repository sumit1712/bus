import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  Chip, 
  useTheme,
  Portal,
  Dialog,
  Avatar
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Booking } from '@/types';
import { mockBookings } from '@/data/mockData';
import AuthModal from '@/components/AuthModal';

export default function BookingsScreen() {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const loadBookings = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
  };

  const handleCancelBooking = async (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelDialog(true);
  };

  const confirmCancelBooking = async () => {
    if (selectedBooking) {
      // Simulate API call to cancel booking
      setBookings(prev => 
        prev.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
    }
    setShowCancelDialog(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return theme.colors.primary;
      case 'cancelled':
        return theme.colors.error;
      case 'completed':
        return theme.colors.tertiary;
      default:
        return theme.colors.outline;
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'check-circle';
      case 'cancelled':
        return 'cancel';
      case 'completed':
        return 'check-all';
      default:
        return 'help-circle';
    }
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <Card style={styles.bookingCard}>
      <Card.Content>
        <View style={styles.bookingHeader}>
          <Text variant="titleMedium" style={styles.busName}>
            {item.busName}
          </Text>
          <Chip
            icon={getStatusIcon(item.status)}
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={{ color: 'white' }}
            compact
          >
            {item.status.toUpperCase()}
          </Chip>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routeInfo}>
            <Text variant="bodyMedium" style={styles.routeText}>
              {item.from} → {item.to}
            </Text>
            <Text variant="bodySmall" style={styles.dateText}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.timeInfo}>
            <Text variant="bodyMedium">{item.departureTime}</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Departure
            </Text>
          </View>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="seat" size={16} color={theme.colors.primary} />
            <Text variant="bodyMedium" style={styles.detailText}>
              Seats: {item.seats.join(', ')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="currency-usd" size={16} color={theme.colors.primary} />
            <Text variant="bodyMedium" style={styles.detailText}>
              Total: ${item.totalPrice}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={16} color={theme.colors.primary} />
            <Text variant="bodySmall" style={styles.detailText}>
              Booked: {new Date(item.bookingDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {item.status === 'confirmed' && (
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={() => handleCancelBooking(item)}
              style={styles.cancelButton}
              labelStyle={{ color: theme.colors.error }}
            >
              Cancel Booking
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.authContainer}>
          <Avatar.Icon size={80} icon="ticket" style={{ backgroundColor: theme.colors.primary }} />
          <Text variant="headlineSmall" style={[styles.authTitle, { color: theme.colors.onBackground }]}>
            Login Required
          </Text>
          <Text variant="bodyMedium" style={[styles.authSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Please login to view your bookings
          </Text>
          <AuthModal />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          My Bookings
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {bookings.length} bookings found
        </Text>
      </View>

      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={loadBookings}
      />

      <Portal>
        <Dialog visible={showCancelDialog} onDismiss={() => setShowCancelDialog(false)}>
          <Dialog.Title>Cancel Booking</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCancelDialog(false)}>Cancel</Button>
            <Button onPress={confirmCancelBooking} mode="contained" buttonColor={theme.colors.error}>
              Confirm Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
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
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  bookingCard: {
    marginBottom: 16,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  busName: {
    fontWeight: '600',
    flex: 1,
  },
  statusChip: {
    marginLeft: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontWeight: '500',
    marginBottom: 4,
  },
  dateText: {
    color: '#666',
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    borderColor: '#f44336',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authTitle: {
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  authSubtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
});