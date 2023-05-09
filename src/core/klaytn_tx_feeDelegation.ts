import { FieldTypeAccountKey } from "./account";
import { RLP, HexStr } from "./util";
import {
  FieldTypeAddress,
  FieldTypeSignatureTuples,
  FieldTypeBool,
  FieldTypeUint8,
  FieldTypeUint64,
  FieldTypeUint256, 
  FieldTypeBytes} from "./field";
import { TypedTx } from "./tx";
import _ from "lodash";

// https://docs.klaytn.foundation/content/klaytn/design/transactions/fee-delegation#txtypefeedelegatedvaluetransfer
export class TypedTxFeeDelegatedValueTransfer extends TypedTx {
  static type = 0x9;
  static typeName = "TxTypeFeeDelegatedValueTransfer";
  static fieldTypes = {
    'type':         FieldTypeUint8,
    'nonce':        FieldTypeUint64,
    'gasPrice':     FieldTypeUint256,
    'gasLimit':     FieldTypeUint64,
    'to':           FieldTypeAddress,
    'value':        FieldTypeUint256,
    'from':         FieldTypeAddress,
    'chainId':      FieldTypeUint64,
    'txSignatures': FieldTypeSignatureTuples,
    'feePayer':     FieldTypeAddress,
    'feePayerSignatures': FieldTypeSignatureTuples,
  };

  sigRLP(): string {
    // SigRLP = encode([encode([type, nonce, gasPrice, gas, to, value, from]), chainid, 0, 0])
    const inner = this.getFields([
      'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from']);
    return RLP.encode([
      RLP.encode(inner), this.getField('chainId'), "0x", "0x"]);
  }

  sigFeePayerRLP(): string {
    // SigFeePayerRLP = encode([ encode([type, nonce, gasPrice, gas, to, value, from]), feePayer, chainid, 0, 0 ])
    const inner = this.getFields([
        'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from']);
    return RLP.encode([
        RLP.encode(inner),  this.getField('feePayer'), this.getField('chainId'), "0x", "0x"]);
  }

  senderTxHashRLP(): string {
    // SenderTxHashRLP = type + encode([nonce, gasPrice, gas, to, value, from, txSignatures])
    const inner = this.getFields([
        'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'txSignatures']);
    return HexStr.concat(
        this.getField('type'), RLP.encode(inner));
  }

  txHashRLP(): string {
    // TxHashRLP = type + encode([nonce, gasPrice, gas, to, value, from, txSignatures, feePayer, feePayerSignatures])
    const inner = this.getFields([
      'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'txSignatures', 'feePayer', 'feePayerSignatures']);
    return HexStr.concat(
      this.getField('type'), RLP.encode(inner));
  }

  setFieldsFromRLP(rlp: string): void {
    // Strip type byte
    rlp = "0x" + rlp.substring(4);
    const array = _.concat([ this.type ], RLP.decode(rlp));
    
    if (array.length == 8) {
      this.setFieldsFromArray([
        'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'txSignatures'
      ], array);
    } else if (array.length == 10) {
      this.setFieldsFromArray([
        'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'txSignatures', 'feePayer', 'feePayerSignatures'
      ], array);
    }
  }
}

// https://docs.klaytn.foundation/content/klaytn/design/transactions/fee-delegation#txtypefeedelegatedvaluetransfermemo
export class TypedTxFeeDelegatedValueTransferMemo extends TypedTx {
  static type = 0x11;
  static typeName = "TxTypeFeeDelegatedValueTransferMemo";
  static fieldTypes = {
    'type':         FieldTypeUint8,
    'nonce':        FieldTypeUint64,
    'gasPrice':     FieldTypeUint256,
    'gasLimit':     FieldTypeUint64,
    'to':           FieldTypeAddress,
    'value':        FieldTypeUint256,
    'from':         FieldTypeAddress,
    'input':        FieldTypeBytes,
    'chainId':      FieldTypeUint64,
    'txSignatures': FieldTypeSignatureTuples,
    'feePayer':     FieldTypeAddress,
    'feePayerSignatures': FieldTypeSignatureTuples,
  };

  sigRLP(): string {
    // SigRLP = encode([encode([type, nonce, gasPrice, gas, to, value, from, input]), chainid, 0, 0])
    const inner = this.getFields([
      'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input']);
    return RLP.encode([
      RLP.encode(inner), this.getField('chainId'), "0x", "0x"]);
  }

  sigFeePayerRLP(): string {
    // SigFeePayerRLP = encode([encode([type, nonce, gasPrice, gas, to, value, from, input]), feePayer, chainid, 0, 0])
    const inner = this.getFields([
        'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input']);
    return RLP.encode([
        RLP.encode(inner),  this.getField('feePayer'), this.getField('chainId'), "0x", "0x"]);
  }

  senderTxHashRLP(): string {
    // SenderTxHashRLP = type + encode([nonce, gasPrice, gas, to, value, from, input, txSignatures])
    const inner = this.getFields([
        'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input', 'txSignatures']);
    return HexStr.concat(
        this.getField('type'), RLP.encode(inner));
  }

  txHashRLP(): string {
    // TxHashRLP = type + encode([nonce, gasPrice, gas, to, value, from, input, txSignatures, feePayer, feePayerSignatures])
    const inner = this.getFields([
      'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input', 'txSignatures', 'feePayer', 'feePayerSignatures']);
    return HexStr.concat(
      this.getField('type'), RLP.encode(inner));
  }

  setFieldsFromRLP(rlp: string): void {
    
  }
}

// https://docs.klaytn.foundation/content/klaytn/design/transactions/fee-delegation#txtypefeedelegatedsmartcontractdeploy
export class TypedTxFeeDelegatedSmartContractDeploy extends TypedTx {
  static type = 0x29;
  static typeName = "TxTypeFeeDelegatedSmartContractDeploy";
  static fieldTypes = {
    'type':         FieldTypeUint8,
    'nonce':        FieldTypeUint64,
    'gasPrice':     FieldTypeUint256,
    'gasLimit':     FieldTypeUint64,
    'to':           FieldTypeAddress,
    'value':        FieldTypeUint256,
    'from':         FieldTypeAddress,
    'input':        FieldTypeBytes,
    'humanReadable': FieldTypeBool,
    'codeFormat':   FieldTypeUint8,
    'chainId':      FieldTypeUint64,
    'txSignatures': FieldTypeSignatureTuples,
    'feePayer':     FieldTypeAddress,
    'feePayerSignatures': FieldTypeSignatureTuples,
  };

  sigRLP(): string {
    // SigRLP = encode([encode([type, nonce, gasPrice, gas, to, value, from, input, humanReadable, codeFormat]), chainid, 0, 0])
    const inner = this.getFields([
      'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input', 'humanReadable', 'codeFormat']);
    // have to do someting in the future 
    inner[4]= "0x";
    return RLP.encode([
      RLP.encode(inner), this.getField('chainId'), "0x", "0x"]);
  }

  sigFeePayerRLP(): string {
    // SigFeePayerRLP = encode([encode([type, nonce, gasPrice, gas, to, value, from, input, humanReadable, codeFormat]), feePayer, chainid, 0, 0])
    const inner = this.getFields([
        'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input', 'humanReadable', 'codeFormat']);
    // have to do someting in the future 
    inner[4]= "0x";
    return RLP.encode([
        RLP.encode(inner),  this.getField('feePayer'), this.getField('chainId'), "0x", "0x"]);
  }

  senderTxHashRLP(): string {
    // SenderTxHashRLP = type + encode([nonce, gasPrice, gas, to, value, from, input, humanReadable, codeFormat, txSignatures])
    const inner = this.getFields([
        'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input', 'humanReadable', 'codeFormat', 'txSignatures']);
    // have to do someting in the future 
    inner[3]= "0x";
    return HexStr.concat(
        this.getField('type'), RLP.encode(inner));
  }

  txHashRLP(): string {
    // TxHashRLP = type + encode([nonce, gasPrice, gas, to, value, from, input, humanReadable, codeFormat, txSignatures, feePayer, feePayerSignatures])
    const inner = this.getFields([
      'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input', 'humanReadable', 'codeFormat', 'txSignatures', 'feePayer', 'feePayerSignatures']);
    // have to do someting in the future 
    inner[3]= "0x";
    return HexStr.concat(
      this.getField('type'), RLP.encode(inner));
  }

  setFieldsFromRLP(rlp: string): void {
    
  }
}

// https://docs.klaytn.foundation/content/klaytn/design/transactions/fee-delegation#txtypefeedelegatedsmartcontractexecution
export class TypedTxFeeDelegatedSmartContractExecution extends TypedTx {
  static type = 0x31;
  static typeName = "TxTypeFeeDelegatedSmartContractExecution";
  static fieldTypes = {
    'type':         FieldTypeUint8,
    'nonce':        FieldTypeUint64,
    'gasPrice':     FieldTypeUint256,
    'gasLimit':     FieldTypeUint64,
    'to':           FieldTypeAddress,
    'value':        FieldTypeUint256,
    'from':         FieldTypeAddress,
    'input':        FieldTypeBytes,
    'chainId':      FieldTypeUint64,
    'txSignatures': FieldTypeSignatureTuples,
    'feePayer':     FieldTypeAddress,
    'feePayerSignatures': FieldTypeSignatureTuples,
  };

  sigRLP(): string {
    // SigRLP = encode([encode([type, nonce, gasPrice, gas, to, value, from, input]), chainid, 0, 0])
    const inner = this.getFields([
      'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input']);
    return RLP.encode([
      RLP.encode(inner), this.getField('chainId'), "0x", "0x"]);
  }

  sigFeePayerRLP(): string {
    // SigFeePayerRLP = encode([encode([type, nonce, gasPrice, gas, to, value, from, input]), feePayer, chainid, 0, 0])
    const inner = this.getFields([
        'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input']);
    return RLP.encode([
        RLP.encode(inner),  this.getField('feePayer'), this.getField('chainId'), "0x", "0x"]);
  }

  senderTxHashRLP(): string {
    // SenderTxHashRLP = type + encode([nonce, gasPrice, gas, to, value, from, input, txSignatures])
    const inner = this.getFields([
        'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input', 'txSignatures']);
    return HexStr.concat(
        this.getField('type'), RLP.encode(inner));
  }

  txHashRLP(): string {
    // TxHashRLP = type + encode([nonce, gasPrice, gas, to, value, from, input, txSignatures, feePayer, feePayerSignatures])
    const inner = this.getFields([
      'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input', 'txSignatures', 'feePayer', 'feePayerSignatures']);
    return HexStr.concat(
      this.getField('type'), RLP.encode(inner));
  }

  setFieldsFromRLP(rlp: string): void {
    
  }
}


// https://docs.klaytn.foundation/content/klaytn/design/transactions/fee-delegation#txtypefeedelegatedaccountupdate
export class TypedTxFeeDelegatedAccountUpdate extends TypedTx {
  static type = 0x21;
  static typeName = "TxTypeFeeDelegatedAccountUpdate";
  static fieldTypes = {
    'type':         FieldTypeUint8,
    'nonce':        FieldTypeUint64,
    'gasPrice':     FieldTypeUint256,
    'gasLimit':     FieldTypeUint64,
    'from':         FieldTypeAddress,
    'key':          FieldTypeAccountKey,
    'chainId':      FieldTypeUint64,
    'txSignatures': FieldTypeSignatureTuples,
    'feePayer':     FieldTypeAddress,
    'feePayerSignatures': FieldTypeSignatureTuples,
  };

  sigRLP(): string {
    // SigRLP = encode([encode([type, nonce, gasPrice, gas, from, rlpEncodedKey]), chainid, 0, 0])
    const inner = this.getFields([
        'type', 'nonce', 'gasPrice', 'gasLimit', 'from', 'key']);
    return RLP.encode([
        RLP.encode(inner), this.getField('chainId'), "0x", "0x"]);
  }

  sigFeePayerRLP(): string {
    // SigFeePayerRLP = encode([encode([type, nonce, gasPrice, gas, from, rlpEncodedKey]), feePayer, chainid, 0, 0])
    const inner = this.getFields([
        'type', 'nonce', 'gasPrice', 'gasLimit', 'from', 'key']);
    return RLP.encode([
        RLP.encode(inner),  this.getField('feePayer'), this.getField('chainId'), "0x", "0x"]);
  }

  senderTxHashRLP(): string {
    // SenderTxHashRLP = type + encode([nonce, gasPrice, gas, from, rlpEncodedKey, txSignatures])
    const inner = this.getFields([
        'nonce', 'gasPrice', 'gasLimit', 'from', 'key', 'txSignatures']);
    return HexStr.concat(
        this.getField('type'), RLP.encode(inner));
  }

  txHashRLP(): string {
    // TxHashRLP = type + encode([nonce, gasPrice, gas, from, rlpEncodedKey, txSignatures, feePayer, feePayerSignatures])
    const inner = this.getFields([
      'nonce', 'gasPrice', 'gasLimit', 'from', 'key', 'txSignatures', 'feePayer', 'feePayerSignatures']);
    return HexStr.concat(
      this.getField('type'), RLP.encode(inner));
  }

  setFieldsFromRLP(rlp: string): void {
    
  }
}

// https://docs.klaytn.foundation/content/klaytn/design/transactions/fee-delegation#txtypefeedelegatedcancel
export class TypedTxFeeDelegatedCancel extends TypedTx {
  static type = 0x39;
  static typeName = "TxTypeFeeDelegatedCancel";
  static fieldTypes = {
    'type':         FieldTypeUint8,
    'nonce':        FieldTypeUint64,
    'gasPrice':     FieldTypeUint256,
    'gasLimit':     FieldTypeUint64,
    'from':         FieldTypeAddress,
    'chainId':      FieldTypeUint64,
    'txSignatures': FieldTypeSignatureTuples,
    'feePayer':     FieldTypeAddress,
    'feePayerSignatures': FieldTypeSignatureTuples,
  };

  sigRLP(): string {
    // SigRLP = encode([encode([type, nonce, gasPrice, gas, from]), chainid, 0, 0])
    const inner = this.getFields([
        'type', 'nonce', 'gasPrice', 'gasLimit', 'from']);
    return RLP.encode([
        RLP.encode(inner), this.getField('chainId'), "0x", "0x"]);
  }

  sigFeePayerRLP(): string {
    // SigFeePayerRLP = encode([encode([type, nonce, gasPrice, gas, from]), feePayer, chainid, 0, 0])
    const inner = this.getFields([
        'type', 'nonce', 'gasPrice', 'gasLimit', 'from']);
    return RLP.encode([
        RLP.encode(inner),  this.getField('feePayer'), this.getField('chainId'), "0x", "0x"]);
  }

  senderTxHashRLP(): string {
    // SenderTxHashRLP = type + encode([nonce, gasPrice, gas, from, txSignatures])
    const inner = this.getFields([
        'nonce', 'gasPrice', 'gasLimit', 'from', 'txSignatures']);
    return HexStr.concat(
        this.getField('type'), RLP.encode(inner));
  }

  txHashRLP(): string {
    // TxHashRLP = type + encode([nonce, gasPrice, gas, from, txSignatures, feePayer, feePayerSignatures])
    const inner = this.getFields([
        'nonce', 'gasPrice', 'gasLimit', 'from', 'txSignatures', 'feePayer', 'feePayerSignatures']);
    return HexStr.concat(
        this.getField('type'), RLP.encode(inner));
  }

  setFieldsFromRLP(rlp: string): void {
    
  }
}

// https://docs.klaytn.foundation/content/klaytn/design/transactions/fee-delegation#txtypefeedelegatedchaindataanchoring
export class TypedTxFeeDelegatedChainDataAnchoring extends TypedTx {
  static type = 0x49;
  static typeName = "TxTypeFeeDelegatedChainDataAnchoring";
  static fieldTypes = {
    'type':         FieldTypeUint8,
    'nonce':        FieldTypeUint64,
    'gasPrice':     FieldTypeUint256,
    'gasLimit':     FieldTypeUint64,
    'from':         FieldTypeAddress,
    'input':        FieldTypeBytes,
    'chainId':      FieldTypeUint64,
    'txSignatures': FieldTypeSignatureTuples,
    'feePayer':     FieldTypeAddress,
    'feePayerSignatures': FieldTypeSignatureTuples,
  };

  sigRLP(): string {
    // SigRLP = encode([encode([type, nonce, gasPrice, gas, from, anchoredData]), chainid, 0, 0])
    const inner = this.getFields([
      'type', 'nonce', 'gasPrice', 'gasLimit', 'from', 'input']);
    return RLP.encode([
      RLP.encode(inner), this.getField('chainId'), "0x", "0x"]);
  }

  sigFeePayerRLP(): string {
    // SigFeePayerRLP = encode([encode([type, nonce, gasPrice, gas, from, anchoredData]), feePayer, chainid, 0, 0])
    const inner = this.getFields([
        'type', 'nonce', 'gasPrice', 'gasLimit', 'from', 'input']);
    return RLP.encode([
        RLP.encode(inner),  this.getField('feePayer'), this.getField('chainId'), "0x", "0x"]);
  }

  senderTxHashRLP(): string {
    // SenderTxHashRLP = type + encode([nonce, gasPrice, gas, from, anchoredData, txSignatures])
    const inner = this.getFields([
        'nonce', 'gasPrice', 'gasLimit', 'from', 'input', 'txSignatures']);
    return HexStr.concat(
        this.getField('type'), RLP.encode(inner));
  }

  txHashRLP(): string {
    // TxHashRLP = type + encode([nonce, gasPrice, gas, from, anchoredData, txSignatures, feePayer, feePayerSignatures])
    const inner = this.getFields([
      'nonce', 'gasPrice', 'gasLimit', 'from', 'input', 'txSignatures', 'feePayer', 'feePayerSignatures' ]);
    return HexStr.concat(
      this.getField('type'), RLP.encode(inner));
  }

  setFieldsFromRLP(rlp: string): void {
    
  }
}