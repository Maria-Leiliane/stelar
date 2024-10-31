import * as crypto from 'crypto';
import * as Keypair from 'stellar-sdk';

const message = 'DEV30K';
const signature = crypto.sign('sha256', Buffer.from(message), {
  key: sourceKeypair.secret(),
  padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
});

(async () => {
  try {
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: StellarSdk.Networks.PUBLIC  // Mainnet
    })
      .addOperation(StellarSdk.Operation.manageData({
        name: 'DEV30K Signature',
        value: signature.toString('base64')  // Assinatura codificada
      }))
      .addMemo(StellarSdk.Memo.text('DEV30K'))
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    console.log('Transaction with manageData successful! Hash:', result.hash);
  } catch (error) {
    console.error('Transaction with manageData failed:', error);
  }
})();
