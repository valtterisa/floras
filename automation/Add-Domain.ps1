<#
    Usage: .\Add-Domain.ps1 site-name www.example.com
#>
param(
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$true)][string]$Domain
)

. "$PSScriptRoot\Load-DotEnv.ps1"

$body = @{ domain = $Domain } | ConvertTo-Json

Invoke-RestMethod `
    -Method  Post `
    -Uri     "https://api.cloudflare.com/client/v4/accounts/$($Env:CF_ACCOUNT_ID)/pages/projects/$Name/domains" `
    -Headers @{ Authorization = "Bearer $($Env:CF_API_TOKEN)" } `
    -ContentType 'application/json' `
    -Body $body
