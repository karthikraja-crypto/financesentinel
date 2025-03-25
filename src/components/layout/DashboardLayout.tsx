import React, { useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface NavLinkProps {
  children: React.ReactNode;
  to: string;
}

const NavLink: React.FC<NavLinkProps> = ({ children, to }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    to={to}
  >
    {children}
  </Link>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface UserProfileProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onClose }) => {
  return (
    <Box
      p={4}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="md"
      boxShadow="md"
    >
      <HStack spacing={4}>
        <Avatar name={user.name} src="" />
        <Box>
          <p fontWeight="bold">{user.name}</p>
          <p fontSize="sm" color="gray.500">{user.email}</p>
        </Box>
      </HStack>
      <MenuDivider my={3} />
      <Button colorScheme="red" onClick={onLogout} w="100%">
        Logout
      </Button>
      <Button mt={3} onClick={onClose} w="100%">
        Close
      </Button>
    </Box>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', to: '/' },
    { label: 'Transactions', to: '/transactions' },
    { label: 'Analytics', to: '/analytics' },
    { label: 'Flexible Parameters', to: '/flexible-parameters' },
    { label: 'Alerts', to: '/alerts' },
    { label: 'Flagged Transactions', to: '/flagged-transactions' },
    { label: 'Settings', to: '/settings' },
  ];

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Box px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box fontWeight="bold">Finance Sentinel</Box>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {navItems.map((link) => (
                <NavLink key={link.label} to={link.to}>{link.label}</NavLink>
              ))}
            </HStack>
          </HStack>
          
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: 'none' }}
                onClick={() => setShowUserProfile(true)}
              >
                <HStack>
                  <Avatar
                    size={'sm'}
                    name={user?.name}
                    src={''}
                  />
                  <Box display={{ base: 'none', md: 'flex' }} alignItems={'center'}>
                    <p fontSize={'sm'} fontWeight={'bold'}>
                      {user?.name}
                    </p>
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList alignItems={'center'} right={0}>
                <MenuItem>View Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {navItems.map((link) => (
              <NavLink key={link.label} to={link.to}>{link.label}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}

      <Box p={4}>
        {children}
      </Box>
      
      {showUserProfile && user && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="10"
        >
          <UserProfile 
            user={user}
            onLogout={handleLogout}
            onClose={() => setShowUserProfile(false)} 
          />
        </Box>
      )}
    </Box>
  );
}

export default DashboardLayout;
