import styled from 'styled-components/native';
import { Platform } from 'react-native';
import {
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${Platform.OS === 'ios' ? getStatusBarHeight() + 24 : 24}px 24px 24px;
  background: #28262e;
`;

export const GoBackButton = styled.TouchableOpacity``;
export const SignOutButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  font-size: 20px;
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
`;

const paddingScrollView = Platform.OS === 'ios' ? getBottomSpace() + 24 : 24;

export const Content = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingBottom: paddingScrollView,
  },
})`
  flex: 1;
  padding: 10px 24px 0;
`;

export const ProfileContent = styled.View`
  width: 186px;
  align-self: center;
  align-items: flex-end;
  margin-bottom: 32px;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 93px;
  align-self: center;
`;

export const ChangeAvatarButton = styled(RectButton)`
  background: #ff9000;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-top: -50px;
`;
