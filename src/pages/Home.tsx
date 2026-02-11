import Alert from "@/assets/alert.svg";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="text-xl font-bold">HOME</div>
      <Alert />
      <Link to="/index">Index</Link>
      <Link to="/Login">Login</Link>
    </>
  );
}
