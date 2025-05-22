import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, LayoutAnimation, UIManager, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { UserCircle, LogOut, ChevronRight, HelpCircle, Shield, Info, Mail, Edit3, Save, Check, Palette, ChevronDown, ChevronUp } from 'lucide-react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/MainTabNavigator';
import type { FetchUserAttributesOutput } from 'aws-amplify/auth';
import type { ThemeName } from '../context/ThemeContext';

type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;

interface MenuNavigationItem {
    id: string;
    text: string;
    icon: React.ReactNode;
    onPress: () => void;
}

interface MenuInputItem {
    id: string;
    isInput: true;
    text: string;
    icon: React.ReactNode;
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
    onSave: () => void;
}

interface ThemeSelectorItem {
    id: ThemeName;
    displayName: string;
    onSelect: () => void;
    isSelected: boolean;
}

interface MenuSection {
    title: string;
    items: (MenuNavigationItem | MenuInputItem)[];
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, signOut, fetchCurrentUserAttributes, userProfile, updateUserProfileData } = useAuth();
  const { theme, currentThemeName, setTheme, availableThemes, isLoadingTheme } = useAppTheme();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [nicknameInput, setNicknameInput] = useState(userProfile?.nickname || '');
  const [isAppearanceExpanded, setIsAppearanceExpanded] = useState(false);

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    if (userProfile?.nickname !== nicknameInput && !isLoadingTheme) {
        setNicknameInput(userProfile?.nickname || '');
    }
  }, [userProfile?.nickname, isLoadingTheme]);

  useEffect(() => {
    const loadUserEmail = async () => {
      if (user) {
        try {
          const attributes: FetchUserAttributesOutput = await fetchCurrentUserAttributes();
          setUserEmail(attributes.email || null);
        } catch (error) {
          console.warn('Failed to fetch user email:', error);
          setUserEmail(null);
        }
      }
    };
    loadUserEmail();
  }, [user, fetchCurrentUserAttributes]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out: ', error);
      Alert.alert('Sign Out Error', 'Could not sign out.');
    }
  };

  const handleSaveNickname = async () => {
    if (nicknameInput.trim() === (userProfile?.nickname || '')) {
        Alert.alert("No Change", "Nickname is the same.");
        return;
    }
    try {
        await updateUserProfileData({ nickname: nicknameInput.trim() });
        Alert.alert("Success", "Nickname updated!");
    } catch (error) {
        Alert.alert("Error", "Could not update nickname.");
        console.error("Error updating nickname:", error);
    }
  };

  const getThemeDisplayName = (themeName: ThemeName): string => {
    const parts = themeName.replace(/([A-Z])/g, ' $1').trim();
    return parts.charAt(0).toUpperCase() + parts.slice(1);
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    scrollView: { flexGrow: 1 },
    headerContainer: {
      alignItems: 'center',
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    userIconContainer: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    userNameAndNicknameContainer: { alignItems: 'center', marginBottom: 4},
    userName: {
      fontSize: 22,
      fontFamily: theme.fontFamilyBold,
      color: theme.text,
    },
    userNicknameDisplay: { fontSize: 16, fontFamily: theme.fontFamilyRegular, color: theme.secondaryText, marginTop: 2 },
    userEmailContainer: { flexDirection: 'row', alignItems: 'center'},
    userEmail: { fontSize: 15, fontFamily: theme.fontFamilyRegular, color: theme.secondaryText, marginLeft: 6 },
    mainContentContainer: {
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    sectionCard: {
      marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: theme.fontFamilySemiBold,
        color: theme.secondaryText,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    menuItemIcon: {
      marginRight: 16,
    },
    menuItemText: {
      fontSize: 17,
      fontFamily: theme.fontFamilyRegular,
      color: theme.text,
    },
    menuItemChevron: { marginLeft: 'auto' },
    inputMenuItemContainer: { marginBottom: 12, paddingHorizontal: 0 }, 
    inputWithLabelContainer: { marginBottom: 8 },
    inputLabel: { fontSize: 14, fontFamily: theme.fontFamilyMedium, color: theme.secondaryText, marginBottom: 8, marginLeft:4 },
    saveButtonContainer: { marginTop: 8, alignItems: 'flex-end' }, 
    signOutButton: {
      marginTop: 24,
      marginBottom: 30,
    },
    buttonText: {
        fontFamily: theme.fontFamilyMedium,
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center'},
    appearanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16, 
        paddingHorizontal: 16,
    },
    themeListContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    themeSelectItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    themeSelectText: {
        fontSize: 16,
        fontFamily: theme.fontFamilyRegular,
        color: theme.text,
    },
    themeSelectedItem: {
    },
    themeSelectedText: {
        fontFamily: theme.fontFamilyMedium,
        color: theme.primary,
    },
    appearanceChevron: {
        marginLeft: 'auto',
    },
  });

  const menuSections: MenuSection[] = [
    {
        title: 'Account',
        items: [
            { id: 'nickname', isInput: true, text: 'Nickname', icon: <Edit3 size={22} color={theme.secondaryText}/>, value: nicknameInput, placeholder: "Enter your nickname", onChangeText: setNicknameInput, onSave: handleSaveNickname },
            { id: 'editProfile', text: 'Edit Details', icon: <UserCircle size={22} color={theme.secondaryText} />, onPress: () => Alert.alert('Feature', 'Full profile editing coming soon!') },
        ]
    },
    {
        title: 'Support & About',
        items: [
            { id: 'help', text: 'Help Center', icon: <HelpCircle size={22} color={theme.secondaryText} />, onPress: () => Alert.alert('Feature', 'Help Center coming soon!') },
            { id: 'privacy', text: 'Privacy Policy', icon: <Shield size={22} color={theme.secondaryText} />, onPress: () => Alert.alert('Feature', 'Privacy Policy coming soon!') },
            { id: 'about', text: 'About PranaAI', icon: <Info size={22} color={theme.secondaryText} />, onPress: () => Alert.alert('Feature', 'About PranaAI coming soon!') },
        ]
    },
  ];

  if (isLoadingTheme) {
    return <SafeAreaView style={styles.safeArea}><View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.primary} /></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? YOUR_HEADER_HEIGHT : 0} // Adjust if there's a header
      >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <View style={styles.userIconContainer}>
              <UserCircle size={48} color={theme.primary} />
            </View>
            <View style={styles.userNameAndNicknameContainer}>
              <Text style={styles.userName}>{userProfile?.nickname || user?.username || 'Prana User'}</Text>
              {userProfile?.nickname && user?.username && <Text style={styles.userNicknameDisplay}>@{user.username}</Text>}
            </View>
            <View style={styles.userEmailContainer}>
              <Mail size={14} color={theme.secondaryText} />
              <Text style={styles.userEmail}>{userEmail || (user?.username && user.username.includes('@') ? user.username : 'No email found')}</Text>
            </View>
          </View>

          <View style={styles.mainContentContainer}>
              <Text style={styles.sectionTitle}>Display</Text>
              <Card style={styles.sectionCard}>
                  <TouchableOpacity 
                    style={styles.appearanceHeader} 
                    onPress={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setIsAppearanceExpanded(!isAppearanceExpanded);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemIcon}>
                      <Palette color={theme.secondaryText} size={22} />
                    </View>
                    <Text style={styles.menuItemText}>Appearance</Text> 
                    <View style={styles.appearanceChevron}>
                      {isAppearanceExpanded ? (
                          <ChevronUp color={theme.secondaryText} size={22} />
                      ) : (
                          <ChevronDown color={theme.secondaryText} size={22} />
                      )}
                    </View>
                  </TouchableOpacity>

                  {isAppearanceExpanded && (
                    <View style={styles.themeListContainer}>
                      {(Object.keys(availableThemes) as ThemeName[]).map(themeNameKey => (
                          <TouchableOpacity 
                              key={themeNameKey} 
                              onPress={() => setTheme(themeNameKey)} 
                              style={[
                                  styles.themeSelectItem,
                                  currentThemeName === themeNameKey && styles.themeSelectedItem
                              ]}
                          >
                              <Text style={[
                                  styles.themeSelectText, 
                                  currentThemeName === themeNameKey && styles.themeSelectedText
                              ]}>
                                  {getThemeDisplayName(themeNameKey)}
                              </Text>
                              {currentThemeName === themeNameKey && <Check size={20} color={theme.primary} />}
                          </TouchableOpacity>
                      ))}
                    </View>
                  )}
              </Card>

              {menuSections.map(section => (
                <View key={section.title + "_section_display"}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.items.map((item, index) => {
                      if ((item as MenuInputItem).isInput) {
                          const inputItem = item as MenuInputItem;
                          return (
                              <Card key={inputItem.id} style={styles.inputMenuItemContainer}>
                                  <View style={styles.inputWithLabelContainer}>
                                      <Text style={styles.inputLabel}>{inputItem.text}</Text>
                                      <Input 
                                          value={inputItem.value}
                                          onChangeText={inputItem.onChangeText}
                                          placeholder={inputItem.placeholder}
                                          icon={inputItem.icon} 
                                          iconPosition="left"
                                      />
                                  </View>
                                  <View style={styles.saveButtonContainer}>
                                      <Button title="Save Nickname" onPress={inputItem.onSave} size="small" icon={<Save size={16} color={theme.primaryButtonText}/>} />
                                  </View>
                              </Card>
                          );
                      } else {
                          const navItem = item as MenuNavigationItem;
                          return (
                              <Card style={styles.sectionCard} key={navItem.id}>
                                  <TouchableOpacity onPress={navItem.onPress} activeOpacity={0.6}>
                                  <View style={styles.menuItem}>
                                      <View style={styles.menuItemIcon}>{navItem.icon}</View>
                                      <Text style={styles.menuItemText}>{navItem.text}</Text>
                                      <ChevronRight size={20} color={theme.secondaryText} style={styles.menuItemChevron} />
                                  </View>
                                  </TouchableOpacity>
                              </Card>
                          );
                      }
                  })}
                </View>
              ))}

              <Button
                title="Sign Out"
                onPress={handleSignOut}
                variant="danger"
                style={styles.signOutButton}
                icon={<LogOut size={18} color={theme.primaryButtonText}/>}
                textStyle={styles.buttonText}
                fullWidth={false}
              />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen; 