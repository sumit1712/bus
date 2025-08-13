export interface Bus {
  id: string;
  name: string;
  type: 'AC' | 'Non-AC';
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  amenities: string[];
  rating: number;
  image?: string;
}

export interface Seat {
  id: string;
  number: string;
  type: 'window' | 'aisle' | 'middle';
  isOccupied: boolean;
  isSelected: boolean;
  price: number;
}

export interface Booking {
  id: string;
  busId: string;
  busName: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  passengerName: string;
  passengerPhone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SearchFilters {
  from: string;
  to: string;
  date: string;
  busType?: 'AC' | 'Non-AC';
  sortBy?: 'price' | 'rating' | 'departure';
}