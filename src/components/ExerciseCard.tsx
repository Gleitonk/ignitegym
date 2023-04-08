import { HStack, Heading, Icon, Image, Text, VStack } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Entypo } from "@expo/vector-icons";

type Props = TouchableOpacityProps & {};

export function ExerciseCard({ ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="gray.500"
        alignItems="center"
        p={2}
        pr={4}
        mb={4}
        rounded="md"
      >
        <Image
          source={{
            uri: "https://www.feitodeiridium.com.br/wp-content/uploads/2016/07/remada-unilateral.jpg",
          }}
          resizeMode="cover"
          alt="Imagem do exerccício"
          w={16}
          h={16}
          rounded="md"
          mr={4}
        />
        <VStack flex={1}>
          <Heading fontSize="lg" color="white">
            Remada unilateral
          </Heading>
          <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
            3 séries x 12 repetições
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-right" color="gray.300" size={6}/>
      </HStack>
    </TouchableOpacity>
  );
}
