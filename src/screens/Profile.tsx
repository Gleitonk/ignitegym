import { useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
} from "native-base";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserAvatar } from "@components/UserAvatar";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

const AVATAR_SIZE = 33;

export function Profile() {
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil " />

      <ScrollView px={10}>
        <Center mt={6}>
          {isAvatarLoading ? (
            <Skeleton
              w={AVATAR_SIZE}
              h={AVATAR_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserAvatar
              source={{
                uri: "https://github.com/Gleitonk.png",
              }}
              size={AVATAR_SIZE}
            />
          )}

          <TouchableOpacity>
            <Text
              color="green.500"
              fontSize="md"
              fontWeight="bold"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input bg="gray.600" placeholder="Nome" />
          <Input bg="gray.600" placeholder="E-mail" isDisabled />
        </Center>

        <VStack mt={12} pb={10}>
          <Heading color="gray.200" fontSize="md" mb={2}>
            Alterar senha
          </Heading>
          <Input bg="gray.600" placeholder="Senha antiga" secureTextEntry />
          <Input bg="gray.600" placeholder="Nova senha" secureTextEntry />
          <Input
            bg="gray.600"
            placeholder="Confirmar nova senha"
            secureTextEntry
          />
          <Button title="Atualizar senha" mt={4}/>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
