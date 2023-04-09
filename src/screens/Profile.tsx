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

import { useAuth } from "@hooks/useAuth";

import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { UserAvatar } from "@components/UserAvatar";
import { ScreenHeader } from "@components/ScreenHeader";

import defaultUserAvatar from "@assets/userAvatarDefault.png";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";

const AVATAR_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

const profileFormSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  old_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .when("password", {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required("Informe a senha antiga.")
          .transform((value) => (!!value ? value : null)),
    }),
  password: yup
    .string()
    .min(7, "A senha deve conter no minímo 7 digitos.")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Confirmação de senha não confere.")
    .nullable()
    .transform((value) => (!!value ? value : null))
    .when("password", {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required("Informe a confirmação de senha")
          .transform((value) => (!!value ? value : null)),
    }),
});

export function Profile() {
  const toast = useToast();

  const { user, updateUserProfile } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);

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

      const fileExtension = imageUri.split(".").pop();

      const imageFile = {
        name: `${user.name}.${fileExtension}`.toLowerCase(),
        uri: imageUri,
        type: `${image.assets[0].type}/${fileExtension}`,
      } as any;

      const userImageUploadForm = new FormData();
      userImageUploadForm.append("avatar", imageFile);

      const avatarUpdatedResponse = await api.patch(
        "/users/avatar",
        userImageUploadForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const userUpdated = user;
      userUpdated.avatar = avatarUpdatedResponse.data.avatar;
      updateUserProfile(userUpdated);

      toast.show({
        title: "Foto atualizada!.",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsAvatarLoading(false);
    }
  }

  async function handleUpdateProfile(data: FormDataProps) {
    try {
      setIsUpdating(true);
      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put("/users", data);
      await updateUserProfile(userUpdated);

      toast.show({
        title: "Perfil atualizado!",
        bg: "green.500",
        placement: "top",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível atualizar dados. Tente novamente mais tarde.";
      toast.show({
        title,
        bg: "error.500",
        placement: "top",
      });
    } finally {
      setIsUpdating(false);
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
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : defaultUserAvatar
              }
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

          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Center>

        <VStack mt={12} pb={10}>
          <Heading color="gray.200" fontSize="md" fontFamily="heading" mb={2}>
            Alterar senha
          </Heading>
          <Controller
            name="old_password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.old_password?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            name="confirm_password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirmar nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />
          <Button
            title="Atualizar senha"
            mt={4}
            onPress={handleSubmit(handleUpdateProfile)}
            isLoading={isUpdating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
