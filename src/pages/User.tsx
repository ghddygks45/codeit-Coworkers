import { useParams } from "react-router-dom";

// 동적라우트 예시
export default function User() {
  const { id } = useParams<{ id: string }>();

  return <div>User ID: {id}</div>;
}
