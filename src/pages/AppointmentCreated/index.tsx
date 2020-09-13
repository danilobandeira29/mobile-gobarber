import React, { useMemo, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { params } = useRoute();
  const routeParams = params as RouteParams;

  const { reset } = useNavigation();

  const handleOkPressed = useCallback(() => {
    reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  }, [reset]);

  const formattedDate = useMemo(() => {
    const date = new Date(routeParams.date);
    return format(date, "EEEE ', de' dd 'de' MMMM 'de' yyyy 'às' HH:mm 'h'", {
      locale: ptBR,
    });
  }, [routeParams.date]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04D361" />
      <Title>Agendamento concluído</Title>
      <Description>{formattedDate}</Description>
      <OkButton onPress={handleOkPressed}>
        <OkButtonText>OK</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
