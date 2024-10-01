import * as process from 'node:process'
import { Octokit } from '@octokit/rest'
import { summarizePullRequest } from './orchistrations/SummarizePullRequests'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

async function main() {
  const changes = await octokit.rest.pulls.listFiles({
    repo: process.env.REPO_NAME!,
    owner: process.env.REPO_OWNER!,
    pull_number: Number(process.env.PULL_NUMBER!)
  })

  const pull = await octokit.rest.pulls.get({
    repo: process.env.REPO_NAME!,
    owner: process.env.REPO_OWNER!,
    pull_number: Number(process.env.PULL_NUMBER!)
  })
  if (!pull.data.user) {
    throw new Error('Could not find the user who opened the pull request')
  }

  const comments = await octokit.rest.issues.listComments({
    repo: process.env.REPO_NAME!,
    owner: process.env.REPO_OWNER!,
    issue_number: Number(process.env.PULL_NUMBER!)
  })

  // @ts-ignore
  const comment = comments.data.find((comment) => comment.user?.id === pull.data.user.id)
  if (!comment) {
    throw new Error('Could not find the main comment')
  }

  console.log('Summarizing pull request...')
  const newData = await summarizePullRequest(changes)

  // Edit the main comment with the summary
  await octokit.rest.issues.updateComment({
    repo: process.env.REPO_NAME!,
    owner: process.env.REPO_OWNER!,
    comment_id: comment.id,
    body: (comment.body ?? '').split('# Summary by DuneAI')[0] + `# Summary by DuneAI\n${newData}`
  })
}

main().catch(console.error)

