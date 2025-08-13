import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Seat } from '@/types';

interface SeatSelectorProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatToggle: (seatId: string) => void;
}

export default function SeatSelector({ seats, selectedSeats, onSeatToggle }: SeatSelectorProps) {
  const theme = useTheme();

  const getSeatColor = (seat: Seat) => {
    if (seat.isOccupied) {
      return theme.colors.errorContainer;
    }
    if (selectedSeats.includes(seat.id)) {
      return theme.colors.primary;
    }
    return theme.colors.surfaceVariant;
  };

  const getSeatIconColor = (seat: Seat) => {
    if (seat.isOccupied) {
      return theme.colors.onErrorContainer;
    }
    if (selectedSeats.includes(seat.id)) {
      return theme.colors.onPrimary;
    }
    return theme.colors.onSurfaceVariant;
  };

  const renderSeat = (seat: Seat) => (
    <View key={seat.id} style={styles.seatContainer}>
      <IconButton
        icon="seat"
        iconColor={getSeatIconColor(seat)}
        containerColor={getSeatColor(seat)}
        size={24}
        onPress={() => !seat.isOccupied && onSeatToggle(seat.id)}
        disabled={seat.isOccupied}
        style={styles.seatButton}
      />
      <Text variant="bodySmall" style={styles.seatNumber}>
        {seat.number}
      </Text>
    </View>
  );

  const renderSeatMap = () => {
    const rows: Seat[][] = [];
    const seatsPerRow = 4;
    
    for (let i = 0; i < seats.length; i += seatsPerRow) {
      rows.push(seats.slice(i, i + seatsPerRow));
    }

    return (
      <View style={styles.seatMap}>
        <View style={styles.busHeader}>
          <MaterialCommunityIcons name="steering" size={32} color={theme.colors.primary} />
          <Text variant="bodySmall" style={{ marginLeft: 8, color: theme.colors.onSurfaceVariant }}>
            Driver
          </Text>
        </View>
        
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.seatRow}>
            <View style={styles.seatPair}>
              {row.slice(0, 2).map(renderSeat)}
            </View>
            <View style={styles.aisle} />
            <View style={styles.seatPair}>
              {row.slice(2, 4).map(renderSeat)}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <IconButton
            icon="seat"
            iconColor={theme.colors.onSurfaceVariant}
            containerColor={theme.colors.surfaceVariant}
            size={20}
            style={styles.legendIcon}
          />
          <Text variant="bodySmall">Available</Text>
        </View>
        <View style={styles.legendItem}>
          <IconButton
            icon="seat"
            iconColor={theme.colors.onPrimary}
            containerColor={theme.colors.primary}
            size={20}
            style={styles.legendIcon}
          />
          <Text variant="bodySmall">Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <IconButton
            icon="seat"
            iconColor={theme.colors.onErrorContainer}
            containerColor={theme.colors.errorContainer}
            size={20}
            style={styles.legendIcon}
          />
          <Text variant="bodySmall">Occupied</Text>
        </View>
      </View>
      
      {renderSeatMap()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 10,
  },
  legendItem: {
    alignItems: 'center',
  },
  legendIcon: {
    margin: 0,
  },
  seatMap: {
    padding: 20,
    alignItems: 'center',
  },
  busHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingRight: 40,
  },
  seatRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  seatPair: {
    flexDirection: 'row',
  },
  aisle: {
    width: 40,
  },
  seatContainer: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  seatButton: {
    margin: 0,
    width: 48,
    height: 48,
  },
  seatNumber: {
    marginTop: 4,
    fontSize: 10,
  },
});