import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import Layout from '@/components/common/Layout';
import WriteLayout, { TPageType } from '@/components/common/WriteLayout';
import writeLayoutText from '@/constants/writeLayoutText';
import PhotoInput from '@/components/verification/post/PhotoInput';
import TextArea from '@/components/common/TextArea';
import Modal from '@/components/modal/Modal';
import LinkInput from '@/components/verification/post/LinkInput';
import VERIFICATION_TYPE from '@/constants/verificationType';
import { TVerificationType } from '@/types/verification';
import {
  getQuizApi,
  postMyVerificationApi,
} from '@/lib/axios/verification/post/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import useSnackBar from '@/hooks/useSnackBar';
import SnackBar from '@/components/common/SnackBar';

export default function VerificationPost() {
  const router = useRouter();
  let verificationType: TVerificationType;
  if (
    typeof router.query.type === 'string' &&
    ['TEXT', 'PICTURE', 'LINK'].includes(router.query.type)
  ) {
    verificationType = router.query.type as TVerificationType;
  } else {
    verificationType = 'TEXT';
  }
  const challengeGroupId = router.query.challengeGroupId as string;
  const myChallengeId = router.query.myChallengeId as string;
  const pageType = VERIFICATION_TYPE[verificationType];
  const { placeholder } = writeLayoutText[pageType];
  const [text, setText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string>('');
  const [isLinkValid, setIsLinkaValid] = useState<boolean | undefined>(
    undefined,
  );
  const [quiz, setQuiz] = useState<string>('문제를 불러오고 있습니다.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { snackBarData, openSnackBar } = useSnackBar();

  const postMyVerification = async () => {
    const formData = new FormData();
    if (verificationType === 'LINK') {
      formData.append('content', text);
      formData.append('link', link);
    } else if (verificationType === 'PICTURE' && file) {
      formData.append('imageUrl', file);
    } else if (verificationType === 'TEXT') {
      formData.append('content', text);
    }

    try {
      const response = await postMyVerificationApi(challengeGroupId, formData);
      if (response) {
        navigateToCollection({ successSubmission: true });
      }
    } catch (error) {
      const err = error as AxiosError;
      const status = err.response?.status;
      const statusText = err.response?.statusText;
      if (status === 403 && statusText === 'Forbidden') {
        navigateToCollection({ duplicateSubmission: true });
      }
      setIsLoading(false);
    }
  };

  const navigateToCollection = (queryParam: {
    [key: string]: boolean;
  }): void => {
    router
      .replace({
        pathname: `/verification/collection/${challengeGroupId}`,
        query: {
          type: verificationType,
          myChallengeId,
          ...queryParam,
        },
      })
      .catch((error: Error) => {
        console.error('페이지 이동에 실패하였습니다.', error);
      });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    postMyVerification().catch((error) =>
      console.error('postMyVerification API 실패', error),
    );
  };

  useEffect(() => {
    if (verificationType === 'TEXT' && challengeGroupId !== undefined)
      getQuizApi(challengeGroupId)
        .then((data) => {
          setQuiz(data.question);
        })
        .catch((error) => {
          console.error('getQuiz API 실패', error);
          setQuiz('문제를 불러오는데 실패했습니다.');
          openSnackBar('문제를 불러오는데 실패했습니다.');
        });
  }, [verificationType, challengeGroupId, openSnackBar]);

  return (
    <Layout
      headerText="인증하기"
      title="인증하기"
      description="챌린지 인증방식에 맞게 인증을 진행하는 페이지입니다."
      noFooter
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <WriteLayout
          pageType={pageType as TPageType}
          text={text}
          file={file}
          isLinkValid={isLinkValid}
          onClick={handleSubmit}
        >
          {verificationType === 'TEXT' && (
            <>
              <SQuestion>Q.{quiz}</SQuestion>
              <TextArea placeholder={placeholder} setText={setText} />
            </>
          )}
          {verificationType === 'PICTURE' && <PhotoInput setFile={setFile} />}
          {verificationType === 'LINK' && (
            <>
              <LinkInput
                isLinkValid={isLinkValid}
                setIsLinkValid={setIsLinkaValid}
                setLink={setLink}
              />
              <TextArea placeholder={placeholder} setText={setText} />
            </>
          )}
        </WriteLayout>
      )}
      {snackBarData.open && (
        <SnackBar text={snackBarData.text} type={snackBarData.type} noFooter />
      )}
      <Modal />
    </Layout>
  );
}

const SQuestion = styled.p`
  color: ${({ theme }) => theme.color.normal};
  font-size: ${({ theme }) => theme.fontSize.body4};
  font-weight: ${({ theme }) => theme.fontWeight.body4};
  line-height: 1.6;
  padding: 1rem;
  background-color: ${({ theme }) => theme.color.light};
  border-radius: 12px;
  margin-bottom: 1rem;
`;
