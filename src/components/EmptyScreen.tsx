import { View, Text, StyleSheet } from 'react-native';

type EmptyScreenProps = {
  emoji: string;
  title: string;
  subtitle: string;
};


export function EmptyScreen({emoji, title, subtitle}: EmptyScreenProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
                {subtitle}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emoji: {
        fontSize: 72,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 16,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 12,
    },
});
