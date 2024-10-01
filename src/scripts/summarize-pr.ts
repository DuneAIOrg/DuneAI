import * as process from 'node:process'
import { Octokit } from '@octokit/rest'
import { summarizePullRequest } from './orchistrations/SummarizePullRequests'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

const pull_number = Number(process.env.PULL_NUMBER!)
const [owner, repo] = (process.env.REPO ?? '/').split('/')

async function main() {
  const changes = await octokit.rest.pulls.listFiles({
    repo,
    owner,
    pull_number
  })

  const pull = await octokit.rest.pulls.get({
    repo,
    owner,
    pull_number
  })
  if (!pull.data.user) {
    throw new Error('Could not find the user who opened the pull request')
  }

  const comments = await octokit.rest.issues.listComments({
    repo,
    owner,
    // "All pull requests are an issue, but not all issues are pull requests."
    issue_number: pull_number
  })

  // @ts-ignore
  const comment = comments.data[0]
  if (!comment) {
    throw new Error('Could not find the main comment')
  }

  console.log('Summarizing pull request...')
  const newData = await summarizePullRequest(changes)

  // Edit the main comment with the summary
  await octokit.rest.issues.updateComment({
    repo,
    owner,
    comment_id: comment.id,
    body: (comment.body ?? '').split('# Summary by DuneAI')[0] + `# Summary by DuneAI\n${newData}`
  })
}

main().catch(console.error)

