<#
    Usage: .\Register-Pages.ps1 site-name
#>
param(
    [Parameter(Mandatory=$true)][string]$Name
)

. "$PSScriptRoot\Load-DotEnv.ps1"

echo "Account = $Env:CF_ACCOUNT_ID"
echo "Token   = $Env:CF_API_TOKEN"

$body = @{
    name              = $Name
    production_branch = 'main'
    build_config = @{
        build_command   = 'npm run pages:build'
        destination_dir = '.vercel/output'
    }
    source = @{
        type   = 'gitlab'
        config = @{
            owner               = $Env:GROUP
            repo_name           = $Name
            deployments_enabled = $true
        }
    }

    deployment_configs = @{
        production = @{
            environment_variables = @{
                NODE_VERSION = '20'
            }
        }
        preview = @{
            environment_variables = @{
                NODE_VERSION = '20'
            }
        }
    }
} | ConvertTo-Json -Depth 6

Invoke-RestMethod `
    -Method  Post `
    -Uri     "https://api.cloudflare.com/client/v4/accounts/$($Env:CF_ACCOUNT_ID)/pages/projects" `
    -Headers @{ Authorization = "Bearer $($Env:CF_API_TOKEN)" } `
    -ContentType 'application/json' `
    -Body $body
