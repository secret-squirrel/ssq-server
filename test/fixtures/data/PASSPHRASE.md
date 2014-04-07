`example.pem` and `example.pub` were created with [ssq-cli](https://github.com/secret-squirrel/ssq-cli):

```
node index.js --create-keypair
prompt: bits:  2048
prompt: passPhrase:  foobar
Saved public key to (...)/id_rsa.pub
Saved private key to (...)/id_rsa
```

Where `id_rsa` is `example.pem` and `id_rsa.pub` is `example.pub`.

This operation is equivalent to the following `openssl` commands:

```
openssl genrsa -aes256 -passout pass:foobar -out example.pem 2048
openssl rsa -in example.pem -passin pass:foobar -pubout -out example.pub
```