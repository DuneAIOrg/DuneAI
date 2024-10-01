// import { Octokit } from 'octokit'
import * as process from 'node:process'
import { resolve } from 'node:path'
import { summarizePullRequest } from './orchistrations/SummarizePullRequests'
import { loadModel } from 'gpt4all'

// const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

process.env.DEFAULT_MODEL = 'Nous-Hermes-2-Mistral-7B-DPO.Q4_0.gguf'
process.env.DEFAULT_ADAPTER = 'gpt4all'

async function main() {
  console.log('Loading model...')
  const model = await loadModel('Nous-Hermes-2-Mistral-7B-DPO.Q4_0.gguf', {
    modelPath: resolve(process.cwd(), 'src/scripts/models'),
  })
  console.log('Creating chat session...')
  const session = await model.createChatSession()

  console.log('Summarizing pull request...')
  const body = await summarizePullRequest(session)

  // await octokit.rest.issues.createComment({
  //   body,
  //   repo: process.env.REPO_NAME,
  //   owner: process.env.REPO_OWNER,
  //   issue_number: process.env.PULL_NUMBER
  // })
  console.log(body)
}

main().catch(console.error)

