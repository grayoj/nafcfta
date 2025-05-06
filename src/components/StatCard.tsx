import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

type StatCardProps = {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}

export function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <Card className="bg-white shadow-sm rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
        <div className="text-gray-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-extrabold text-gray-900">{value}</div>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      </CardContent>
    </Card>
  )
}
