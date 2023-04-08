import { Avatar, IAvatarProps } from "native-base";
type Props = IAvatarProps & {
  size: number;
};
export function UserAvatar({ size, ...rest }: Props) {
  return (
    <Avatar
      w={size}
      h={size}
      borderColor="gray.400"
      borderWidth={1}
      {...rest}
    />
  );
}
