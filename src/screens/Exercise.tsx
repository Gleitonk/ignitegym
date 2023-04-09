import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Box,
  HStack,
  Heading,
  Icon,
  Image,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "native-base";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { Button } from "@components/Button";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepsSvg from "@assets/repetitions.svg";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

type RouteParamsProps = {
  exerciseId: string;
};

export function Exercise() {
  const toast = useToast();

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { exerciseId } = route.params as RouteParamsProps;

  const [exerciseDetails, setExerciseDetails] = useState<ExerciseDTO>();

  const [isLoadingExercisesDetails, setIsLoadingExercisesDetails] =
    useState(true);
  const [isLoadingSaveHistory, setIsLoadingSaveHistory] = useState(false);

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleMarkExerciseAsDone() {
    try {
      setIsLoadingSaveHistory(true);

      await api.post("/history", { exercise_id: exerciseId });
      toast.show({
        title: "Exercício registrado!",
        bg: "success.500",
        placement: "top",
      });

      navigation.navigate("history");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar dados do exercícios.";

      toast.show({ title, bg: "error.500", placement: "top" });
    } finally {
      setIsLoadingSaveHistory(false);
    }
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoadingExercisesDetails(true);
      const response = await api.get<ExerciseDTO>(`/exercises/${exerciseId}`);
      setExerciseDetails(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar dados do exercícios.";

      toast.show({ title, bg: "error.500", placement: "top" });
    } finally {
      setIsLoadingExercisesDetails(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px={8} pt={12} pb={8} bg="gray.600">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>
        <HStack mt={4} justifyContent="space-between" alignItems="center">
          <Heading
            color="gray.100"
            fontSize="lg"
            fontFamily="heading"
            flexShrink={1}
          >
            {exerciseDetails?.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exerciseDetails?.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoadingExercisesDetails ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack p={6}>
            <Box rounded="lg" mb={3} overflow="hidden">
              <Image
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exerciseDetails?.demo}`,
                }}
                alt="Nome do exercicio"
                resizeMode="cover"
                w="full"
                h={96}
              />
            </Box>

            <VStack bg="gray.600" rounded="md" p={4} mt={12}>
              <HStack alignItems="center" justifyContent="space-around" mb={6}>
                <HStack>
                  <SeriesSvg />
                  <Text color="gray.200" ml={2}>
                    {exerciseDetails?.series} séries
                  </Text>
                </HStack>
                <HStack>
                  <RepsSvg />
                  <Text color="gray.200" ml={2}>
                    {exerciseDetails?.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>
              <Button
                title="Marcar como concluído"
                onPress={handleMarkExerciseAsDone}
                isLoading={isLoadingSaveHistory}
              />
            </VStack>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
}
