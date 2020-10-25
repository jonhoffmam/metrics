//Setup
  export default function ({login, imports, rest, computed, pending, q}, {enabled = false} = {}) {
    //Check if plugin is enabled and requirements are met
      if (!enabled)
        return computed.plugins.selfskip = null
      if (!q.selfskip)
        return computed.plugins.selfskip = null
      console.debug(`metrics/compute/${login}/plugins > selfskip`)

    //Plugin execution
      pending.push(new Promise(async solve => {
        try {
          //Search for auto-generated commits
            let commits = 0
            for (let page = 0;;page++) {
              const {data} = await rest.repos.listCommits({owner:login, repo:login, author:login, per_page:100, page})
              commits += data.filter(({commit}) => /\[Skip GitHub Action\]/.test(commit.message)).length
              if (!data.length)
                break
            }
          //Save results
            computed.plugins.selfskip = {commits}
            computed.commits -= commits
            console.debug(`metrics/compute/${login}/plugins > selfskip > success`)
            console.debug(JSON.stringify(computed.plugins.selfskip))
            solve()
        }
        catch (error) {
          //Generic error
            computed.plugins.selfskip = {error:`An error occured`}
            console.debug(`metrics/compute/${login}/plugins > selfskip > error`)
            console.debug(error)
            solve()
        }
      }))
  }