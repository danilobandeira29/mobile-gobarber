import React, { useRef, useCallback } from 'react';
import {
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container,
  Header,
  HeaderTitle,
  ReturnButton,
  LogoutButton,
  Content,
  ProfileContent,
  UserAvatar,
  ChangeAvatarButton,
} from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um E-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('Nova senha necessária', {
            is: true,
            then: Yup.string().required('Nova senha obrigatória'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().oneOf([
            Yup.ref('password'),
            'Confirmação errada',
          ]),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/users', data);

        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer login na aplicação.',
        );

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          console.log(errors);
          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro ao cadastrar',
          'Ocorreu um erro no cadastro, tente novamente',
        );
      }
    },
    [navigation],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      enabled
    >
      <Container>
        <Header>
          <ReturnButton onPress={handleGoBack}>
            <Icon name="arrow-left" size={24} color="#999591" />
          </ReturnButton>
          <HeaderTitle>Meu Perfil</HeaderTitle>
          <LogoutButton>
            <Icon name="power" size={24} color="#999591" />
          </LogoutButton>
        </Header>

        <Content>
          <ProfileContent>
            <UserAvatar source={{ uri: user.avatar_url }} />
            <ChangeAvatarButton>
              <Icon name="camera" size={20} color="#312E38" />
            </ChangeAvatarButton>
          </ProfileContent>
          <Form ref={formRef} onSubmit={handleSignUp} style={{ width: '100%' }}>
            <Input
              name="name"
              icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
              autoCapitalize="words"
            />
            <Input
              ref={emailInputRef}
              name="email"
              icon="mail"
              placeholder="E-mail"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => {
                oldPasswordInputRef.current?.focus();
              }}
            />
            <Input
              ref={oldPasswordInputRef}
              name="old_password"
              icon="lock"
              placeholder="Senha atual"
              containerStyle={{ marginTop: 16 }}
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />
            <Input
              ref={passwordInputRef}
              name="password"
              icon="lock"
              placeholder="Nova senha"
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordConfirmationInputRef.current?.focus();
              }}
            />
            <Input
              ref={passwordConfirmationInputRef}
              name="password_confirmation"
              containerStyle={{ marginBottom: 32 }}
              icon="lock"
              placeholder="Confirmar senha"
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
            />
            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Confirmar mudanças
            </Button>
          </Form>
        </Content>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default Profile;
