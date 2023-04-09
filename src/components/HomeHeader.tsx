import { TouchableOpacity } from "react-native";
import { HStack, Heading, Icon, Text, VStack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

import { useAuth } from "@hooks/useAuth";

import { UserAvatar } from "@components/UserAvatar";
import defaultUserAvatar from "@assets/userAvatarDefault.png";

import { api } from "@services/api";


export function HomeHeader() {
  const { user, signOut } = useAuth();

  return (
    <HStack bg="gray.500" pt={16} pb={5} px={8} alignItems="center">
      <UserAvatar
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : defaultUserAvatar
        }
        size={16}
        mr={4}
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá,
        </Text>
        <Heading color="gray.100" fontSize="md" fontFamily="heading">
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity>
        <Icon
          as={MaterialIcons}
          name="logout"
          color="gray.200"
          size={7}
          onPress={signOut}
        />
      </TouchableOpacity>
    </HStack>
  );
}
