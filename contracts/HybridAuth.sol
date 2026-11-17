// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

/**
 * HybridAuth
 * ----------
 *
 * Ethereum-compatible stateful transaction layer for the
 * proposed ECDSA + ML-DSA-65 hybrid authentication framework.
 *
 * IMPORTANT:
 * Cryptographic ML-DSA-65 verification is performed by the
 * off-chain Python research layer.
 *
 * This contract provides:
 *     - transaction state
 *     - sender nonce
 *     - replay protection
 *     - transaction uniqueness
 *     - hybrid acceptance policy
 *
 * Author:
 * Md. Tanvir Hasan
 */

contract HybridAuth {

    // ========================================================
    // State
    // ========================================================

    mapping(address => uint256) public nonce;

    mapping(bytes32 => bool) public processedTransactions;

    // ========================================================
    // Events
    // ========================================================

    event HybridTransactionAccepted(
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        uint256 txNonce,
        bytes32 indexed transactionId
    );

    // ========================================================
    // Transaction submission
    // ========================================================

    function submitTransaction(
        address receiver,
        uint256 amount,
        uint256 txNonce,
        bytes32 transactionId,
        bool ecdsaValid,
        bool mlDsaValid
    )
        external
        returns (bool)
    {

        // ----------------------------------------------------
        // Nonce validation
        // ----------------------------------------------------

        require(
            txNonce == nonce[msg.sender],
            "Invalid nonce"
        );

        // ----------------------------------------------------
        // Replay protection
        // ----------------------------------------------------

        require(
            !processedTransactions[transactionId],
            "Transaction already processed"
        );

        // ----------------------------------------------------
        // Hybrid AND verification policy
        // ----------------------------------------------------

        require(
            ecdsaValid && mlDsaValid,
            "Hybrid verification failed"
        );

        // ----------------------------------------------------
        // Mark transaction as processed
        // ----------------------------------------------------

        processedTransactions[
            transactionId
        ] = true;

        // ----------------------------------------------------
        // Increment nonce
        // ----------------------------------------------------

        nonce[msg.sender]++;

        // ----------------------------------------------------
        // Emit event
        // ----------------------------------------------------

        emit HybridTransactionAccepted(
            msg.sender,
            receiver,
            amount,
            txNonce,
            transactionId
        );

        return true;
    }
}
