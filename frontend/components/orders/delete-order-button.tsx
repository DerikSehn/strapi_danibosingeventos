'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteOrderMutation } from '@/lib/hooks/use-order-mutations';

interface DeleteOrderButtonProps {
  orderId: string;
  className?: string;
}

export function DeleteOrderButton({ orderId, className }: DeleteOrderButtonProps) {
  const deleteMutation = useDeleteOrderMutation();
  const isDeleting = deleteMutation.isPending;

  const handleDelete = (e: React.MouseEvent) => {
    // Prevent navigation if inside a link
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Tem certeza que deseja excluir este pedido?')) {
      return;
    }

    deleteMutation.mutate(orderId);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 ${className}`}
      onClick={handleDelete}
      disabled={isDeleting}
      title="Excluir pedido"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
