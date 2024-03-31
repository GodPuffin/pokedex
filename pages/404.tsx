import { Button, Center, Group, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { DarkThemeToggle } from '@/components/DarkThemeToggle';

const PageNotFound = () => (
        <Center>
            <Stack align="center">
            <Text size="xl" mt="xl">
                404 | Page Not Found
            </Text>
            <Image
              src="/404.gif"
              alt="Squirtle crying"
              width={400}
              height={400}
            />
            <Group>
                <Button
                  component={Link}
                  href="/"
                  variant="filled"
                  color="blue"
                  size="md"
                >
                    Go back home
                </Button>
                <DarkThemeToggle />
            </Group>
            </Stack>
        </Center>
    );

export default PageNotFound;
