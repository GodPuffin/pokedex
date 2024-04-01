import { ActionIcon, Burger, Button, Drawer, Group, Stack, useMantineColorScheme } from '@mantine/core';
import { IconArrowRight, IconBrandGithub, IconMoonStars, IconSun, IconWorld } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { DarkThemeToggle } from './DarkThemeToggle';

export function Links() {
    const [drawerOpened, setDrawerOpened] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group gap="xs">
        {!isMobile ? (
            <>
            <DarkThemeToggle />
            <ActionIcon
              component="a"
              href="https://github.com/GodPuffin"
              variant="light"
              size="lg"
            >
                <IconBrandGithub />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://web-puffinprojects.vercel.app/"
              variant="light"
              size="lg"
            >
                <IconWorld />
            </ActionIcon>
            </>
        ) : (
            <>
        <Burger
          opened={drawerOpened}
          size="lg"
          onClick={() => setDrawerOpened((o) => !o)}
            />
            <Drawer
              opened={drawerOpened}
              onClose={() => setDrawerOpened(false)}
              padding="xl"
              size="sm"
            >
                <Stack gap="md">
                    <Button
                      variant="light"
                      size="lg"
                      onClick={() => toggleColorScheme()}
                      leftSection={colorScheme === 'dark' ? <IconSun size={24} /> : <IconMoonStars size={24} />}
                    >
                        Toggle theme
                    </Button>
                    <Button
                      variant="light"
                      size="lg"
                      component="a"
                      href="https://github.com/GodPuffin"
                      leftSection={<IconBrandGithub size={24} />}
                      rightSection={<IconArrowRight size={24} />}
                    >
                        Github
                    </Button>
                    <Button
                      variant="light"
                      size="lg"
                      component="a"
                      href="https://web-puffinprojects.vercel.app/"
                      leftSection={<IconWorld size={24} />}
                      rightSection={<IconArrowRight size={24} />}
                    >
                        Website
                    </Button>
                </Stack>
            </Drawer>
            </>
        )}
    </Group>
    );
}
