import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import Image from 'next/image'

import { Flex, Text, Button, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Header = () => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Flex justifyContent="space-between" alignItems="center" height="10vh" width="100%" p="2rem" style={{ margin: 10 }}>
            {!isOpen ? (
                <>
                    <Flex alignItems="center">
                        <Text fontWeight="bold">Shambles</Text>
                        <Image src="/law.jpg" alt="logo" width={40} height={40} style={{ margin: 10 }} display={{ base: 'none', md: 'block' }} />
                    </Flex>
                    <Button
                        display={{ base: 'block', md: 'none' }}
                        onClick={onToggle}
                        variant="ghost"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    </Button></>) : (<Button
                        display={{ base: 'block', md: 'none' }}
                        onClick={onToggle}
                        variant="ghost"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    </Button>)
            }

            <Flex width="30%" justifyContent="space-between" alignItems="center" display={{ base: 'none', md: 'flex' }}>
                <Text><Link href="/" style={{ margin: 10 }}>Home</Link></Text>
                <Text><Link href="/collection" style={{ margin: 10 }}>My Collection</Link></Text>
                <Text><Link href="/marketplace" style={{ margin: 10 }}>MarketPlace</Link></Text>
            </Flex>
            {isOpen && (
                <Flex
                    flexDirection="column"
                    position="absolute"
                    top="58px"
                    right="10px"
                    bg="white"
                    p="2"
                    boxShadow="md"
                    zIndex="1"
                >
                    <Text><Link href="/" style={{ margin: 10 }}>Home</Link></Text>
                    <Text><Link href="/collection" style={{ margin: 10 }}>My Collection</Link></Text>
                    <Text><Link href="/marketplace" style={{ margin: 10 }}>MarketPlace</Link></Text>
                </Flex>
            )}
            <ConnectButton />
        </Flex>
    );
}

export default Header;

