import { Bus, Booking } from '@/types';

export const mockBuses: Bus[] = [
  {
    id: '1',
    name: 'SwiftBus Express',
    type: 'AC',
    from: 'New York',
    to: 'Philadelphia',
    departureTime: '08:00 AM',
    arrivalTime: '10:30 AM',
    duration: '2h 30m',
    price: 45,
    availableSeats: 12,
    totalSeats: 40,
    amenities: ['WiFi', 'USB Charging', 'Air Conditioning', 'Reclining Seats'],
    rating: 4.5,
    image: 'https://images.pexels.com/photos/159291/bus-public-transport-transportation-street-159291.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    name: 'Metro Comfort',
    type: 'Non-AC',
    from: 'New York',
    to: 'Philadelphia',
    departureTime: '09:15 AM',
    arrivalTime: '11:45 AM',
    duration: '2h 30m',
    price: 35,
    availableSeats: 8,
    totalSeats: 45,
    amenities: ['WiFi', 'USB Charging', 'Reading Lights'],
    rating: 4.2,
    image: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    name: 'Royal Sleeper',
    type: 'AC',
    from: 'New York',
    to: 'Boston',
    departureTime: '11:00 PM',
    arrivalTime: '07:00 AM',
    duration: '8h 00m',
    price: 85,
    availableSeats: 6,
    totalSeats: 32,
    amenities: ['WiFi', 'USB Charging', 'Air Conditioning', 'Sleeper Beds', 'Blankets'],
    rating: 4.8,
    image: 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '4',
    name: 'City Connect',
    type: 'AC',
    from: 'Philadelphia',
    to: 'Washington DC',
    departureTime: '02:00 PM',
    arrivalTime: '04:15 PM',
    duration: '2h 15m',
    price: 40,
    availableSeats: 15,
    totalSeats: 38,
    amenities: ['WiFi', 'Air Conditioning', 'Snacks'],
    rating: 4.3,
    image: 'https://images.pexels.com/photos/1007456/pexels-photo-1007456.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'B001',
    busId: '1',
    busName: 'SwiftBus Express',
    from: 'New York',
    to: 'Philadelphia',
    date: '2024-01-15',
    departureTime: '08:00 AM',
    arrivalTime: '10:30 AM',
    seats: ['A1', 'A2'],
    totalPrice: 90,
    status: 'confirmed',
    bookingDate: '2024-01-10',
    passengerName: 'John Doe',
    passengerPhone: '+1234567890',
  },
  {
    id: 'B002',
    busId: '3',
    busName: 'Royal Sleeper',
    from: 'New York',
    to: 'Boston',
    date: '2024-01-08',
    departureTime: '11:00 PM',
    arrivalTime: '07:00 AM',
    seats: ['S5'],
    totalPrice: 85,
    status: 'completed',
    bookingDate: '2024-01-05',
    passengerName: 'John Doe',
    passengerPhone: '+1234567890',
  },
];

export const generateSeats = (totalSeats: number, occupiedSeats: string[] = []): any[] => {
  const seats = [];
  const seatsPerRow = 4;
  const rows = Math.ceil(totalSeats / seatsPerRow);
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < seatsPerRow && seats.length < totalSeats; col++) {
      const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;
      seats.push({
        id: seatNumber,
        number: seatNumber,
        type: col === 0 || col === 3 ? 'window' : col === 1 ? 'aisle' : 'middle',
        isOccupied: occupiedSeats.includes(seatNumber),
        isSelected: false,
        price: 45,
      });
    }
  }
  
  return seats;
};