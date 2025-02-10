# API Golden Raspberry Awards

Este projeto é uma API RESTful desenvolvida com NestJS para processar e analisar os dados do Golden Raspberry Awards.

## Configuração e Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/mathras/goldenRaspberry
   cd goldenRaspberry
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Inicie o servidor:
   ```sh
   npm run start
   ```

## Rodando os Testes de Integração

1. Execute os testes:
   ```sh
   npm run test:e2e
   ```

Os testes verificam se os dados de prêmios dos produtores são retornados corretamente.

##  Endpoints Disponíveis
### `GET /movies/producer-awards`
**Retorna os produtores com os maiores e menores intervalos entre prêmios.**

**Exemplo de resposta:**
```json
{
  "min": [{ "producer": "John Doe", "interval": 1, "previousWin": 2000, "followingWin": 2001 }],
  "max": [{ "producer": "Jane Smith", "interval": 10, "previousWin": 1990, "followingWin": 2000 }]
}
```

## Tecnologias Utilizadas
- **NestJS**
- **TypeORM**
- **SQLite** (banco de dados em memória para testes)
- **Jest + Supertest** (testes de integração)