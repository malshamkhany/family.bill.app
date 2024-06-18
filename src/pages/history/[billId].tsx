import { useRouter } from "next/router";
import Home from "..";

export default function BillDetail() {
  const router = useRouter();
  return <Home billId={router.query.billId as string} />;
}
