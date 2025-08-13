import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Bus } from '@/types';

interface BusCardProps {
  bus: Bus;
  onPress: () => void;
}

export default function BusCard({ bus, onPress }: BusCardProps) {
  const theme = useTheme();

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.busInfo}>
            <Text variant="titleMedium" style={styles.busName}>
              {bus.name}
            </Text>
            <Chip
              mode="outlined"
              compact
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
          <Text variant="titleMedium" style={[styles.price, { color: theme.colors.primary }]}>
            ${bus.price}
          </Text>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.route}>
            <Text variant="bodyLarge" style={styles.routeText}>
              {bus.from}
            </Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={20} 
              color={theme.colors.onSurfaceVariant}
              style={styles.arrow}
            />
            <Text variant="bodyLarge" style={styles.routeText}>
              {bus.to}
            </Text>
          </View>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {bus.duration}
          </Text>
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeInfo}>
            <Text variant="bodyMedium" style={styles.time}>
              {bus.departureTime}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Departure
            </Text>
          </View>
          <View style={styles.timeInfo}>
            <Text variant="bodyMedium" style={styles.time}>
              {bus.arrivalTime}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Arrival
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.seatsInfo}>
            <MaterialCommunityIcons name="seat" size={16} color={theme.colors.primary} />
            <Text variant="bodySmall" style={styles.seatsText}>
              {bus.availableSeats} seats available
            </Text>
          </View>
          <View style={styles.rating}>
            <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
            <Text variant="bodySmall" style={styles.ratingText}>
              {bus.rating}
            </Text>
          </View>
        </View>

        <View style={styles.amenities}>
          {bus.amenities.slice(0, 3).map((amenity, index) => (
            <Chip key={index} compact style={styles.amenityChip}>
              {amenity}
            </Chip>
          ))}
          {bus.amenities.length > 3 && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              +{bus.amenities.length - 3} more
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  busInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  busName: {
    fontWeight: '600',
    marginRight: 12,
  },
  typeChip: {
    height: 28,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  routeContainer: {
    marginBottom: 12,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeText: {
    fontWeight: '500',
  },
  arrow: {
    marginHorizontal: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeInfo: {
    alignItems: 'center',
  },
  time: {
    fontWeight: '500',
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seatsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatsText: {
    marginLeft: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  amenityChip: {
    height: 24,
  },
});