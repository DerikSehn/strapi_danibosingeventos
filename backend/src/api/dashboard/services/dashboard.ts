import { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
    async getSummary(tenantId: number) {

        if (!tenantId) {
            throw new Error('Tenant ID é obrigatório para buscar o resumo do dashboard.');
        }

        const commonFilters = { tenant: tenantId };

        // 1. Calcular Despesas e Receitas Totais
        const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
            filters: {},
            fields: ['amount', 'type'],
        });

        let totalExpenses = 0;
        let totalIncome = 0;
        transactions.forEach(t => {
            if (t.type === 'despesa') {
                totalExpenses += Number(t.amount) || 0;
            } else if (t.type === 'receita') {
                totalIncome += Number(t.amount) || 0;
            }
        });

        // 2. Buscar Transações Recentes (ex: últimas 5)
        const recentTransactions = await strapi.entityService.findMany('api::transaction.transaction', {
            filters: {},
            sort: { date: 'desc' },
            limit: 5,
            populate: { finance_category: { fields: ['name'] } },
            fields: ['id', 'description', 'amount', 'date', 'type'],
        });

        // 3. Calcular Despesas por Categoria
        const expenses = transactions.filter(t => t.type === 'despesa');

        const expensesByCategoryMap = new Map<string, number>();

        const expenseTransactionsWithCategory = await strapi.entityService.findMany('api::transaction.transaction', {
            filters: { ...commonFilters, type: 'despesa' },
            populate: '*',
            fields: ['amount'],
        });

        expenseTransactionsWithCategory.forEach((t, id) => {
            const categoryName = (t as any).finance_category?.name || 'Sem Categoria';
            const currentAmount = expensesByCategoryMap.get(categoryName) || 0;
            expensesByCategoryMap.set(categoryName, currentAmount + (Number(t.amount) || 0));
        });

        const expensesByCategory = Array.from(expensesByCategoryMap.entries()).map(([category, amount]) => ({
            category,
            amount,
        }));

        // Montar o objeto de resposta final
        const result = {
            totalExpenses,
            totalIncome,
            recentTransactions: recentTransactions.map(t => ({
                id: t.id,
                description: t.description,
                amount: Number(t.amount) || 0,
                date: t.date,
                type: t.type,
                category: {
                    name: (t as any).finance_category?.name || 'Sem Categoria',
                },
            })),
            expensesByCategory,
        };

        return result;
    },
});
