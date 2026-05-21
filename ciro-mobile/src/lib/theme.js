import { StyleSheet } from 'react-native';

export const theme = {
  colors: {
    bgDark: '#020205',
    bgDarkSecondary: '#0a0a16',
    bgCard: 'rgba(5, 5, 15, 0.65)',
    primary: '#00f0ff',       // Electric Cyan
    accent: '#b026ff',        // Neon Purple
    alert: '#ff003c',         // Cyberpunk Crimson
    warning: '#ffe066',       // Neon Gold / Amber
    success: '#10b981',       // Emerald Green
    text: '#e2e8f0',          // Off White
    dim: '#64748b',           // Dim Slate Gray
    border: 'rgba(0, 240, 255, 0.15)',
    borderActive: 'rgba(0, 240, 255, 0.4)',
    borderPurple: 'rgba(176, 38, 255, 0.2)',
    borderRed: 'rgba(255, 0, 60, 0.25)',
  },
  fonts: {
    regular: 'Outfit_400Regular',
    semibold: 'Outfit_600SemiBold',
    bold: 'Outfit_700Bold',
    mono: 'monospace', // Default system mono font, or Courier on iOS
  },
  glass: {
    backgroundColor: 'rgba(5, 5, 15, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.15)',
    borderRadius: 16,
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  }
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgDark,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  neonText: {
    color: theme.colors.primary,
    textShadowColor: 'rgba(0, 240, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontFamily: theme.fonts.semibold,
    fontSize: 12,
    color: theme.colors.dim,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  glassCard: {
    ...theme.glass,
    padding: 20,
    marginBottom: 16,
  },
  cyberInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    color: theme.colors.text,
    padding: 14,
    fontFamily: theme.fonts.semibold,
    fontSize: 15,
    marginBottom: 12,
  },
  btnCyber: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  btnCyberText: {
    fontFamily: theme.fonts.bold,
    color: '#020205',
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
  }
});
