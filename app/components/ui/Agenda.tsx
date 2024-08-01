import {
  Agenda as AgendaComponent,
  type AgendaProps,
} from "react-native-calendars";

export function Agenda(props: AgendaProps) {
  return <AgendaComponent {...props} />;
}
