import { StyleSheet, Text, Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors, spacing } from '@/src/theme/tokens';
import type { PlanSectionKey } from '@/src/services/profile';

type SegmentSection = {
  key: PlanSectionKey;
  label: string;
  done: boolean;
};

type DomainSegmentBarProps = {
  sections: SegmentSection[];
  active: PlanSectionKey;
  onSelect: (key: PlanSectionKey) => void;
};

export function DomainSegmentBar({ sections, active, onSelect }: DomainSegmentBarProps) {
  return (
    <View style={styles.row}>
      {sections.map((section) => {
        const isActive = section.key === active;
        return (
          <Pressable
            key={section.key}
            onPress={() => onSelect(section.key)}
            style={[styles.segment, isActive && styles.segmentActive]}
          >
            <View style={styles.segmentInner}>
              {section.done ? (
                <SymbolView
                  name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
                  tintColor={isActive ? colors.copper.base : colors.gray[500]}
                  size={12}
                />
              ) : null}
              <Text
                style={[styles.segmentText, isActive && styles.segmentTextActive]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {section.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[900],
    borderRadius: 18,
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    borderColor: colors.copper.base,
    backgroundColor: 'rgba(195, 118, 99, 0.15)',
  },
  segmentInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    maxWidth: '100%',
  },
  segmentText: {
    color: colors.gray[500],
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  segmentTextActive: {
    color: colors.copper.base,
  },
});
