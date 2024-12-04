import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

const TransactionDetailScreen = ({ route }: { route: any }) => {
  const { transaction } = route.params;
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <View style={styles.container}>
      <Text style={{ color: textColor }}>Amount: {transaction.amount}</Text>
      <Text style={{ color: textColor }}>Date: {transaction.date}</Text>
      <Text style={{ color: textColor }}>Description: {transaction.description}</Text>
      <Text style={{ color: textColor }}>Type: {transaction.type}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default TransactionDetailScreen;