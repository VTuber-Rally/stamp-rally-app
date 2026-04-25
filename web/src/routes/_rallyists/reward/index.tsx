import { createFileRoute } from '@tanstack/react-router'

import { RewardPage } from '@/components/routes/rallyists/RewardPage'

export const Route = createFileRoute('/_rallyists/reward/')({
  component: RewardPage,
})
