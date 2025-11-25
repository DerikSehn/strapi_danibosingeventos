import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock data for financial reports
const MOCK_FINANCIAL_DATA = {
  summary: {
    totalRevenue: 45230.50,
    totalCost: 18920.30,
    totalProfit: 26310.20,
    profitMargin: 58.2,
    totalOrders: 128,
    averageOrderValue: 353.36,
    periodLabel: 'November 2025'
  },
  monthlyTrend: [
    { month: 'Sep', revenue: 32450, cost: 14200, profit: 18250 },
    { month: 'Oct', revenue: 38900, cost: 16750, profit: 22150 },
    { month: 'Nov', revenue: 45230.50, cost: 18920.30, profit: 26310.20 }
  ],
  topProducts: [
    { name: 'Brigadeiro Gourmet', quantity: 342, revenue: 3948, cost: 1974, profit: 1974 },
    { name: 'Risoles de Frango', quantity: 298, revenue: 3278, cost: 1639, profit: 1639 },
    { name: 'Canapé de Filé', quantity: 256, revenue: 4608, cost: 2304, profit: 2304 },
    { name: 'Mousse de Maracujá', quantity: 215, revenue: 2580, cost: 1290, profit: 1290 },
    { name: 'Gota de Morango', quantity: 189, revenue: 4410, cost: 2205, profit: 2205 }
  ],
  topVariants: [
    { name: 'Leite Ninho com Nutella', quantity: 156, revenue: 2496, cost: 1248, profit: 1248 },
    { name: 'Stikadinho', quantity: 142, revenue: 2272, cost: 1136, profit: 1136 },
    { name: 'Brigadeiro de Amendoim', quantity: 128, revenue: 2304, cost: 1152, profit: 1152 },
    { name: 'Brigadeiro de Chocolate Belga', quantity: 115, revenue: 2070, cost: 1035, profit: 1035 },
    { name: 'Brigadeiro de Café', quantity: 108, revenue: 1944, cost: 972, profit: 972 }
  ],
  orderStatus: [
    { status: 'confirmado', count: 95, revenue: 35890 },
    { status: 'pendente', count: 24, revenue: 7120 },
    { status: 'cancelado', count: 9, revenue: 2220 }
  ],
  profitByCategory: [
    { category: 'Salgados', profit: 8450, percentage: 32.1 },
    { category: 'Doces', profit: 10230, percentage: 38.8 },
    { category: 'Bebidas', profit: 4210, percentage: 16.0 },
    { category: 'Outros', profit: 3420, percentage: 13.0 }
  ],
  averageMetrics: {
    avgItemsPerOrder: 4.2,
    avgOrderValue: 353.36,
    avgCostPerOrder: 147.81,
    avgProfitPerOrder: 205.55,
    avgProfitMarginPerOrder: 58.2
  }
};

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;
    
    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Simulate different endpoints based on query parameter
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint') || 'summary';

    let data;
    switch (endpoint) {
      case 'summary':
        data = MOCK_FINANCIAL_DATA.summary;
        break;
      case 'monthly-trend':
        data = MOCK_FINANCIAL_DATA.monthlyTrend;
        break;
      case 'top-products':
        data = MOCK_FINANCIAL_DATA.topProducts;
        break;
      case 'top-variants':
        data = MOCK_FINANCIAL_DATA.topVariants;
        break;
      case 'order-status':
        data = MOCK_FINANCIAL_DATA.orderStatus;
        break;
      case 'profit-by-category':
        data = MOCK_FINANCIAL_DATA.profitByCategory;
        break;
      case 'average-metrics':
        data = MOCK_FINANCIAL_DATA.averageMetrics;
        break;
      default:
        data = MOCK_FINANCIAL_DATA;
    }

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to load financial data' },
      { status: 500 }
    );
  }
}
