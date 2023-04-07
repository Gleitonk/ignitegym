import { Center, Spinner } from "native-base";

export function Loading() {
  return (
    <Center flex={1} bg="gray.700">
      <Spinner size="lg" color="gray.500"/>
    </Center>
  );
}
