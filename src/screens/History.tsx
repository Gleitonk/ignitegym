import { useState } from "react";
import { SectionList } from "react-native";
import { Heading, Text, VStack } from "native-base";

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "26.08.22",
      data: ["Puxada frontal", "Remada unilateral"],
    },
    {
      title: "26.08.22",
      data: ["Puxada frontal", "Remada unilateral"],
    },
    {
      title: "26.08.22",
      data: ["Puxada frontal", "Remada unilateral"],
    },
    {
      title: "26.08.22",
      data: ["Puxada frontal", "Remada unilateral"],
    },
    {
      title: "26.08.22",
      data: ["Puxada frontal", "Remada unilateral"],
    },
  ]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section: { title } }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
            {title}
          </Heading>
        )}
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há exercícios registrados ainda.
          </Text>
        )}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 120,
          ...(exercises.length === 0 && { flex: 1, justifyContent: "center" }),
        }}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}
