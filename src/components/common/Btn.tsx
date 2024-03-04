import styled from '@emotion/styled';
import { v4 as uuidv4 } from 'uuid';

interface IBtn {
  type?: 'button' | 'submit';
  text: string;
  isDisabled?: boolean;
  styleType: 'primary' | 'gray' | 'white' | 'white_line';
  size: 'large' | 'small';
}

interface IBtnWrapper {
  btns: IBtn[];
}

interface ISBtn {
  styleType: 'primary' | 'gray' | 'white' | 'white_line';
  size: 'large' | 'small';
}

export default function Btn({ btns }: IBtnWrapper) {
  return (
    <SBtnWrapper>
      {btns.map((btn) => (
        <SBtn
          key={uuidv4()}
          type={btn.type || 'button'}
          disabled={btn.isDisabled || undefined}
          styleType={btn.styleType}
          size={btn.size}
        >
          {btn.text}
        </SBtn>
      ))}
    </SBtnWrapper>
  );
}

export const SBtnWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const SBtn = styled.button<ISBtn>`
  width: 100%;
  height: ${({ size }) => (size === 'large' ? '48px' : '36px')};
  line-height: ${({ size }) => (size === 'large' ? '48px' : '36px')};
  background-color: ${({ styleType, theme }) =>
    ({
      primary: theme.color.normal,
      gray: theme.color.gray_ec,
      white: theme.color.white,
      white_line: theme.color.white,
    })[styleType]};
  color: ${({ styleType, theme }) =>
    ({
      primary: theme.color.white,
      gray: theme.color.gray_83,
      white: theme.color.gray_3c,
      white_line: theme.color.gray_3c,
    })[styleType]};
  border-radius: 8px;
  border: ${({ styleType, theme }) =>
    styleType === 'white_line' ? `1px solid ${theme.color.gray_de}` : 'none'};
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: 0.2s ease-in;

  &:hover,
  &:focus {
    background-color: ${({ styleType, theme }) =>
      ({
        primary: theme.color.dark,
        gray: theme.color.gary_bf,
        white: theme.color.gray_ec,
        white_line: theme.color.gray_ec,
      })[styleType]};
  }
`;
