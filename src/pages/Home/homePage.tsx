interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
}

const posts: PostProps[] = [
  {
    id: "1",
    email: "ghwns107@naver.com",
    content: "내용입니다.",
    createdAt: "2023-12-23",
    uid: "testuid",
  },
];

export default function HomePage() {
  return <div>HomePage</div>;
}
