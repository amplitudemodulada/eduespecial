$headers = @{
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcXpjcGNlc3Vvcmp6YnJoZW1hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQxNjI2OCwiZXhwIjoyMDkyOTkyMjY4fQ.Yi8xUovVWvXQUu3YbEsCFSy7VBiazyK5CkKBPW6iTMo"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcXpjcGNlc3Vvcmp6YnJoZW1hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQxNjI2OCwiZXhwIjoyMDkyOTkyMjY4fQ.Yi8xUovVWvXQUu3YbEsCFSy7VBiazyK5CkKBPW6iTMo"
    "Content-Type" = "application/json"
    "Prefer" = "resolution=merge-duplicates"
}

$body = @{
    "email" = "admin@escola.com"
    "password" = "123456"
    "role" = "admin"
    "nome" = "Administrador"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://jiqzcpcesuorjzbrhema.supabase.co/rest/v1/users" -Method Post -Headers $headers -Body $body