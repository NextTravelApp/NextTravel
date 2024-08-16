import { useState } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { Dialog, Portal } from "react-native-paper";
import { i18n } from "../i18n";
import { Button, TextInput } from "../injector";

export function InviteMember({
  open,
  onClose,
  onInvite,
}: {
  open: boolean;
  onClose: () => void;
  onInvite: (email: string) => void;
}) {
  const [email, setEmail] = useState("");

  return (
    <Portal>
      <TouchableWithoutFeedback
        onPress={() => {
          if (Platform.OS !== "web") Keyboard.dismiss();
        }}
      >
        <Dialog visible={open} onDismiss={onClose}>
          <Dialog.Title>{i18n.t("plan.checkout.invite")}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              keyboardType="email-address"
              placeholder="Email"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              className="px-4"
              mode="contained"
              onPress={() => {
                onInvite(email);
                onClose();
              }}
            >
              {i18n.t("plan.checkout.invite")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </TouchableWithoutFeedback>
    </Portal>
  );
}
