import { useEffect, useState } from "react";
import { SectionList } from "react-native";
import { Heading, Text, VStack, useToast } from "native-base";

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";
import { useFocusEffect } from "@react-navigation/native";

export function History() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  async function fetchHistory() {
    try {
      setIsLoading(true);
      const response = await api.get<HistoryByDayDTO[]>("/history");
      setExercises(response.data);
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

  useFocusEffect(() => {
    fetchHistory();
  });

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <HistoryCard data={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Heading
            color="gray.200"
            fontSize="md"
            fontFamily="heading"
            mt={10}
            mb={3}
          >
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
