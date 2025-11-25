import { Link } from "next-view-transitions";
import { Button } from "../ui/button";

export default function OrderDetailButton({
  orderId,
}: {
    orderId: string;
}) {
    return (
        <div className="text-right">
          <Link href={`/dashboard/orders/${orderId}`}>
            <Button variant="secondary" size="sm">Ver Pedido</Button>
          </Link>
        </div>
    );
}