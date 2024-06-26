import Head from 'next/head';
import Image from 'next/image';
import styled from '@emotion/styled';
import Link from 'next/link';
import { SHeaderWrapper } from '@/components/common/Header';
import useSnackBar from '@/hooks/useSnackBar';

export default function ChallengeHeader({
  groupTitle,
  thumbnail,
}: {
  groupTitle: string;
  thumbnail: string;
}) {
  const { openSnackBar } = useSnackBar();
  const copyUrl = () => {
    const currentUrl = window.location.href.split('#')[0];
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        openSnackBar('링크가 복사되었습니다.', 'correct');
      },
      (error) => {
        console.error('URL 복사 실패', error);
      },
    );
  };

  return (
    <>
      <Head>
        <title>{`WAVED | ${groupTitle}`}</title>
        <meta
          name="description"
          content={`${groupTitle} 에 대한 상세 정보를 볼 수 있는 페이지입니다.`}
        />
        <meta property="og:image" content={thumbnail} />
      </Head>
      <SHeaderWrapper>
        <SGoHomeLink href="/home" aria-label="홈으로 이동">
          <Image
            src="/icons/icon-waved.svg"
            alt="WAVED 로고"
            width={90}
            height={20}
          />
        </SGoHomeLink>
        <SShareBtn
          type="button"
          onClick={copyUrl}
          aria-label="현재 페이지 URL 복사하기"
        />
      </SHeaderWrapper>
    </>
  );
}

const SGoHomeLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 20px;
  margin-left: 20px;
`;

const SShareBtn = styled.button`
  position: absolute;
  right: 0;
  margin-right: 1.25rem;
  display: inline-block;
  width: 24px;
  height: 24px;
  background: url('/icons/icon-share.svg') no-repeat center;
`;
