import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RefreshControl  } from 'react-native';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import transactionData from '@/assets/transactions.json';

type Transaction = {
  id: string;
  amount: string;
  date: string;
  description: string;
  type: string;
};

const TransactionHistoryScreen = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>(transactionData);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    
    const router = useRouter()

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
   
    const handleError = (error: any, fallbackMessage: string) => {
      const errorMessage = error?.message || fallbackMessage;
      setError(errorMessage);
      Alert.alert('Error encountered. Please restart app.');
    };

    const onRefresh = async () => {
      setRefreshing(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newTransaction = {
          id: `${Date.now()}`,
          amount: (Math.random() * 1000).toFixed(2),
          date: new Date().toISOString().split('T')[0],
          description: "New Transaction",
          type: Math.random() > 0.5 ? "Credit" : "Debit"
        };

        setTransactions((prev: typeof transactions) => [newTransaction, ...prev]);
      } catch (error) {
        handleError(error, 'Failed to refresh transactions')
      } finally {
        setRefreshing(false);
      }
    };

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

    const filterTransactions = (data: Transaction[]) => {
      return data.filter(item => {
        const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = !selectedType || item.type === selectedType;
        return matchesSearch && matchesType;
      });
    };

    useEffect(() => {
      const authenticate = async () => {
        if (!authenticated) {
          setIsLoading(true);
          setError(null);

          try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
              throw new Error ('Device does not support biometric authentication');
            }
    
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
              throw new Error('No biometrics registered on this device');
            }
    
            const result = await LocalAuthentication.authenticateAsync({
              promptMessage: 'Authenticate to view transactions',
              fallbackLabel: 'Use device PIN'
            });
    
            if (result.success) {
              setAuthenticated(true);
            } else if (result.error === 'user cancel') {
              handleError(null, 'Authentication cancelled');
            } else {
              throw new Error('Authentication failed');
            }
          } catch (error) {
              handleError(error, 'Authentication error occurred');
              setAuthenticated(false);
            } finally {
              setIsLoading(false);
            }
          }
        };
    
        authenticate();
      }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      {isLoading && (
      <ActivityIndicator size="large" color="#fff" />
    )}
    {error && (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )}
    <View style={styles.filterContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search transactions..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        />
        <View style={styles.filterButtons}>
        <Text style={styles.filterText}>Filter: </Text>
          <TouchableOpacity
            style={[styles.filterButton, selectedType === 'Credit' && styles.activeFilter]}
            onPress={() => setSelectedType(selectedType === 'Credit' ? null : 'Credit')}
            >
              <Text>Credit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedType === 'Debit' && styles.activeFilter]}
              onPress={() => setSelectedType(selectedType === 'Debit' ? null : 'Debit')}
              >
                <Text>Debit</Text>
              </TouchableOpacity>
        </View>
    </View>
      <FlatList
        data={filterTransactions(sortTransactions(transactions))}
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
                backgroundColor: item.type === 'Credit' ? '#e3e3e3' : '#e5e7f3',
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
                        { color: item.type === 'Credit' ? 'green' : 'red' }
                    ]}>
                        {authenticated ? `RM ${item.amount}` : '****'}
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

    errorContainer: {
      padding: 16,
      backgroundColor: '#ffebee',
      marginHorizontal: 12,
      borderRadius: 8,
      marginBottom: 8
    },

    errorText: {
      color: '#d32f2f',
      textAlign: 'center'
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
    },
    filterContainer: {
      padding: 12,
    },
    searchInput: {
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
    },
    filterText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: 'white',
      width: 120,
      flex: 1,
      textAlignVertical: 'center',
    },
    filterButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    filterButton: {
      padding: 7,
      backgroundColor: '#e3e3e3',
      borderRadius: 13,
      marginLeft: 10,
    },
    activeFilter: {
      backgroundColor: '#897500',
    }
});

export default TransactionHistoryScreen;
