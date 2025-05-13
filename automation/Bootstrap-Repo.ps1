<#
    Usage: .\Bootstrap-Repo.ps1 site-name
#>
param(
    [Parameter(Mandatory=$true)][string]$Name
)

. "$PSScriptRoot\Load-DotEnv.ps1"

Invoke-RestMethod `
    -Method  Post `
    -Uri     "https://gitlab.com/api/v4/projects" `
    -Headers @{ 'PRIVATE-TOKEN' = $Env:GITLAB_TOKEN } `
    -Body @{
        name               = $Name
        path               = $Name
        template_project_id= $Env:TEMPLATE_ID
    }
