import { useNavigate } from '@tanstack/react-router'
import { Button } from '../../../components/Button/Button'
import { Card } from '../../../components/Card/Card'
import { useStats } from '../hooks/useStats'
import { clearAllData } from '../../../lib/db'

import './StatsPage.scss'

export const StatsPage = () => {
  const navigate = useNavigate()
  const { calculations, totalCorrectRate, totalCount, isLoading, error, reload } = useStats()

  const handleClear = async () => {
    if (!window.confirm('全ての学習記録を削除しますか？この操作は元に戻せません。')) {
      return
    }
    try {
      await clearAllData()
      reload()
    } catch (e) {
      console.error('Failed to clear data:', e)
    }
  }

  if (isLoading) {
    return (
      <div className="stats-page">
        <div className="stats-page__loading">読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="stats-page">
        <div className="stats-page__error">
          <p>データの読み込みに失敗しました。</p>
          <Button variant="secondary" size="medium" onClick={reload}>
            再試行
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="stats-page">
      <header className="stats-page__header">
        <Button
          variant="tertiary"
          size="small"
          onClick={() => navigate({ to: '/' })}
          className="stats-page__back-btn"
        >
          ← ホームに戻る
        </Button>
        <h1 className="stats-page__title">学習記録</h1>
      </header>

      {totalCount === 0 ? (
        <div className="stats-page__empty">
          <p>まだ学習記録がありません。</p>
          <p>クイズを解いて記録をはじめましょう！</p>
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate({ to: '/' })}
          >
            クイズをはじめる
          </Button>
        </div>
      ) : (
        <>
          <Card className="stats-page__summary">
            <div className="stats-page__summary-item">
              <span className="stats-page__summary-label">総回答数</span>
              <span className="stats-page__summary-value">{totalCount}回</span>
            </div>
            <div className="stats-page__summary-item">
              <span className="stats-page__summary-label">全体正解率</span>
              <span
                className={`stats-page__summary-value ${
                  totalCorrectRate >= 80
                    ? 'stats-page__summary-value--excellent'
                    : totalCorrectRate >= 60
                    ? 'stats-page__summary-value--good'
                    : ''
                }`}
              >
                {totalCorrectRate}%
              </span>
            </div>
            <div className="stats-page__summary-item">
              <span className="stats-page__summary-label">学習問題数</span>
              <span className="stats-page__summary-value">{calculations.length}問</span>
            </div>
          </Card>

          <section className="stats-page__list-section">
            <h2 className="stats-page__section-title">問題ごとの成績</h2>
            <ul className="stats-page__list">
              {calculations.map((calc) => (
                <li key={calc.questionId} className="stats-page__list-item">
                  <Card className="stats-page__list-card">
                    <div className="stats-page__list-card-header">
                      <span className="stats-page__question-id">{calc.questionId}</span>
                      <span
                        className={`stats-page__correct-rate ${
                          calc.correctRate >= 80
                            ? 'stats-page__correct-rate--excellent'
                            : calc.correctRate >= 60
                            ? 'stats-page__correct-rate--good'
                            : 'stats-page__correct-rate--poor'
                        }`}
                      >
                        {calc.correctRate}%
                      </span>
                    </div>
                    <div className="stats-page__list-card-body">
                      <span className="stats-page__count">
                        正解 {calc.correctCount} / {calc.totalCount}回
                      </span>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </section>

          <div className="stats-page__actions">
            <Button variant="tertiary" size="medium" onClick={handleClear}>
              記録をリセット
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
