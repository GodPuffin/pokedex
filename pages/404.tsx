import { Button, Center, Group, Stack, Text, Image, Title } from '@mantine/core';
import NextImage from 'next/image';
import Link from 'next/link';
import { DarkThemeToggle } from '@/components/DarkThemeToggle';

const PageNotFound = () => (
        <Center>
            <Stack align="center">
            <Title order={2} mt="xl"><Text span c="blue" inherit>404</Text> | Page not found</Title>
            <Image
              component={NextImage}
              src="/404.gif"
              alt="Squirtle crying"
              radius="md"
              width={400}
              height={400}
              unoptimized
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
