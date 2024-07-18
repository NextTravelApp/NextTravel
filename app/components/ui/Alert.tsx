import { useEffect, useState } from "react";
import { Dialog, Portal } from "react-native-paper";
import { Button, Text } from "../injector";

export type AlertProps = {
  title: string;
  message?: string;
  onDismiss?: () => void;
};

export function Alert(props: AlertProps) {
  const [open, setOpen] = useState(!!props.message);

  useEffect(() => {
    setOpen(!!props.message);
  }, [props.message]);

  return (
    <Portal>
      <Dialog visible={open} onDismiss={props.onDismiss}>
        <Dialog.Title>{props.title}</Dialog.Title>
        <Dialog.Content>
          <Text>{props.message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button className="px-4" mode="contained" onPress={props.onDismiss}>
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
