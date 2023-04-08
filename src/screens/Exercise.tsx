import { TouchableOpacity } from "react-native";
import {
  HStack,
  Heading,
  Icon,
  Image,
  ScrollView,
  Text,
  VStack,
} from "native-base";

import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { Button } from "@components/Button";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepsSvg from "@assets/repetitions.svg";

export function Exercise() {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <VStack flex={1}>
      <VStack px={8} pt={12} pb={8} bg="gray.600">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>
        <HStack mt={4} justifyContent="space-between" alignItems="center">
          <Heading color="gray.100" fontSize="lg" flexShrink={1}>
            Puxada frontal
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack p={6}>
          <Image
            source={{
              uri: "https://www.feitodeiridium.com.br/wp-content/uploads/2016/07/remada-unilateral.jpg",
            }}
            alt="Nome do exercicio"
            resizeMode="cover"
            w="full"
            h={80}
            mb={3}
            rounded="lg"
          />

          <VStack bg="gray.600" rounded="md" p={4} mt={12}>
            <HStack alignItems="center" justifyContent="space-around" mb={6}>
              <HStack>
                <SeriesSvg />
                <Text color="gray.200" ml={2}>
                  3 séries
                </Text>
              </HStack>
              <HStack>
                <RepsSvg />
                <Text color="gray.200" ml={2}>
                  3 séries
                </Text>
              </HStack>
            </HStack>
            <Button title="Marcar como concluído" />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
