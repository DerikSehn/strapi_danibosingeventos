"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Share, Copy, Check, Loader2, Link as LinkIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getStrapiURL, getStrapiMedia } from "@/lib/utils"
import { toast } from "sonner"
import Image from "next/image"

// Interface unificada para os itens de compartilhamento
interface ShareOption {
    id: string | number
    title: string
    imageUrl: string | null
    slug?: string // undefined para o link principal
}

async function getShareOptions(): Promise<ShareOption[]> {
    try {
        const [partyTypesRes, orderPageRes] = await Promise.all([
            fetch(`${getStrapiURL()}/api/party-types?populate=backgroundImage`),
            fetch(`${getStrapiURL()}/api/order-page?populate=shareImage`)
        ])

        const partyTypesJson = await partyTypesRes.json()
        const orderPageJson = await orderPageRes.json()
        
        // Process Main Order Option
        const orderPageData = orderPageJson.data?.attributes || orderPageJson.data
        const mainOrderImage = orderPageData?.shareImage?.data?.attributes?.url || orderPageData?.shareImage?.url || null
        
        const mainOrderOption: ShareOption = {
            id: 'main-order',
            title: orderPageData?.shareTitle || "Encomendas à pronta-entrega",
            imageUrl: mainOrderImage,
            slug: undefined
        }

        // Process Party Types
        const partyTypesData = partyTypesJson.data || []
        const partyOptions = partyTypesData.map((item: any) => {
            const attrs = item.attributes || item
            const imageData = attrs.backgroundImage?.data?.attributes || attrs.backgroundImage
            
            return {
                id: item.id,
                title: attrs.title || attrs.name,
                slug: attrs.slug || attrs.caption,
                imageUrl: imageData?.url || null
            }
        })

        return [mainOrderOption, ...partyOptions]
    } catch (error) {
        console.error("Error fetching share options:", error)
        // Fallback for main order if fetch fails
        return [{
            id: 'main-order',
            title: "Encomendas à pronta-entrega",
            imageUrl: null,
            slug: undefined
        }]
    }
}

export function ShareOrderButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [copiedId, setCopiedId] = useState<string | number | null>(null)

    const { data: allOptions, isLoading } = useQuery({
        queryKey: ['share-options'],
        queryFn: getShareOptions,
        enabled: isOpen
    })

    const copyToClipboard = (text: string, id: string | number) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id)
            toast.success("Link copiado!")
            setTimeout(() => setCopiedId(null), 2000)
        })
    }

    const getLink = (slug?: string) => {
        if (typeof window === 'undefined') return ''
        const baseUrl = window.location.origin + "/encomenda"
        if (!slug) return baseUrl
        return `${baseUrl}?partyType=${slug}`
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer">
                    <div className="h-14 w-14 rounded-full flex items-center justify-center transition-transform active:scale-95 bg-secondary-100 text-secondary-600">
                        <Share className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium text-gray-600 text-center leading-tight">
                        Compartilhar
                    </span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Compartilhar Cardápio</DialogTitle>
                    <DialogDescription>
                        Selecione uma opção para copiar o link direto.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        {allOptions?.map((option) => (
                            <div
                                key={option.id}
                                className="relative flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all gap-2 text-center h-32 active:scale-95 duration-200 overflow-hidden group"
                                onClick={() => copyToClipboard(getLink(option.slug), option.id)}
                            >
                                {option.imageUrl && (
                                    <Image
                                        src={getStrapiMedia(option.imageUrl) || ''}
                                        alt={option.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-110"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/80 z-10" />

                                <div className="z-20 flex flex-col items-center text-white w-full px-2">
                                    <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                                        {copiedId === option.id ? <Check className="h-4 w-4" /> : (option.id === 'main-order' ? <LinkIcon className="h-4 w-4" /> : <Copy className="h-4 w-4" />)}
                                    </div>
                                    <span className="font-bold text-sm shadow-sm line-clamp-2 leading-tight">{option.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
