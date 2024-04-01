import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';

export function DarkThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="lg"
        variant="light"
      >
        {colorScheme === 'dark' ? (
          <IconSun />
        ) : (
          <IconMoonStars />
        )}
      </ActionIcon>
  );
}
