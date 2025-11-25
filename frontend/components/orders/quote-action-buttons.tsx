"use client";

import { Button } from "@/components/ui/button";
import { Download, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getFilenameFromContentDisposition } from "@/lib/utils";

export function QuoteActionButtons({
  orderId,
  customerEmail,
}: Readonly<{
  orderId: string | number;
  customerEmail?: string;
}>) {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

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
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar PDF');
    } finally {
      setSendLoading(false);
    }
  };

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
