import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function BagDetailLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header skeleton */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-14 bg-muted animate-pulse rounded" />
          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        </div>
      </div>

      {/* Metadata skeleton */}
      <Card>
        <CardHeader>
          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-28 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brew history skeleton */}
      <Card>
        <CardHeader>
          <div className="h-5 w-24 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-4 w-36 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    </div>
  )
}
