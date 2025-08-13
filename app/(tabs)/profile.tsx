import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Avatar, 
  Card, 
  List, 
  Switch, 
  Button,
  Portal,
  Dialog,
  TextInput,
  useTheme 
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';
import AuthModal from '@/components/AuthModal';

export default function ProfileScreen() {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setShowEditDialog(false);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.authContainer}>
          <Avatar.Icon size={80} icon="account" style={{ backgroundColor: theme.colors.primary }} />
          <Text variant="headlineSmall" style={[styles.authTitle, { color: theme.colors.onBackground }]}>
            Login Required
          </Text>
          <Text variant="bodyMedium" style={[styles.authSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Please login to access your profile
          </Text>
          <AuthModal />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            Profile
          </Text>
        </View>

        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text 
              size={80} 
              label={user?.name?.split(' ').map(n => n[0]).join('') || 'U'} 
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.userName}>
                {user?.name}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {user?.email}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {user?.phone}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.menuSection}>
          <List.Section>
            <List.Subheader>Account</List.Subheader>
            <List.Item
              title="Edit Profile"
              description="Update your personal information"
              left={(props) => <List.Icon {...props} icon="account-edit" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setShowEditDialog(true)}
            />
            <List.Item
              title="My Bookings"
              description="View your booking history"
              left={(props) => <List.Icon {...props} icon="ticket" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
          </List.Section>

          <List.Section>
            <List.Subheader>Preferences</List.Subheader>
            <List.Item
              title="Dark Mode"
              description="Toggle dark theme"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => <Switch value={isDarkMode} onValueChange={toggleTheme} />}
            />
            <List.Item
              title="Notifications"
              description="Manage notification settings"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          </List.Section>

          <List.Section>
            <List.Subheader>Support</List.Subheader>
            <List.Item
              title="Help & Support"
              description="Get help with your account"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
              title="About"
              description="App version and info"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          </List.Section>
        </View>

        <View style={styles.logoutSection}>
          <Button
            mode="outlined"
            onPress={() => setShowLogoutDialog(true)}
            style={[styles.logoutButton, { borderColor: theme.colors.error }]}
            labelStyle={{ color: theme.colors.error }}
            icon="logout"
          >
            Logout
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={showEditDialog} onDismiss={() => setShowEditDialog(false)}>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={editForm.name}
              onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
              style={styles.dialogInput}
              mode="outlined"
            />
            <TextInput
              label="Phone"
              value={editForm.phone}
              onChangeText={(text) => setEditForm(prev => ({ ...prev, phone: text }))}
              style={styles.dialogInput}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveProfile} mode="contained">Save</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)}>
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to logout?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogoutDialog(false)}>Cancel</Button>
            <Button onPress={handleLogout} mode="contained" buttonColor={theme.colors.error}>
              Logout
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
  profileCard: {
    margin: 20,
    elevation: 4,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuSection: {
    paddingHorizontal: 10,
  },
  logoutSection: {
    padding: 20,
  },
  logoutButton: {
    marginTop: 20,
  },
  dialogInput: {
    marginBottom: 16,
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