'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetInput } from './budget-input';
import { MotionNumberDisplay } from './motion-number-display';
import { ApproveSwitch } from './approve-switch';
import { motion } from 'motion/react';

interface BudgetSectionProps {
    totalPrice: number;
    total_cost_price: number;
    onTotalPriceChange: (value: number) => void;
    onCostPriceChange: (value: number) => void;
    status?: string;
    isLoadingConfirm?: boolean;
    onStatusChange?: (status: string) => void;
    itemsTotal?: number;
    minTotalPrice?: number;
    minCostPrice?: number;
    maxCostPrice?: number;
}

export function BudgetSection({
    totalPrice,
    total_cost_price,
    onTotalPriceChange,
    onCostPriceChange,
    status = 'pendente',
    isLoadingConfirm = false,
    onStatusChange,
    itemsTotal = 0,
    minTotalPrice = 0,
    minCostPrice = 0,
    maxCostPrice = 0,
}: BudgetSectionProps) {
    // Cálculos
    const profit = Math.max(0, totalPrice - total_cost_price);
    const margin = totalPrice > 0 ? (profit / totalPrice) * 100 : 0;
    const hasLowMargin = margin < 10 && totalPrice > 0;
    const hasNegativeProfit = profit < 0;
    const isConfirmed = status === 'confirmado';

    // Se confirmado, mostrar visualização simplificada
    if (isConfirmed) {
        return (
            <Card className="h-full bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b px-3 sm:px-6 py-3 sm:py-4">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                        <span className="truncate">Orçamento Confirmado</span>
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-emerald-700 font-normal mt-1">
                        ✓ Orçamento finalizado e confirmado
                    </p>
                </CardHeader>

                <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                    <motion.div
                        className="space-y-4 sm:space-y-5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
                    >
                        {/* Grid de Informações Essenciais */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            {/* Preço Total */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 sm:p-4 bg-white border border-emerald-200 rounded-lg"
                            >
                                <p className="text-xs sm:text-sm text-gray-600 mb-1">Preço Total</p>
                                <p className="text-2xl sm:text-3xl font-bold text-emerald-700">R$ {totalPrice.toFixed(2)}</p>
                            </motion.div>

                            {/* Custo do Evento */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 sm:p-4 bg-white border border-emerald-200 rounded-lg"
                            >
                                <p className="text-xs sm:text-sm text-gray-600 mb-1">Custo do Evento</p>
                                <p className="text-2xl sm:text-3xl font-bold text-emerald-700">R$ {total_cost_price.toFixed(2)}</p>
                            </motion.div>
                        </motion.div>

                        {/* Divider */}
                        <motion.div
                            className="h-px bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        />

                        {/* Resultados */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, staggerChildren: 0.1, delayChildren: 0.3 }}
                        >
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <MotionNumberDisplay
                                    label="Lucro Estimado"
                                    value={profit}
                                    format="currency"
                                    prefix="R$"
                                    color={
                                        hasNegativeProfit ? 'red' : hasLowMargin ? 'amber' : 'green'
                                    }
                                    showTrend={false}
                                    size="md"
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <MotionNumberDisplay
                                    label="Margem de Lucro"
                                    value={margin}
                                    format="percentage"
                                    suffix="%"
                                    color={
                                        hasNegativeProfit ? 'red' : hasLowMargin ? 'amber' : 'green'
                                    }
                                    showTrend={false}
                                    size="md"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col justify-end"
                            >
                                <ApproveSwitch
                                    defaultChecked={true}
                                    isLoading={isLoadingConfirm}
                                    onStatusChange={(newStatus) => {
                                        onStatusChange?.(newStatus);
                                    }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Badge de Confirmação */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="p-3 sm:p-4 bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-lg text-center"
                        >
                            <p className="text-xs sm:text-sm font-semibold text-emerald-700">
                                ✅ Orçamento confirmado e finalizado
                            </p>
                        </motion.div>
                    </motion.div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b px-3 sm:px-6 py-3 sm:py-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="truncate">Orçamento & Preços</span>
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 font-normal mt-1">
                    Defina o preço total e o custo do evento para calcular lucro e margem
                </p>
            </CardHeader>

            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
                >

                    {/* Total dos Itens */}
                    {itemsTotal > 0 && (
                        <motion.div
                            className="p-3 sm:p-4 bg-gradient-to-r from-amber-50/45 to-white border border-amber-200 rounded-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-amber-900">Soma dos Itens do Pedido</p>
                                    <p className="text-xs text-amber-700 mt-0.5">Total dos produtos vinculados</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xl sm:text-2xl font-bold text-amber-900">R$ {itemsTotal.toFixed(2)}</p>
                                    <p className="text-xs text-amber-700 mt-0.5">custo: R$ {total_cost_price.toFixed(2)}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Inputs Principais */}
                    <motion.div
                        className="grid lg:grid-cols-2 gap-3 sm:gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <BudgetInput
                            label="💰 Preço Total (R$)"
                            value={totalPrice}
                            onChange={onTotalPriceChange}
                            minValue={minTotalPrice}
                            step={0.01}
                            placeholder="0.00"
                            costPrice={total_cost_price}
                            totalPrice={totalPrice}
                            showProfitWarning={true}
                            hint={minTotalPrice > 0 ? `Mínimo: R$ ${minTotalPrice.toFixed(2)} (soma dos itens)` : "Valor que o cliente vai pagar"}
                            disabled={isConfirmed}
                        />

                        <BudgetInput
                            label="📊 Custo do Evento (R$)"
                            value={total_cost_price}
                            onChange={onCostPriceChange}
                            minValue={minCostPrice}
                            maxValue={maxCostPrice}
                            step={0.01}
                            placeholder="0.00"
                            costPrice={total_cost_price}
                            totalPrice={totalPrice}
                            showProfitWarning={true}
                            hint={minCostPrice > 0 ? `Mínimo: R$ ${minCostPrice.toFixed(2)} (soma dos custos)` : "Custo total para realizar o evento"}
                            disabled={isConfirmed}
                        />
                    </motion.div>


                    {/* Divider */}
                    <motion.div
                        className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    />

                    {/* Resultados com Motion Numbers */}
                    <motion.div
                        className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, staggerChildren: 0.1, delayChildren: 0.3 }}
                    >
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <MotionNumberDisplay
                                label="Lucro Estimado"
                                value={profit}
                                format="currency"
                                prefix="R$"
                                color={
                                    hasNegativeProfit ? 'red' : hasLowMargin ? 'amber' : 'green'
                                }
                                showTrend={false}
                                size="md"
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <MotionNumberDisplay
                                label="Margem de Lucro"
                                value={margin}
                                format="percentage"
                                suffix="%"
                                color={
                                    hasNegativeProfit ? 'red' : hasLowMargin ? 'amber' : 'green'
                                }
                                showTrend={false}
                                size="md"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col justify-end"
                        >
                            <ApproveSwitch
                                defaultChecked={status === 'confirmado'}
                                isLoading={isLoadingConfirm}
                                disabled={hasLowMargin}
                                onStatusChange={(newStatus) => {
                                    onStatusChange?.(newStatus);
                                }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Avisos */}
                    {hasNegativeProfit && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="p-3 sm:p-4 bg-red-50 border border-red-300 rounded-lg"
                        >
                            <p className="text-xs sm:text-sm font-semibold text-red-700">
                                ❌ Atenção: Lucro negativo! Custo maior que o preço total.
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                                Aumente o preço total ou reduza o custo para gerar lucro.
                            </p>
                        </motion.div>
                    )}

                    {hasLowMargin && !hasNegativeProfit && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="p-3 sm:p-4 bg-amber-50 border border-amber-300 rounded-lg"
                        >
                            <p className="text-xs sm:text-sm font-semibold text-amber-700">
                                ⚠️ Aviso: Margem baixa (abaixo de 10%)
                            </p>
                            <p className="text-xs text-amber-600 mt-1">
                                Considere aumentar o preço para melhorar a rentabilidade.
                            </p>
                        </motion.div>
                    )}

                    {!hasNegativeProfit && !hasLowMargin && totalPrice > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="p-3 sm:p-4 bg-emerald-50 border border-emerald-300 rounded-lg"
                        >
                            <p className="text-xs sm:text-sm font-semibold text-emerald-700">
                                ✅ Orçamento saudável!
                            </p>
                            <p className="text-xs text-emerald-600 mt-1">
                                Margem de lucro dentro dos parâmetros recomendados.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </CardContent>
        </Card>
    );
}
