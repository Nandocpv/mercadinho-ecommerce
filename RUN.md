Instruções para executar o site localmente

1) Criar e ativar um ambiente virtual (opcional mas recomendado):
   python -m venv venv
   venv\Scripts\activate

2) Instalar dependências:
   pip install -r requirements.txt

3) Iniciar o servidor Flask:
   python app.py

4) Abra no navegador:
   http://localhost:5000

Observações:
- O frontend funciona também somente com os arquivos estáticos (index.html, script.js) usando localStorage.
- O backend Flask fornece endpoints em /api/products para listar e adicionar produtos (JSON).
- A interface mostra o dono como "Fernando" e tem fundo com imagem de mercado na seção inicial.
