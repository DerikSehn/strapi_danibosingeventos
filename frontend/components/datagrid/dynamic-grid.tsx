"use client"
import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
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

export interface DynamicGridConfig<T> {
  queryKey: string[]
  apiEndpoint: (params: {
    page?: number
    limit?: number
    sort?: string
    order?: string
    q?: string
    [key: string]: unknown
  }) => Promise<PaginatedResponse<T>>
  renderItem: (item: T, index: number) => React.ReactNode
  defaultLimit?: number
  searchPlaceholder?: string
  emptyMessage?: string
  enableSearch?: boolean
  additionalParams?: Record<string, unknown>
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number }
  gap?: string
  skeletonRows?: number
}

export interface DynamicGridProps<T> extends Omit<DynamicGridConfig<T>, `queryKey` | `apiEndpoint` | `renderItem`> {
  gridId: string
  apiEndpoint: DynamicGridConfig<T>[`apiEndpoint`]
  renderItem: DynamicGridConfig<T>[`renderItem`]
  onDataResponse?: (data: PaginatedResponse<T>) => void
}

export function DynamicGrid<T extends Record<string, unknown>>({
  gridId,
  apiEndpoint,
  renderItem,
  defaultLimit = 12,
  searchPlaceholder = `Buscar...`,
  emptyMessage = `Nenhum item encontrado.`,
  enableSearch = true,
  additionalParams = {},
  columns = 4,
  columnsMobile = 1,
  gap = `gap-4`,
  skeletonRows = 12,
  onDataResponse,
}: Readonly<DynamicGridProps<T>>) {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(defaultLimit)
  const [searchQuery, setSearchQuery] = React.useState(``)
  const [debouncedSearch, setDebouncedSearch] = React.useState(``)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const query = useQuery({
    queryKey: [
      gridId,
      page,
      limit,
      debouncedSearch,
      additionalParams,
    ],
    queryFn: () =>
      apiEndpoint({
        page,
        limit,
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

  const handleRetry = () => {
    query.refetch()
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchQuery(``)
  }

  // Determinar classes do grid baseado no columns prop
  const getGridClasses = () => {
    if (typeof columns === `number`) {
      const colMap: Record<number, string> = {
        1: `grid-cols-${columnsMobile}`,
        2: `grid-cols-${columnsMobile} sm:grid-cols-2`,
        3: `grid-cols-${columnsMobile} sm:grid-cols-2 lg:grid-cols-3`,
        4: `grid-cols-${columnsMobile} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`,
        5: `grid-cols-${columnsMobile} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5`,
        6: `grid-cols-${columnsMobile} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6`,
      }
      return colMap[columns] || `grid-cols-${columnsMobile} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
    }

    // Se for objeto com breakpoints
    const { sm = 1, md = 2, lg = 3, xl = 4 } = columns
    return `grid-cols-${columnsMobile} sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl}`
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
            <RefreshCw className={`h-4 w-4 ${query.isFetching ? `animate-spin` : ``}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {query.isLoading && (
        <div className={`grid ${getGridClasses()} ${gap}`}>
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {query.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center justify-between">
          <span>Erro ao carregar itens. Tente novamente.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
          >
            Tentar Novamente
          </Button>
        </div>
      )}

      {/* Grid Content */}
      {!query.isLoading && !query.error && (
        <>
          {query.data?.data && query.data.data.length > 0 ? (
            <>
              <div className={`grid ${getGridClasses()} ${gap}`}>
                {query.data.data.map((item, index) => (
                  <React.Fragment key={`${gridId}-${index}`}>
                    {renderItem(item, index)}
                  </React.Fragment>
                ))}
              </div>

              {/* Pagination */}
              {query.data.meta && query.data.meta.pageCount > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={!query.data.meta.hasPrev}
                  >
                    Anterior
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, query.data.meta.pageCount) }).map((_, i) => {
                      const pageNum = Math.max(1, page - 2) + i
                      if (pageNum > query.data.meta.pageCount) return null
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? `default` : `outline`}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.min(query.data.meta.pageCount, page + 1))}
                    disabled={!query.data.meta.hasNext}
                  >
                    Próximo
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {emptyMessage}
            </div>
          )}
        </>
      )}
    </div>
  )
}
