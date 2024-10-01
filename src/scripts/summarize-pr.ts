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

  if (!pull) {
    throw new Error('Pull request not found')
  }

  console.log('Summarizing pull request...')
  const newData = await summarizePullRequest(changes)

  const existing = (pull.data.body ?? '').split('<!-- end-duneai-summary -->')[1]

  // Edit the main comment with the summary
  await octokit.rest.pulls.update({
    repo,
    owner,
    pull_number,
    body: `# Summary by DuneAI\n${newData}\n<!-- end-duneai-summary -->\n${existing}`
  })
}

main()

