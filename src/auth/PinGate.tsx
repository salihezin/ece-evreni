import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { hasPinSet, setPin, verifyPin } from './pin';

const PIN_LENGTH = 4;
const KEYPAD_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

type Status = 'checking' | 'create' | 'confirm' | 'enter' | 'unlocked';

type Props = {
  children: React.ReactNode;
  /** Shown above the keypad, e.g. "Masallar Yönetimi". */
  title?: string;
};

export function PinGate({ children, title }: Props) {
  const [status, setStatus] = useState<Status>('checking');
  const [pendingPin, setPendingPin] = useState('');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  // Re-checked every time this screen gains focus (not just on first
  // mount) so switching to the "Yönetim" tab always asks for the PIN
  // again, even though React Navigation keeps tab screens mounted.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      setStatus('checking');
      setInput('');
      setPendingPin('');
      setError('');

      hasPinSet().then(exists => {
        if (isActive) {
          setStatus(exists ? 'enter' : 'create');
        }
      });

      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleComplete = async (value: string) => {
    if (status === 'create') {
      setPendingPin(value);
      setInput('');
      setStatus('confirm');
      return;
    }

    if (status === 'confirm') {
      if (value === pendingPin) {
        await setPin(value);
        setStatus('unlocked');
      } else {
        setError('PIN\u2019ler eşleşmedi, tekrar dene');
        setPendingPin('');
        setInput('');
        setStatus('create');
      }
      return;
    }

    if (status === 'enter') {
      const isValid = await verifyPin(value);

      if (isValid) {
        setStatus('unlocked');
      } else {
        setError('Yanlış PIN');
        setInput('');
      }
    }
  };

  const handleDigit = (digit: string) => {
    setError('');
    const next = (input + digit).slice(0, PIN_LENGTH);
    setInput(next);

    if (next.length === PIN_LENGTH) {
      handleComplete(next);
    }
  };

  const handleBackspace = () => {
    setError('');
    setInput(prev => prev.slice(0, -1));
  };

  if (status === 'checking') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (status === 'unlocked') {
    return <>{children}</>;
  }

  const heading =
    status === 'create'
      ? 'Yeni bir PIN oluştur'
      : status === 'confirm'
        ? 'PIN\u2019i tekrar gir'
        : 'PIN gir';

  return (
    <View style={styles.container}>
      {!!title && <Text style={styles.screenTitle}>{title}</Text>}

      <Text style={styles.heading}>{heading}</Text>

      <View style={styles.dotsRow}>
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index < input.length && styles.dotFilled]}
          />
        ))}
      </View>

      <Text style={styles.error}>{error || ' '}</Text>

      <View style={styles.keypad}>
        {KEYPAD_DIGITS.map(digit => (
          <Pressable key={digit} style={styles.key} onPress={() => handleDigit(digit)}>
            <Text style={styles.keyText}>{digit}</Text>
          </Pressable>
        ))}

        <View style={styles.key} />

        <Pressable style={styles.key} onPress={() => handleDigit('0')}>
          <Text style={styles.keyText}>0</Text>
        </Pressable>

        <Pressable style={styles.key} onPress={handleBackspace}>
          <Text style={styles.keyText}>⌫</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  screenTitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
    marginHorizontal: 8,
  },
  dotFilled: {
    backgroundColor: '#333',
  },
  error: {
    color: '#D32F2F',
    marginBottom: 16,
    height: 20,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 264,
    justifyContent: 'center',
  },
  key: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
  },
  keyText: {
    fontSize: 28,
    fontWeight: '500',
  },
});
