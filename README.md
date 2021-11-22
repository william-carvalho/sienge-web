# Sienge Web

## Development
Para configurar e executar este projeto, a partir do seguinte:

```
npm install
bower install
grunt setup
grunt build --force
grunt devel
```
## Acessar o ambiente 
Após executado os comandos descritos acima você pode acessar o ambiente (CRUD'S) pelas url's:

```
localhost:9000/#/transporte
localhost:9000/#/rodovia
localhost:9000/#/veiculo
localhost:9000/#/tiporodovia
localhost:9000/#/tipoveiculo
```

## optimised Using r.js
Para criar uma versão otimizada de `r.js` do código no diretório` build`. Observe que o script JS neste estágio é
deixado no estado não minimizado. Isso permitirá mais testes, garantindo que o código otimizado seja feito corretamente e
trabalho.

```
grunt build --force
```

## Deploy
Para criar uma versão final a ser implantada. O código será fonte do diretório `build` e apenas o necessário
os arquivos são copiados e reduzidos para o diretório `dist`.

```
grunt deploy --force
```
