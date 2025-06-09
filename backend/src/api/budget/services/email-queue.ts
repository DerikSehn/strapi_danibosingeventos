import { Core } from '@strapi/strapi';

interface EmailJob {
  id: string;
  type: 'budget' | 'order';
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  processedAt?: Date;
  error?: string;
  retryCount: number;
  maxRetries: number;
}

class EmailQueueService {
  private readonly strapi: Core.Strapi;
  private readonly jobs: Map<string, EmailJob> = new Map();
  private processing: boolean = false;

  constructor(strapi: Core.Strapi) {
    this.strapi = strapi;
    this.startProcessing();
  }

  /**
   * Adiciona um job de envio de email na fila
   */
  addBudgetEmailJob(data: any): string {
    const jobId = this.generateJobId();
    const job: EmailJob = {
      id: jobId,
      type: 'budget',
      data,
      status: 'pending',
      createdAt: new Date(),
      retryCount: 0,
      maxRetries: 3
    };

    this.jobs.set(jobId, job);
    this.strapi.log.info(`[Email Queue] Budget email job ${jobId} added to queue`);
    
    // Processa imediatamente se não estiver processando
    if (!this.processing) {
      setImmediate(() => this.processJobs());
    }
    
    return jobId;
  }

  /**
   * Adiciona um job de envio de email de pedido na fila
   */
  addOrderEmailJob(data: any): string {
    const jobId = this.generateJobId();
    const job: EmailJob = {
      id: jobId,
      type: 'order',
      data,
      status: 'pending',
      createdAt: new Date(),
      retryCount: 0,
      maxRetries: 3
    };

    this.jobs.set(jobId, job);
    this.strapi.log.info(`[Email Queue] Order email job ${jobId} added to queue`);
    
    // Processa imediatamente se não estiver processando
    if (!this.processing) {
      setImmediate(() => this.processJobs());
    }
    
    return jobId;
  }

  /**
   * Verifica o status de um job
   */
  getJobStatus(jobId: string): EmailJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Inicia o processamento contínuo da fila
   */
  private startProcessing() {
    // Processa jobs a cada 5 segundos
    setInterval(() => {
      if (!this.processing) {
        this.processJobs();
      }
    }, 5000);
  }

  /**
   * Processa todos os jobs pendentes
   */
  private async processJobs() {
    if (this.processing) return;

    this.processing = true;
    this.strapi.log.debug(`[Email Queue] Starting job processing. Queue size: ${this.jobs.size}`);

    try {
      const pendingJobs = Array.from(this.jobs.values())
        .filter(job => job.status === 'pending')
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      for (const job of pendingJobs) {
        await this.processJob(job);
        // Pequena pausa entre jobs para não sobrecarregar
        await this.sleep(100);
      }
    } catch (error) {
      this.strapi.log.error('[Email Queue] Error in job processing:', error);
    } finally {
      this.processing = false;
    }
  }

  /**
   * Processa um job individual
   */
  private async processJob(job: EmailJob) {
    this.strapi.log.info(`[Email Queue] Processing job ${job.id} of type ${job.type}`);
    
    // Atualiza status para processando
    job.status = 'processing';
    job.processedAt = new Date();

    try {
      if (job.type === 'budget') {
        await this.processBudgetEmail(job);
      } else if (job.type === 'order') {
        await this.processOrderEmail(job);
      }

      // Sucesso
      job.status = 'completed';
      this.strapi.log.info(`[Email Queue] Job ${job.id} completed successfully`);

      // Remove job completado após 1 hora para limpeza de memória
      setTimeout(() => {
        this.jobs.delete(job.id);
      }, 3600000);

    } catch (error) {
      this.strapi.log.error(`[Email Queue] Job ${job.id} failed:`, error);
      
      job.retryCount++;
      job.error = error.message;

      if (job.retryCount >= job.maxRetries) {
        job.status = 'failed';
        this.strapi.log.error(`[Email Queue] Job ${job.id} failed permanently after ${job.maxRetries} attempts`);
      } else {
        job.status = 'pending';
        this.strapi.log.info(`[Email Queue] Job ${job.id} will be retried. Attempt ${job.retryCount}/${job.maxRetries}`);
      }
    }
  }

  /**
   * Processa email de orçamento
   */
  private async processBudgetEmail(job: EmailJob) {
    const { sendBudgetEmail } = require('./send-email');
    await sendBudgetEmail({
      ...job.data,
      strapi: this.strapi
    });
  }

  /**
   * Processa email de pedido
   */
  private async processOrderEmail(job: EmailJob) {
    const { sendOrderMail } = require('../order/services/send-order-email');
    await sendOrderMail({
      ...job.data,
      strapi: this.strapi
    });
  }

  /**
   * Gera um ID único para o job
   */
  private generateJobId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Utilitário para pause
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obtém estatísticas da fila
   */
  getQueueStats() {
    const jobs = Array.from(this.jobs.values());
    return {
      total: jobs.length,
      pending: jobs.filter(j => j.status === 'pending').length,
      processing: jobs.filter(j => j.status === 'processing').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
      isProcessing: this.processing
    };
  }

  /**
   * Limpa jobs antigos
   */
  cleanup() {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 horas

    for (const [jobId, job] of this.jobs.entries()) {
      if (job.status === 'completed' && job.processedAt && job.processedAt < cutoff) {
        this.jobs.delete(jobId);
      }
    }
  }
}

export default EmailQueueService;
