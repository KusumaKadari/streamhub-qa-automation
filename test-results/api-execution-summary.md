# JSONPlaceholder POST /posts API Results

Endpoint: `https://jsonplaceholder.typicode.com/posts`

| Scenario | Actual HTTP status | Actual response body |
|---|---:|---|
| Normal valid request | 201 | `{"title":"SaveSmart API Test","body":"Valid savings post","userId":7,"id":101}` |
| Excessively long title | 201 | `{"title":"LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL... [2048-character title; full value in api-execution-results.json]","body":"Long-title payload","userId":12,"id":101}` |
| Unsupported special characters | 201 | `{"title":"<script>alert(\"QA\")</script> & % ! @ # $","body":"Symbols: cafÃ© â€” æ±äº¬ â€” ðŸ˜€","userId":9,"id":101}` |
| Missing userId | 201 | `{"title":"Missing user ID","body":"No userId field is supplied","id":101}` |
| Missing required fields | 201 | `{"id":101}` |

## Interpretation
JSONPlaceholder is a mock API. Invalid-looking payloads returned HTTP 201 and echoed the supplied fields instead of applying stricter assessment-style validation with 4xx responses.
