import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import QRCodeLink from '@/components/controls/QRCodeLink'
import { Header } from '@/components/layout/Header'

export const Route = createFileRoute(
  '/_rallyists/_withUserProvider/reward/contest/',
)({
  component: ContestPage,
})

function ContestPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto p-4">
      <Header>{t('contest.title')}</Header>

      <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">
          {t('contest.description')}
        </h2>
        <p className="mb-4 text-gray-700">{t('contest.longDescription')}</p>

        <div className="mb-4">
          <h3 className="mb-2 font-medium">{t('contest.rules')}</h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>{t('contest.rule1')}</li>
            <li>{t('contest.rule2')}</li>
            <li>{t('contest.rule3')}</li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 font-medium">{t('contest.prizes')}</h3>
          <p className="text-gray-700">{t('contest.prizesDescription')}</p>
        </div>
      </div>
      <QRCodeLink />
    </div>
  )
}
