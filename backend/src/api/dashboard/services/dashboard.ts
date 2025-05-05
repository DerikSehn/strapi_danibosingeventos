import { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
    async getSummary(tenantId: number) {
        console.log('getSummary called with tenantId:', tenantId);

        if (!tenantId) {
            throw new Error('Tenant ID é obrigatório para buscar o resumo do dashboard.');
        }

        const commonFilters = { tenant: tenantId };
        console.log('Common filters:', commonFilters);

        // 1. Calcular Despesas e Receitas Totais
        console.log('Fetching transactions...');
        const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
            filters: {},
            fields: ['amount', 'type'],
        });
        console.log('Transactions fetched:', transactions);

        let totalExpenses = 0;
        let totalIncome = 0;
        transactions.forEach(t => {
            if (t.type === 'despesa') {
                totalExpenses += Number(t.amount) || 0;
            } else if (t.type === 'receita') {
                totalIncome += Number(t.amount) || 0;
            }
        });
        console.log('Total expenses:', totalExpenses);
        console.log('Total income:', totalIncome);

        // 2. Buscar Transações Recentes (ex: últimas 5)
        console.log('Fetching recent transactions...');
        const recentTransactions = await strapi.entityService.findMany('api::transaction.transaction', {
            filters: {},
            sort: { date: 'desc' },
            limit: 5,
            populate: { finance_category: { fields: ['name'] } },
            fields: ['id', 'description', 'amount', 'date', 'type'],
        });
        console.log('Recent transactions fetched:', recentTransactions);

        // 3. Calcular Despesas por Categoria
        console.log('Filtering expenses...');
        const expenses = transactions.filter(t => t.type === 'despesa');
        console.log('Expenses filtered:', expenses);

        const expensesByCategoryMap = new Map<string, number>();

        console.log('Fetching expense transactions with categories...');
        const expenseTransactionsWithCategory = await strapi.entityService.findMany('api::transaction.transaction', {
            filters: { ...commonFilters, type: 'despesa' },
            populate: { finance_category: { fields: ['name'] } },
            fields: ['amount'],
        });
        console.log('Expense transactions with categories fetched:', expenseTransactionsWithCategory);

        expenseTransactionsWithCategory.forEach((t, id) => {
            console.log(`${id} EACH TRANSACTION LOG:`, t);
            const categoryName = t.finance_category?.name || 'Sem Categoria';
            const currentAmount = expensesByCategoryMap.get(categoryName) || 0;
            expensesByCategoryMap.set(categoryName, currentAmount + (Number(t.amount) || 0));
        });

        const expensesByCategory = Array.from(expensesByCategoryMap.entries()).map(([category, amount]) => ({
            category,
            amount,
        }));
        console.log('Expenses by category:', expensesByCategory);

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
                    name: t.finance_category?.name || 'Sem Categoria',
                },
            })),
            expensesByCategory,
        };
        console.log('Final result:', result);

        return result;
    },
});
