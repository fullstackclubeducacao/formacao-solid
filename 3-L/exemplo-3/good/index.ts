interface HttpResponse {
  code: number;
  data: string;
}

interface HttpClient {
  get(url: string): HttpResponse;
}

class FetchHttpClient implements HttpClient {
  get(url: string): HttpResponse {
    console.log(`Processando requisição para ${url}`)
    return {
      code: 200,
      data: `{ "msg": "ok"}`
    }
  }
}

class CustomHttpClient implements HttpClient {
  get(url: string): HttpResponse {
    console.log(`Processando requisição para ${url}`)
    return {
      code: 200,
      //Mudamos aqui para garantir o comportamento esperado
      // body: `{ "msg": "ok"}` 
      data: `{ "msg": "ok"}`
    }
  }
}

function isApiHealth(client: HttpClient) {
  const url = "https://api.meunegocio.com/health"
  const response = client.get(url)
  if (response.code === 200) {
    const data = JSON.parse(response.data)
    console.log(data)
    return true
  }
  return false
}

const fetchClient = new FetchHttpClient()
const customClient = new CustomHttpClient()

console.log(`API está saudável utilizando fetchClient: ${isApiHealth(fetchClient)}`)
console.log("\n")
console.log(`API está saudável utilizando customClient: ${isApiHealth(customClient)}`)
