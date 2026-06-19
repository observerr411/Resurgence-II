// Main library entry point for all Soroban contracts
// This module aggregates all contract modules

#![no_std]

pub mod aid_registry;
pub mod anti_fraud;
pub mod beneficiary_manager;
pub mod cash_transfer;
pub mod merchant_network;
pub mod supply_chain_tracker;

pub use aid_registry::AidRegistryContract;
pub use anti_fraud::AntiFraudContract;
pub use beneficiary_manager::BeneficiaryManagerContract;
pub use cash_transfer::CashTransferContract;
pub use merchant_network::MerchantNetworkContract;
pub use supply_chain_tracker::SupplyChainTrackerContract;
