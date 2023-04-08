import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@hooks/useAuth";

import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "native-base";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { api } from "@services/api";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

import LogoSvg from "@assets/logo.svg";
import BackgroundImg from "@assets/background.png";
import { AppError } from "@utils/AppError";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const signUpSchema = yup.object<FormDataProps>({
  name: yup.string().required("Informe o nome."),
  email: yup.string().required("Informe o e-mail.").email("E-mail invalído."),
  password: yup
    .string()
    .required("Informe a senha.")
    .min(7, "A senha deve ter pelo menos 7 digitos."),
  password_confirmation: yup
    .string()
    .required("Confirme a senha.")
    .oneOf([yup.ref("password")], "Confirmação de senha não confere."),
});

export function SignUp() {
  const { signIn } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({ resolver: yupResolver(signUpSchema) });

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true);
      await api.post("/users", {
        name,
        email,
        password,
      });

      signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível criar sua conta. Tente novamente mais tarde.";
      toast.show({ title, bg: "red.500", placement: "top" });
      setIsLoading(false);
    }
  }

  const navigation = useNavigation();

  function handleGoToSingIn() {
    navigation.goBack();
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg="gray.700" px={10}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />
        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" fontFamily="heading" mb={6}>
            Crie sua conta
          </Heading>
        </Center>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nome"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Senha"
              secureTextEntry
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password_confirmation"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Confirmar senha"
              secureTextEntry
              onChangeText={onChange}
              value={value}
              returnKeyType="send"
              onSubmitEditing={handleSubmit(handleSignUp)}
              errorMessage={errors.password_confirmation?.message}
            />
          )}
        />

        <Button
          title="Criar e acessar"
          onPress={handleSubmit(handleSignUp)}
          isLoading={isLoading}
        />

        <Button
          onPress={handleGoToSingIn}
          title="Voltar para login"
          variant="outline"
          mt={24}
        />
      </VStack>
    </ScrollView>
  );
}
