"use client"
import { Button } from '@/components/ui/button'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, Row, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table'
import { FileBarChart2Icon } from 'lucide-react'
import * as React from 'react'

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  total?: number
  page?: number
  pageCount?: number
  limit?: number
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
  limitOptions?: number[]
  sorting?: SortingState
  onSortingChange?: (s: SortingState) => void
  manualSorting?: boolean
  enableFooterMeta?: boolean
  captionExtra?: React.ReactNode
  onRetry?: () => void
  className?: string
  enableColumnVisibility?: boolean
  enableExport?: boolean
  exportFileName?: string
  onExport?: (rows: TData[], columns: ColumnDef<TData, any>[]) => void
  defaultHiddenColumns?: string[]
  showRange?: boolean
  skeletonRows?: number
  getRowClassName?: (row: Row<TData>) => string | undefined
}

export function DataTable<TData>(props: Readonly<DataTableProps<TData>>) {
  const {
    columns,
    data,
    loading,
    error,
    emptyMessage = 'Nenhum registro.',
    total,
    page,
    pageCount,
    limit,
    onPageChange,
    onLimitChange,
    limitOptions = [10, 20, 50, 100],
    sorting,
    onSortingChange,
    manualSorting,
    enableFooterMeta = true,
    captionExtra,
    onRetry,
    className,
    enableColumnVisibility,
    enableExport,
    exportFileName,
    onExport,
    defaultHiddenColumns = [],
    showRange = true,
    skeletonRows = 5,
    getRowClassName,
  } = props

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  React.useEffect(() => {
    if (!defaultHiddenColumns.length) return
    setColumnVisibility(cv => {
      if (Object.keys(cv).length) return cv
      const next: VisibilityState = {}
      defaultHiddenColumns.forEach(id => { next[id] = false })
      return next
    })
  }, [defaultHiddenColumns])

  const table = useReactTable({
    data,
    columns,
    state: { sorting: sorting || [], columnVisibility },
    onSortingChange: updater => {
      if (onSortingChange) {
        if (typeof updater === 'function') {
          const next = (updater as (old: SortingState) => SortingState)(sorting || [])
          onSortingChange(next)
        } else {
          onSortingChange(updater)
        }
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    manualSorting: !!manualSorting,
    enableMultiSort: false,
  })

  const showFooter = enableFooterMeta && typeof page === 'number' && typeof pageCount === 'number' && pageCount > 0 && data.length > 0

  function exportCsv() {
    if (onExport) return onExport(data, columns)
    const visibleCols = table.getAllLeafColumns().filter(c => c.getIsVisible())
    const header = visibleCols.map(c => {
      if (typeof c.columnDef.header === 'string') return JSON.stringify(c.columnDef.header)
      return JSON.stringify(c.id)
    }).join(',')
    const lines = data.map(row => visibleCols.map(c => {
      const value = (row as Record<string, unknown>)[c.id]
      if (value === null || value === undefined) return ''
      return JSON.stringify(value)
    }).join(','))
    const csv = [header, ...lines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(exportFileName || 'export')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const showRangeText = (() => {
    let text: string
    if (showRange && typeof page === 'number' && typeof limit === 'number' && typeof total === 'number') {
      const start = total === 0 ? 0 : (page - 1) * limit + 1
      const end = Math.min(start + data.length - 1, total)
      text = `Exibindo ${start}-${end} de ${total}`
    } else {
      const totalText = typeof total === 'number' ? ` de ${total}` : ''
      text = `Exibindo ${data.length}${totalText}`
    }
    return <span>{text}</span>
  })()

  return (
    <div className={`overflow-auto rounded border ${className || ''}`}>
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id} className="border-b">
              {hg.headers.map(h => (
                <th key={h.id} colSpan={h.colSpan} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {loading && !error && (
            Array.from({ length: Math.min(skeletonRows, limit || skeletonRows) }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="animate-pulse opacity-70 border-b">
                {table.getAllLeafColumns().map(col => (
                  <td key={col.id} className="h-12 px-4">
                    <div className="h-4 w-full max-w-[120px] bg-muted rounded" />
                  </td>
                ))}
              </tr>
            ))
          )}
          {!loading && error && (
            <tr><td colSpan={columns.length} className="p-4 text-destructive text-sm">{error} {onRetry && <Button size="sm" variant="outline" onClick={onRetry}>Tentar novamente</Button>}</td></tr>
          )}
          {!loading && !error && data.length === 0 && (
            <tr><td colSpan={columns.length} className="p-4 text-muted-foreground text-sm text-center">{emptyMessage}</td></tr>
          )}
          {!loading && !error && table.getRowModel().rows.map(r => {
            const extra = getRowClassName ? (getRowClassName(r) || '') : ''
            return (
              <tr key={r.id} className={`border-b hover:bg-muted/50 ${extra}`}>
                {r.getVisibleCells().map(c => (
                  <td key={c.id} className="h-12 px-4 align-middle">{flexRender(c.column.columnDef.cell, c.getContext())}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      {showFooter && (
        <div className="border-t px-4 py-3 text-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span>{showRangeText}</span>
            <div className="flex items-center gap-2">
              {enableColumnVisibility && (
                <details className="group">
                  <summary className="list-none cursor-pointer select-none text-xs underline">Colunas</summary>
                  <div className="absolute right-4 mt-1 z-10 bg-background border rounded shadow p-2 flex flex-col gap-1 min-w-[160px]">
                    {table.getAllLeafColumns().map(col => (
                      <label key={col.id} className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" checked={col.getIsVisible()} onChange={() => col.toggleVisibility()} />
                        <span className="truncate">{col.id}</span>
                      </label>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            {enableExport && (
              <Button title='Exportar CSV' type="button" size="sm" variant="outline" onClick={exportCsv} className="flex items-center gap-1">
                <FileBarChart2Icon className="h-4 w-4" />
                Exportar
              </Button>
            )}
            <Button type="button" size="sm" variant="outline" disabled={page === 1} onClick={() => onPageChange?.(page - 1)}>Anterior</Button>
            <span className="text-xs">Página {page} / {pageCount}</span>
            <Button type="button" size="sm" variant="outline" disabled={page === pageCount} onClick={() => onPageChange?.(page + 1)}>Próxima</Button>
            {typeof limit === 'number' && onLimitChange && (
              <select className="bg-transparent border rounded px-2 py-1 text-xs" value={limit} onChange={e => { onPageChange?.(1); onLimitChange?.(Number(e.target.value)) }}>
                {limitOptions.map(o => <option key={o} value={o}>{o}/página</option>)}
              </select>
            )}
          </div>
          {captionExtra}
        </div>
      )}
    </div>
  )
}
