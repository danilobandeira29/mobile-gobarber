import React, { useRef, useCallback } from 'react';
import {
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
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
  GoBackButton,
  SignOutButton,
  Content,
  ProfileContent,
  UserAvatar,
  ChangeAvatarButton,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, signOut, updateUser } = useAuth();

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const handleUpdateProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um E-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password')], 'Confirmação obrigátoria'),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          email,
          name,
          password,
          old_password,
          password_confirmation,
        } = data;

        const formData = {
          email,
          name,
          ...(old_password
            ? { password, old_password, password_confirmation }
            : {}),
        };

        const response = await api.put('/profile', formData);

        await updateUser(response.data);

        Alert.alert('Perfil alterado!');

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro ao atualização do perfil',
          'Ocorreu um erro na alteração de perfil, tente novamente',
        );
      }
    },
    [navigation],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione uma foto',
        cancelButtonTitle: 'Cancelar',
        chooseFromLibraryButtonTitle: 'Selecionar da galeria',
        takePhotoButtonTitle: 'Usar câmera',
      },
      response => {
        if (response.error) {
          Alert.alert('Erro ao atualizar avatar');
          return;
        }
        if (response.didCancel) {
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        });

        api.patch('/users/avatar', data).then(resp => updateUser(resp.data));
      },
    );
  }, [user.id, updateUser]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      enabled
    >
      <Container>
        <Header>
          <GoBackButton onPress={handleGoBack}>
            <Icon name="arrow-left" size={24} color="#999591" />
          </GoBackButton>
          <HeaderTitle>Meu Perfil</HeaderTitle>
          <SignOutButton onPress={handleSignOut}>
            <Icon name="power" size={24} color="#999591" />
          </SignOutButton>
        </Header>

        <Content>
          <ProfileContent>
            <UserAvatar source={{ uri: user.avatar_url }} />
            <ChangeAvatarButton onPress={handleUpdateAvatar}>
              <Icon name="camera" size={20} color="#312E38" />
            </ChangeAvatarButton>
          </ProfileContent>
          <Form
            initialData={{ name: user.name, email: user.email }}
            ref={formRef}
            onSubmit={handleUpdateProfile}
            style={{ width: '100%' }}
          >
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
