import { useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from "native-base";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserAvatar } from "@components/UserAvatar";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

const AVATAR_SIZE = 33;

export function Profile() {
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState(
    "https://github.com/Gleitonk.png"
  );

  const toast = useToast();

  async function handleUserPhotoSelect() {
    try {
      setIsAvatarLoading(true);
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (image.canceled) {
        return;
      }

      const imageUri = image.assets[0].uri;

      if (!imageUri) {
        return;
      }

      const imageInfo = await FileSystem.getInfoAsync(imageUri);

      // @ts-ignore
      if (imageInfo.size && imageInfo.size / 1024 / 1024 > 5) {
        return toast.show({
          title: "Ops! Essa imagem é muito grande.",
          placement: "top",
          bgColor: "error.500",
        });
      }

      setUserAvatar(imageUri);
    } catch (error) {
      console.log(error);
    } finally {
      setIsAvatarLoading(false);
    }
  }

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
                uri: userAvatar,
              }}
              size={AVATAR_SIZE}
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
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
          <Heading color="gray.200" fontSize="md"  fontFamily="heading" mb={2}>
            Alterar senha
          </Heading>
          <Input bg="gray.600" placeholder="Senha antiga" secureTextEntry />
          <Input bg="gray.600" placeholder="Nova senha" secureTextEntry />
          <Input
            bg="gray.600"
            placeholder="Confirmar nova senha"
            secureTextEntry
          />
          <Button title="Atualizar senha" mt={4} />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
