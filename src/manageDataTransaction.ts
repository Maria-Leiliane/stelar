import StellarSdk from 'stellar-sdk';  // Import correto para Stellar SDK
import 'dotenv/config';

// Configuração para a rede principal da Stellar
const server = new StellarSdk.Server('https://horizon.stellar.org');
const sourceSecret = process.env.STELLAR_SECRET_KEY;  // Insira sua chave privada aqui
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);

(async () => {
  try {
    // Carregar a conta de origem
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    // Construir a transação com manageData_op e memo
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: StellarSdk.Networks.PUBLIC
    })
      .addOperation(StellarSdk.Operation.manageData({
        name: 'DEV30K',
        value: 'ASSINATURA_BASE64'  // Insira o valor da assinatura em base64
      }))
      .addMemo(StellarSdk.Memo.text('DEV30K'))
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    console.log('Transação com manageData bem-sucedida! Hash:', result.hash);
  } catch (error) {
    console.error('Falha na transação com manageData:', error);
  }
})();
