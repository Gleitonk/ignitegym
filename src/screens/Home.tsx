import { useState } from "react";
import { FlatList, HStack, Heading, Text, VStack } from "native-base";

import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";

export function Home() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const [groups, setGroups] = useState([
    "Costas",
    "Ombro",
    "Bíceps",
    "Triceps",
  ]);

  const [exercises, setExercises] = useState([
    "1",
    "2",
    "3",
    "4",
    "5",
    "Costas",
    "Ombro",
    "Bíceps",
    "Triceps",
  ]);
  const [selectedGroup, setSelectedGroup] = useState("costas");

  function handleOpenExerciseDetails() {
    navigation.navigate("exercise");
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

      <VStack flex={1} px={6}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md">
            Exercicíos
          </Heading>
          <Text color="gray.200" fontSize="sm">
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <ExerciseCard onPress={handleOpenExerciseDetails} />
          )}
          _contentContainerStyle={{ pb: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </VStack>
    </VStack>
  );
}
