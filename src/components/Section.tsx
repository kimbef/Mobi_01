import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function Section({ title, subtitle, children }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 14,
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e2e8f0',
    letterSpacing: 0.2,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
});
