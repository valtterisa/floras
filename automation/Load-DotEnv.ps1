function Load-DotEnv {
    param(
        [string]$Path = "$PSScriptRoot\..\ .env"
    )
    if (-not (Test-Path $Path)) {
        throw ".env file not found at $Path"
    }

    Get-Content $Path | ForEach-Object {
        if ($_ -match '^\s*#') { return }            # skip comments
        if ($_ -match '^\s*$') { return }            # skip blanks
        if ($_ -match '^\s*([^=]+?)\s*=\s*(.*)$') {
            $name  = $Matches[1].Trim()
            $value = $Matches[2].Trim().Trim("'`"")   # strip quotes
            [System.Environment]::SetEnvironmentVariable($name, $value)
        }
    }
}
