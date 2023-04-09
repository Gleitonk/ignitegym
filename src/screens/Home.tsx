import { useCallback, useEffect, useState } from "react";
import { FlatList, HStack, Heading, Text, VStack, useToast } from "native-base";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

export function Home() {
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("costas");

  const [isLoading, setIsLoading] = useState(true);

  async function fetchGroups() {
    try {
      setIsLoading(true);
      const response = await api.get<string[]>("/groups");
      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar grupos.";

      toast.show({ title, bg: "error.500", placement: "top" });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchExercisesByGroup() {
    try {
      const response = await api.get<ExerciseDTO[]>(
        `/exercises/bygroup/${selectedGroup}`
      );
      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar exercícios.";

      toast.show({ title, bg: "error.500", placement: "top" });
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup();
    }, [selectedGroup])
  );

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate("exercise", { exerciseId});
  }
  return (
    <VStack flex={1}>
      <HomeHeader />
      <HStack>
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Group
              name={item}
              isActive={
                selectedGroup.toLocaleUpperCase() === item.toLocaleUpperCase()
              }
              onPress={() => setSelectedGroup(item)}
            />
          )}
          _contentContainerStyle={{ px: 6 }}
          my={4}
          minH={10}
          maxH={10}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </HStack>

      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={6}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercicíos
            </Heading>
            <Text color="gray.200" fontSize="sm">
              {exercises?.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ExerciseCard
                data={item}
                onPress={() => handleOpenExerciseDetails(item.id.toString())}
              />
            )}
            _contentContainerStyle={{ pb: 20 }}
            showsVerticalScrollIndicator={false}
          />
        </VStack>
      )}
    </VStack>
  );
}
