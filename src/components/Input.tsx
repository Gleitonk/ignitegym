import { IInputProps, Input as NativeBaseInput } from "native-base";

type Props = IInputProps & {};

export function Input({ ...rest }: Props) {
  return (
    <NativeBaseInput
      bg="gray.700"
      h={14}
      px={4}
      mb={4}
      borderWidth={0}
      fontSize="md"
      fontFamily="heading"
      color="white"
      placeholderTextColor="gray.300"
      _focus={{
        bg: "gray.700",
        borderWidth: 1,
        borderColor: "green.500",
      }}
      {...rest}
    />
  );
}
