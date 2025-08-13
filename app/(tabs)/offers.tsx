import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { 
  Text, 
  Card, 
  Chip, 
  Button,
  useTheme,
  Avatar,
  Divider
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  code: string;
  type: 'percentage' | 'flat' | 'cashback';
  minAmount?: number;
  maxDiscount?: number;
  isActive: boolean;
}

const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'First Ride Free',
    description: 'Get your first bus booking absolutely free! Valid for new users only.',
    discount: '100%',
    validUntil: '2024-02-29',
    code: 'FIRST100',
    type: 'percentage',
    maxDiscount: 50,
    isActive: true,
  },
  {
    id: '2',
    title: 'Weekend Special',
    description: 'Save big on weekend travels. Perfect for your weekend getaways!',
    discount: '₹200',
    validUntil: '2024-02-15',
    code: 'WEEKEND200',
    type: 'flat',
    minAmount: 500,
    isActive: true,
  },
  {
    id: '3',
    title: 'Student Discount',
    description: 'Special discount for students. Show your student ID and save!',
    discount: '25%',
    validUntil: '2024-03-31',
    code: 'STUDENT25',
    type: 'percentage',
    maxDiscount: 150,
    isActive: true,
  },
  {
    id: '4',
    title: 'Cashback Bonanza',
    description: 'Get cashback on every booking. The more you travel, the more you save!',
    discount: '₹100',
    validUntil: '2024-02-20',
    code: 'CASHBACK100',
    type: 'cashback',
    minAmount: 300,
    isActive: true,
  },
  {
    id: '5',
    title: 'Group Booking',
    description: 'Book for 4 or more passengers and get amazing discounts!',
    discount: '30%',
    validUntil: '2024-02-28',
    code: 'GROUP30',
    type: 'percentage',
    minAmount: 1000,
    maxDiscount: 500,
    isActive: false,
  },
];

export default function OffersScreen() {
  const theme = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getOfferIcon = (type: Offer['type']) => {
    switch (type) {
      case 'percentage':
        return 'percent';
      case 'flat':
        return 'currency-inr';
      case 'cashback':
        return 'cash-refund';
      default:
        return 'tag';
    }
  };

  const getOfferColor = (type: Offer['type']) => {
    switch (type) {
      case 'percentage':
        return theme.colors.primary;
      case 'flat':
        return theme.colors.secondary;
      case 'cashback':
        return theme.colors.tertiary;
      default:
        return theme.colors.outline;
    }
  };

  const renderOfferItem = ({ item }: { item: Offer }) => (
    <Card 
      style={[
        styles.offerCard,
        !item.isActive && { opacity: 0.6 }
      ]}
    >
      <Card.Content>
        <View style={styles.offerHeader}>
          <View style={styles.offerTitleContainer}>
            <Avatar.Icon 
              size={40} 
              icon={getOfferIcon(item.type)}
              style={{ backgroundColor: getOfferColor(item.type) }}
            />
            <View style={styles.offerTitleText}>
              <Text variant="titleMedium" style={styles.offerTitle}>
                {item.title}
              </Text>
              <Chip 
                compact 
                style={[
                  styles.discountChip,
                  { backgroundColor: getOfferColor(item.type) }
                ]}
                textStyle={{ color: 'white', fontWeight: 'bold' }}
              >
                {item.discount} OFF
              </Chip>
            </View>
          </View>
          {!item.isActive && (
            <Chip 
              compact 
              style={{ backgroundColor: theme.colors.errorContainer }}
              textStyle={{ color: theme.colors.onErrorContainer }}
            >
              Expired
            </Chip>
          )}
        </View>

        <Text variant="bodyMedium" style={[styles.offerDescription, { color: theme.colors.onSurfaceVariant }]}>
          {item.description}
        </Text>

        <Divider style={styles.divider} />

        <View style={styles.offerDetails}>
          <View style={styles.offerInfo}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Valid until: {new Date(item.validUntil).toLocaleDateString()}
            </Text>
            {item.minAmount && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Min. booking: ₹{item.minAmount}
              </Text>
            )}
            {item.maxDiscount && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Max. discount: ₹{item.maxDiscount}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.codeContainer}>
          <View style={styles.codeBox}>
            <Text variant="titleSmall" style={[styles.codeText, { color: theme.colors.primary }]}>
              {item.code}
            </Text>
          </View>
          <Button
            mode="outlined"
            onPress={() => handleCopyCode(item.code)}
            disabled={!item.isActive}
            style={styles.copyButton}
          >
            {copiedCode === item.code ? 'Copied!' : 'Copy Code'}
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const activeOffers = mockOffers.filter(offer => offer.isActive);
  const expiredOffers = mockOffers.filter(offer => !offer.isActive);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            Special Offers
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Save more on your bus bookings
          </Text>
        </View>

        {/* Featured Offer */}
        <Card style={[styles.featuredCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content>
            <View style={styles.featuredHeader}>
              <MaterialCommunityIcons name="star" size={32} color={theme.colors.primary} />
              <Text variant="titleLarge" style={[styles.featuredTitle, { color: theme.colors.onPrimaryContainer }]}>
                Featured Offer
              </Text>
            </View>
            <Text variant="headlineSmall" style={[styles.featuredDiscount, { color: theme.colors.primary }]}>
              Get 100% OFF on your first ride!
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, marginBottom: 16 }}>
              New to SwiftBus? Your first journey is on us! Book now and travel for free.
            </Text>
            <Button 
              mode="contained" 
              style={styles.featuredButton}
              buttonColor={theme.colors.primary}
            >
              Claim Now
            </Button>
          </Card.Content>
        </Card>

        {/* Active Offers */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Active Offers ({activeOffers.length})
          </Text>
          <FlatList
            data={activeOffers}
            renderItem={renderOfferItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Expired Offers */}
        {expiredOffers.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
              Recently Expired ({expiredOffers.length})
            </Text>
            <FlatList
              data={expiredOffers}
              renderItem={renderOfferItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Terms and Conditions */}
        <Card style={styles.termsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.termsTitle, { color: theme.colors.onSurface }]}>
              Terms & Conditions
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}>
              • Offers are valid for limited time only{'\n'}
              • Cannot be combined with other offers{'\n'}
              • Applicable on select routes only{'\n'}
              • SwiftBus reserves the right to modify or cancel offers{'\n'}
              • Standard booking terms apply
            </Text>
          </Card.Content>
        </Card>
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
  featuredCard: {
    margin: 20,
    marginTop: 10,
    elevation: 6,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredTitle: {
    marginLeft: 12,
    fontWeight: 'bold',
  },
  featuredDiscount: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredButton: {
    alignSelf: 'flex-start',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  offerCard: {
    marginBottom: 16,
    elevation: 4,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  offerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  offerTitleText: {
    marginLeft: 12,
    flex: 1,
  },
  offerTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  discountChip: {
    alignSelf: 'flex-start',
  },
  offerDescription: {
    marginBottom: 16,
    lineHeight: 20,
  },
  divider: {
    marginBottom: 16,
  },
  offerDetails: {
    marginBottom: 16,
  },
  offerInfo: {
    gap: 4,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  codeText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  copyButton: {
    minWidth: 100,
  },
  termsCard: {
    margin: 20,
    marginTop: 0,
    elevation: 2,
  },
  termsTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
});