"use client"
import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef, SortingState, Row } from '@tanstack/react-table'
import { DataTable } from '@/components/datatable/DataTable'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, RefreshCw } from 'lucide-react'

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  pageCount: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface DynamicTableConfig<T> {
  queryKey: string[]
  apiEndpoint: (params: {
    page?: number
    limit?: number
    sort?: string
    order?: string
    q?: string
    [key: string]: unknown
  }) => Promise<PaginatedResponse<T>>
  columns: ColumnDef<T, unknown>[]
  defaultLimit?: number
  limitOptions?: number[]
  defaultSort?: string
  defaultOrder?: 'ASC' | 'DESC'
  searchPlaceholder?: string
  emptyMessage?: string
  enableSearch?: boolean
  enableColumnVisibility?: boolean
  enableExport?: boolean
  exportFileName?: string
  additionalParams?: Record<string, unknown>
  getRowClassName?: (row: Row<T>) => string | undefined
  skeletonRows?: number
}

export interface DynamicTableProps<T> extends Omit<DynamicTableConfig<T>, 'queryKey' | 'apiEndpoint' | 'columns'> {
  tableId: string
  queryKey?: string[]
  apiEndpoint: DynamicTableConfig<T>['apiEndpoint']
  columns: DynamicTableConfig<T>['columns']
  onDataResponse?: (data: PaginatedResponse<T>) => void
}

export function DynamicTable<T extends Record<string, unknown>>({
  tableId,
  queryKey: customQueryKey,
  apiEndpoint,
  columns,
  defaultLimit = 20,
  limitOptions = [10, 20, 50, 100],
  defaultSort,
  defaultOrder = 'DESC',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum registro encontrado.',
  enableSearch = true,
  enableColumnVisibility = true,
  enableExport = true,
  exportFileName,
  additionalParams = {},
  getRowClassName,
  skeletonRows = 5,
  onDataResponse,
}: Readonly<DynamicTableProps<T>>) {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(defaultLimit)
  const [sorting, setSorting] = React.useState<SortingState>(
    defaultSort ? [{ id: defaultSort, desc: defaultOrder === 'DESC' }] : []
  )
  const [searchQuery, setSearchQuery] = React.useState('')
  const [debouncedSearch, setDebouncedSearch] = React.useState('')

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  React.useEffect(() => {
    setPage(1)
  }, [sorting])

  const sortField = sorting.length > 0 ? sorting[0].id : undefined
  const sortOrder = sorting.length > 0 && sorting[0].desc ? 'DESC' : 'ASC'

  const baseQueryKey = customQueryKey || [tableId]
  const query = useQuery({
    queryKey: [
      ...baseQueryKey,
      page,
      limit,
      sortField,
      sortOrder,
      debouncedSearch,
      additionalParams,
    ],
    queryFn: () =>
      apiEndpoint({
        page,
        limit,
        sort: sortField,
        order: sortOrder,
        q: debouncedSearch || undefined,
        ...additionalParams,
      }).then(res => {
        onDataResponse?.(res)
        return res;
      }),
    staleTime: 30000,
    gcTime: 300000,
  })

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
  }

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting)
  }

  const handleRetry = () => {
    query.refetch()
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        {enableSearch && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                ×
              </Button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={query.isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${query.isFetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={query.data?.data || []}
        loading={query.isLoading}
        error={query.error?.message || null}
        emptyMessage={emptyMessage}
        total={query.data?.meta.total}
        page={page}
        pageCount={query.data?.meta.pageCount}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        limitOptions={limitOptions}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        manualSorting={true}
        onRetry={handleRetry}
        enableColumnVisibility={enableColumnVisibility}
        enableExport={enableExport}
        exportFileName={exportFileName || `${tableId}-export`}
        getRowClassName={getRowClassName}
        skeletonRows={skeletonRows}
      />
    </div>
  )
}
