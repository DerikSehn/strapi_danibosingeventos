"use client";

import { Button } from "@/components/ui/button";
import { Download, Mail, Loader2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getFilenameFromContentDisposition } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function QuoteActionButtons({
  orderId,
  customerEmail,
  layout = "default",
}: Readonly<{
  orderId: string | number;
  customerEmail?: string;
  layout?: "default" | "mobile";
}>) {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setDownloadLoading(true);
      const response = await fetch(
        `/api/orders/${orderId}/download-pdf`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error('Falha ao baixar PDF');
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = getFilenameFromContentDisposition(contentDisposition) || `orcamento-${orderId}.pdf`;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF baixado com sucesso!');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao baixar PDF');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleSendPDF = async () => {
    if (!customerEmail) {
      toast.error('Email do cliente não informado');
      return;
    }

    try {
      setSendLoading(true);
      const response = await fetch(
        `/api/orders/${orderId}/send-pdf`,
        { method: 'POST' }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Falha ao enviar PDF');
      }

      const data = await response.json();
      toast.success(data.message || 'PDF enviado com sucesso!');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar PDF');
    } finally {
      setSendLoading(false);
    }
  };

  if (layout === "mobile") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="h-full w-full flex items-center justify-center">
            <MoreVertical className="h-5 w-5 text-white" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ações do Pedido</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button
              onClick={handleDownloadPDF}
              disabled={downloadLoading}
              variant="outline"
              className="w-full justify-start h-12 text-lg"
            >
              {downloadLoading ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <Download className="w-5 h-5 mr-3" />
              )}
              Baixar PDF
            </Button>

            <Button
              onClick={handleSendPDF}
              disabled={sendLoading || !customerEmail}
              variant="outline"
              className="w-full justify-start h-12 text-lg"
            >
              {sendLoading ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <Mail className="w-5 h-5 mr-3" />
              )}
              Enviar por Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleDownloadPDF}
        disabled={downloadLoading}
        variant="outline"
        size="sm"
        title="Baixar PDF do orçamento"
      >
        {downloadLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Baixando...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </>
        )}
      </Button>

      <Button
        onClick={handleSendPDF}
        disabled={sendLoading || !customerEmail}
        size="sm"
        title={customerEmail ? 'Enviar PDF por email' : 'Email do cliente não informado'}
      >
        {sendLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            Enviar PDF
          </>
        )}
      </Button>
    </div>
  );
}
