'use client'

import { useGitHubContributions } from '@/hooks/useGitHubContributions'
import { GitHubGrid } from '@/components/home/hero/GitHubGrid'

export default function TestPage() {
  const { contributions, isLoading, isError, errorMessage } = useGitHubContributions({ period: 30 })
  
  if (isLoading) {
    return <div className="p-8">加载中...</div>
  }
  
  if (isError) {
    return (
      <div className="p-8 text-red-500">
        <p>加载失败：{errorMessage}</p>
      </div>
    )
  }
  
  if (!contributions) {
    return <div className="p-8">没有数据</div>
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GitHub 贡献图</h1>
      
      <div className="mb-4">
        <p>总贡献：{contributions.total} 次</p>
        <p>周数：{contributions.contributions.length}</p>
      </div>
      
      <div className="p-6 md:p-8 lg:p-10">
        <GitHubGrid weeks={contributions.contributions} />
      </div>
    </div>
  )
}