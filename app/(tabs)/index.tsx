import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, useColorScheme, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect, NavigationProp } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import transactions from '@/assets/transactions.json';

type RootStackParamList = {
    TransactionHistory: undefined;
    TransactionDetail: { transaction: { id: string; amount: string; date: string; description: string; type: string; } };
};

const TransactionHistoryScreen = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';


    useFocusEffect(
        React.useCallback(() => {
          const authenticate = async () => {
            try {
              const hasHardware = await LocalAuthentication.hasHardwareAsync();
              if (!hasHardware) {
                Alert.alert('Error', 'Your device does not support biometric authentication.');
                return;
              }
    
              const isEnrolled = await LocalAuthentication.isEnrolledAsync();
              if (!isEnrolled) {
                Alert.alert('Error', 'No biometrics are registered on this device.');
                return;
              }
    
              const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to view transactions',
              });
    
              if (result.success) {
                setAuthenticated(true);
              } else {
                setAuthenticated(false);
                Alert.alert('Authentication Failed', 'Unable to authenticate using Biometrics.');
              }
            } catch (error) {
              setAuthenticated(false);
              Alert.alert('Authentication Error', 'An error occurred while trying to authenticate.');
            }
          };
    
          authenticate();
        }, [])
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity
            style={[styles.transactionItem, {
                backgroundColor: item.type === 'credit' ? '#e6f3e6' : '#f3e6e6',
            }]}
            onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
          >
            <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.labelText}>Date: </Text>
                    <Text style={[styles.valueText, { color: '#08204d' }]}>
                        {item.date}
                    </Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.labelText}>Description: </Text>
                    <Text style={[styles.valueText, { color: '#08204d' }]}>
                        {item.description}
                    </Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.labelText}>Amount: </Text>
                    <Text style={[
                        styles.valueText,
                        { color: item.type === 'credit' ? 'green' : 'red' }
                    ]}>
                        {authenticated ? item.amount : '****'}
                    </Text>
                </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
                <Text style={styles.emptyListText}>No transactions found</Text>
            </View>
        )}
    />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#063970',
        paddingTop: 10,
        marginTop: 40,
    },
    transactionItem: {
        padding: 22,
        marginVertical: 8,
        marginHorizontal: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    transactionDetails: {
        flexDirection: 'column'

    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'center'
    },
    labelText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#666',
        width: 120,
    },
    valueText: {
        fontSize: 16,
        flex: 1
    },
    emptyListContainer: {
        alignItems: 'center',
        marginTop: 50
    },
    emptyListText: {
        fontSize: 18,
        color: '#888'
    }
});

export default TransactionHistoryScreen;
