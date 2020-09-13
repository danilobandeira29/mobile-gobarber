import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

export const Title = styled.Text`
  font-size: 32px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  text-align: center;
  margin-top: 48px;
`;

export const Description = styled.Text`
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  font-size: 18px;
  text-align: center;
  margin-top: 16px;
`;

export const OkButton = styled(RectButton)`
  background: #ff9000;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-top: 24px;
  padding: 17px 40px;
`;

export const OkButtonText = styled.Text`
  color: #312e38;
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
`;
