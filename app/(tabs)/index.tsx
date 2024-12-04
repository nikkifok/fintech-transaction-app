import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, useColorScheme, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect, NavigationProp } from '@react-navigation/native';
import { RefreshControl  } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import transactionData from '@/assets/transactions.json';

type Transaction = {
  id: string;
  amount: string;
  date: string;
  description: string;
  type: string;
};

type RootStackParamList = {
    TransactionHistory: undefined;
    TransactionDetail: { transaction: Transaction };
};

const TransactionHistoryScreen = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>(transactionData);
    const router = useRouter()

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        const newTransaction = {
          id: `${Date.now()}`,
          amount: (Math.random() * 1000).toFixed(2),
          date: new Date().toISOString().split('T')[0],
          description: "New Transaction",
          type: Math.random() > 0.5 ? "credit" : "debit"
        };

        setTransactions((prev: typeof transactions) => [newTransaction, ...prev]);
        setRefreshing(false);
      }, 1500);
    }, [transactionData]);

    const sortTransactions = (data: typeof transactions) => {
      return [...data].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

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
      <Text style={styles.header}>Transaction History</Text>
      <FlatList
        data={sortTransactions(transactions)}
        refreshControl={
          <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
              titleColor="#fff"
            />
        }

        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity
            style={[styles.transactionItem, {
                backgroundColor: item.type === 'credit' ? '#e3e3e3' : '#e5e7f3',
            }]}
            onPress={() => router.push({
              pathname: "/TransactionDetail",
              params: { 
                id: item.id,
                amount: item.amount,
                date: item.date,
                description: item.description,
                type: item.type
              }
            })}
          >
            <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.labelText}>Date: </Text>
                    <Text style={[styles.valueText, { color: '#08204d' }]}>
                        {formatDate(item.date)}
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
                <View style={styles.detailRow}>
                    <Text style={styles.labelText}>Type: </Text>
                    <Text style={[
                        styles.valueText, { color: '#08204d'}]}>
                        {item.type}
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
        backgroundColor: '#001489',
        paddingTop: 10,
        marginTop: 40,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      padding: 16,
      textAlign: 'center',
      
      
    },
    transactionItem: {
        padding: 15,
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
