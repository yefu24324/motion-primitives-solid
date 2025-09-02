import { useNavigate } from "@solidjs/router";

export default function Home() {
  const navigate = useNavigate();
  navigate("/docs/introduction");
  return null;
}
