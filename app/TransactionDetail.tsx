import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  TransactionDetail: {
    transaction: {
      id: string;
      amount: string;
      date: string;
      description: string;
      type: string;
    }
  };
};

type TransactionDetailProps = {
  route: RouteProp<RootStackParamList, 'TransactionDetail'>;
};

const TransactionDetail = () => {
  const params = useLocalSearchParams();
  const transaction = {
    id: params.id as string,
    amount: params.amount as string,
    date: params.date as string,
    description: params.description as string,
    type: params.type as string
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction Details</Text>
      <View style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formatDate(transaction.date)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{transaction.description}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={[
            styles.value,
            { color: transaction.type === 'credit' ? 'green' : 'red' }
          ]}>
            {transaction.amount}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{transaction.type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{transaction.id}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e7f3',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001489',
    marginBottom: 20,
    textAlign: 'center'
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0,
    borderBottomColor: '#eee'
  },
  label: {
    fontWeight: 'bold',
    width: 120,
    color: '#666'
  },
  value: {
    flex: 1,
    color: '#08204d'
  }
});

export default TransactionDetail;